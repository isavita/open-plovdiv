import { createHash } from "node:crypto";
import { readFile, realpath, stat, writeFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { htmlToMarkdown, MAX_MARKDOWN_SOURCE_BYTES } from "../../apps/web/server/llm-markdown.mjs";

const ORIGIN = "https://openplovdiv.com";
const decode = (s) => s.replace(/&(amp|lt|gt|quot|apos);/g, (_, n) => ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" })[n]);

export function sitemapUrls(xml) {
  const result = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(decode(match[1])));
  if (!result.length || result.length > 50000) throw new Error("Sitemap is empty or exceeds its URL limit");
  const seen = new Set();
  for (const url of result) {
    if (url.origin !== ORIGIN || url.search || url.hash || seen.has(url.href)) throw new Error("Invalid sitemap URL");
    seen.add(url.href);
  }
  return result;
}

function relevantHead(html) {
  const end = html.indexOf("</head>");
  if (end < 0) throw new Error("HTML head missing");
  const head = html.slice(0, end);
  // Include search-facing metadata, including structured data. Avoid asset
  // hashes, inline scripts and styling that do not change indexable content.
  const title = head.match(/<title\b[^>]*>[\s\S]*?<\/title>/i)?.[0] || "";
  const meta = [...head.matchAll(/<meta\b[^>]*(?:name="(?:description|robots)"|property="og:)[^>]*>/gi)].map((m) => m[0]);
  const jsonLd = [...head.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi)].map((m) => m[0]);
  return [title, ...meta, ...jsonLd].join("\n");
}

async function relevantClientData(html, root, fileHashes) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!main) throw new Error("HTML main content missing");
  const configs = [];
  const paths = new Set();
  const visit = (value) => {
    if (typeof value === "string" && /^\/(?:api|data)\/[^?#]+\.json(?:\?[^#]*)?$/.test(value)) {
      paths.add(new URL(value, ORIGIN).pathname);
    } else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  };
  for (const [, attributes, contents] of main.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\btype=["']application\/json["']/i.test(attributes)) continue;
    configs.push(contents);
    visit(JSON.parse(contents));
  }
  for (const path of [...paths].sort()) {
    if (!fileHashes.has(path)) {
      const file = resolve(root, `.${decodeURIComponent(path)}`);
      if (!file.startsWith(root + sep)) throw new Error("Client data escapes build directory");
      try {
        const actual = await realpath(file);
        if (!actual.startsWith(root + sep)) throw new Error("Client data escapes build directory");
        fileHashes.set(path, createHash("sha256").update(await readFile(actual)).digest("hex"));
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        fileHashes.set(path, "missing");
      }
    }
    configs.push(`${path}:${fileHashes.get(path)}`);
  }
  return configs.join("\n");
}

export async function buildManifest(directory, sha, deployedAt, deploymentId) {
  if (!/^[a-f0-9]{40}$/.test(sha) || !Number.isFinite(Date.parse(deployedAt)) || !Number.isSafeInteger(deploymentId) || deploymentId < 1) throw new Error("Invalid deployment metadata");
  const root = await realpath(directory);
  const urls = sitemapUrls(await readFile(resolve(root, "sitemap.xml"), "utf8"));
  const pages = {};
  const fileHashes = new Map();
  for (const url of urls) {
    const filename = await realpath(resolve(root, `.${decodeURIComponent(url.pathname)}`, "index.html"));
    if (!filename.startsWith(root + sep)) throw new Error("Sitemap page escapes build directory");
    const info = await stat(filename);
    if (!info.isFile() || info.size > MAX_MARKDOWN_SOURCE_BYTES) throw new Error("Invalid sitemap page");
    const html = await readFile(filename, "utf8");
    const page = htmlToMarkdown(html);
    if (page.canonical !== url.href) throw new Error(`Canonical mismatch: ${url.href}`);
    const clientData = await relevantClientData(html, root, fileHashes);
    pages[url.href] = createHash("sha256").update(relevantHead(html)).update("\n").update(page.markdown).update("\n").update(clientData).digest("hex");
  }
  return { schema: 1, sha, deployedAt, deploymentId, pages };
}

export function validateManifest(manifest) {
  if (manifest?.schema !== 1 || !/^[a-f0-9]{40}$/.test(manifest.sha || "") || !Number.isFinite(Date.parse(manifest.deployedAt)) || !Number.isSafeInteger(manifest.deploymentId) || manifest.deploymentId < 1 || !manifest.pages || Array.isArray(manifest.pages)) throw new Error("Invalid IndexNow baseline");
  for (const [url, hash] of Object.entries(manifest.pages)) {
    if (new URL(url).origin !== ORIGIN || !/^[a-f0-9]{64}$/.test(hash)) throw new Error("Invalid IndexNow page in baseline");
  }
  return manifest;
}

export function changedUrls(previous, current) {
  validateManifest(previous); validateManifest(current);
  return [...new Set([...Object.keys(previous.pages), ...Object.keys(current.pages)])]
    .filter((url) => previous.pages[url] !== current.pages[url]).sort();
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [command, directory, output, sha, deployedAt, deploymentId] = process.argv.slice(2);
  if (command !== "build" || !directory || !output) throw new Error("Usage: manifest.mjs build <client-dir> <output> <sha> <deployed-at> <deployment-id>");
  const manifest = await buildManifest(resolve(directory), sha, deployedAt, Number(deploymentId));
  await writeFile(output, JSON.stringify(manifest));
  console.log(`IndexNow snapshot contains ${Object.keys(manifest.pages).length} pages.`);
}
