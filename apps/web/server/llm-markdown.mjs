import { readFile, realpath, stat } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseHTML } from "linkedom";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { applyCompression } from "./compression.mjs";

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../dist/client");
export const MAX_MARKDOWN_SOURCE_BYTES = 5 * 1024 * 1024;
const maximumCacheBytes = 4 * 1024 * 1024;
const maximumCacheEntries = 32;
const cache = new Map();
let cachedBytes = 0;

// Reject traversal and encoded separators before resolving either a page
// alias or an existing static Markdown file inside the immutable build.
function decodedMarkdownPath(requestUrl) {
  const raw = String(requestUrl ?? "").split("?")[0];
  if (!raw.startsWith("/") || /%(?:2f|5c|00)/i.test(raw) || raw.includes("\\")) return null;
  let decoded;
  try { decoded = decodeURIComponent(raw); } catch { return null; }
  if (decoded.startsWith("//") || decoded.includes("\0") || decoded.includes("\\") ||
      decoded.split("/").some((part) => part === "." || part === "..")) return null;
  return decoded.toLowerCase().endsWith(".md") ? decoded : null;
}

export function markdownPagePath(requestUrl) {
  const decoded = decodedMarkdownPath(requestUrl);
  if (!decoded) return null;
  if (decoded.endsWith("/index.md")) return decoded.slice(0, -"index.md".length) + "index.html";
  if (decoded.endsWith("/.md")) return null;
  return decoded.slice(0, -".md".length) + "/index.html";
}

export function isMarkdownRequest(requestUrl) {
  return String(requestUrl ?? "").split("?")[0].toLowerCase().endsWith(".md");
}

function chineseMarkdownAlternate(document, canonical) {
  const origin = new URL(canonical).origin;
  for (const link of document.querySelectorAll("link[hreflang][href]")) {
    if (link.getAttribute("hreflang")?.toLowerCase() !== "zh" ||
        !link.getAttribute("rel")?.toLowerCase().split(/\s+/).includes("alternate")) continue;
    try {
      const href = link.getAttribute("href")?.trim();
      if (!href) continue;
      const url = new URL(href, canonical);
      if (url.origin !== origin || url.username || url.password || url.search || url.hash) continue;
      const path = `${url.pathname.replace(/\/+$/, "")}/index.md`;
      if (!markdownPagePath(path)) continue;
      url.pathname = path;
      return url.href.replace(/\(/g, "%28").replace(/\)/g, "%29");
    } catch { /* Ignore malformed alternate links. */ }
  }
  return null;
}

export function htmlToMarkdown(html, fallbackCanonical) {
  const { document } = parseHTML(html);
  const main = document.querySelector("main");
  if (!main) throw new Error("Generated page has no main content");
  const link = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
  let canonical;
  try {
    const url = new URL(link || fallbackCanonical);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("Invalid origin");
    canonical = url.href;
  } catch { throw new Error("Generated page has no valid canonical URL"); }
  const chineseAlternate = chineseMarkdownAlternate(document, canonical);
  const llmsIndex = new URL("/llms.txt", canonical).href;
  const language = document.documentElement.getAttribute("lang") || "";
  const title = document.querySelector("title")?.textContent?.trim() || "Open Plovdiv";
  const primaryHeading = main.querySelector("h1");
  const pageHeading = primaryHeading?.textContent?.trim() || title;
  primaryHeading?.remove();

  main.querySelectorAll("script, style, noscript, nav, svg, form, dialog, select, input, textarea, template, [hidden]")
    .forEach((node) => node.remove());
  // Empty-alt images are decorative, but retain nearby visible attribution.
  main.querySelectorAll('img[alt=""]').forEach((node) => node.remove());
  for (const node of main.querySelectorAll("a[href], img[src]")) {
    const attribute = node.localName === "a" ? "href" : "src";
    const value = node.getAttribute(attribute);
    try {
      const url = new URL(value, canonical);
      if (["http:", "https:", "mailto:"].includes(url.protocol)) node.setAttribute(attribute, url.href);
      else node.removeAttribute(attribute);
    } catch { node.removeAttribute(attribute); }
  }
  // Astro compacts adjacent inline tags, so insert a word boundary where
  // separate visual labels would otherwise concatenate in Markdown.
  for (const node of main.querySelectorAll("span, a, strong, em, small, time")) {
    const next = node.nextSibling;
    if (next?.nodeType === 1 && ["SPAN", "A", "STRONG", "EM", "SMALL", "TIME"].includes(next.nodeName)) {
      node.parentNode.insertBefore(document.createTextNode(" "), next);
    }
  }
  const converter = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced" });
  converter.use(gfm);
  const content = converter.turndown(main.outerHTML).trim();
  const heading = `# ${pageHeading.replace(/\s+/g, " ")}\n\n`;
  return {
    canonical,
    markdown: `${heading}Source: ${canonical}\n${language ? `Language: ${language}\n` : ""}[LLM site index](${llmsIndex})\n${chineseAlternate ? `[Simplified Chinese (简体中文)](${chineseAlternate})\n` : ""}\nThis is a text version of the server-rendered page. Interactive or dynamically loaded content may be omitted.\n\n${content}\n`
  };
}

function remember(key, value) {
  const bytes = Buffer.byteLength(value.markdown);
  if (bytes > maximumCacheBytes) return;
  while (cache.size && (cache.size >= maximumCacheEntries || cachedBytes + bytes > maximumCacheBytes)) {
    const oldest = cache.keys().next().value;
    cachedBytes -= cache.get(oldest).bytes;
    cache.delete(oldest);
  }
  cache.set(key, { ...value, bytes });
  cachedBytes += bytes;
}

export async function serveMarkdownPage(request, response, options = {}) {
  const markdownPath = decodedMarkdownPath(request.url);
  const pagePath = markdownPagePath(request.url);
  if (!pagePath || !markdownPath) { response.statusCode = 404; response.end(); return true; }
  const root = await realpath(options.root || defaultRoot);

  // Real .md assets take precedence over generated page aliases. Let Astro's
  // static handler serve them as before, including its normal method policy.
  const assetCandidate = resolve(root, `.${markdownPath}`);
  if (assetCandidate.startsWith(root + sep)) {
    try {
      const asset = await realpath(assetCandidate);
      if (asset.startsWith(root + sep) && (await stat(asset)).isFile()) return false;
    } catch { /* No static Markdown asset; try the corresponding page. */ }
  }
  if (!["GET", "HEAD"].includes(String(request.method).toUpperCase())) {
    response.statusCode = 405; response.setHeader("Allow", "GET, HEAD"); response.end(); return true;
  }
  const candidate = resolve(root, `.${pagePath}`);
  if (!candidate.startsWith(root + sep)) { response.statusCode = 404; response.end(); return true; }
  let file, info;
  try {
    file = await realpath(candidate);
    if (!file.startsWith(root + sep)) throw new Error("outside build");
    info = await stat(file);
    if (!info.isFile() || info.size > MAX_MARKDOWN_SOURCE_BYTES) throw new Error("invalid page");
  } catch { response.statusCode = 404; response.end(); return true; }

  const key = `${file}\0${info.mtimeMs}\0${info.size}`;
  let result = cache.get(key);
  if (result) { cache.delete(key); cache.set(key, result); }
  else {
    result = htmlToMarkdown(await readFile(file, "utf8"), options.fallbackCanonical);
    remember(key, result);
  }
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/markdown; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=300");
  response.setHeader("X-Robots-Tag", "noindex");
  response.setHeader("Link", `<${result.canonical}>; rel="canonical", </llms.txt>; rel="describedby"`);
  if (String(request.method).toUpperCase() === "HEAD") { response.end(); return true; }
  applyCompression(request, response);
  response.end(result.markdown);
  return true;
}
