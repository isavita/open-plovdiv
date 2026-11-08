import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { createServer } from "node:net";
import { request as httpRequest } from "node:http";
import { resolve, sep } from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { parseHTML } from "linkedom";
import { MAX_MARKDOWN_SOURCE_BYTES, markdownPagePath } from "../../apps/web/server/llm-markdown.mjs";

// Exercise the actual production boundary, including dynamic Markdown responses.
// The server runs locally; canonical URLs are checked but never fetched remotely.
const client = resolve("apps/web/dist/client");
const entry = resolve("apps/web/server/production-server.mjs");
const sitemapPath = resolve(client, "sitemap.xml");
if (!existsSync(sitemapPath) || !existsSync(resolve("apps/web/dist/server/entry.mjs"))) {
  throw new Error("Build the site before validating llms.txt and Markdown pages");
}
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const decode = (value) => value.replace(/&(amp|lt|gt|quot|apos|#39|#x27);/g, (_, entity) => ({
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'", "#x27": "'"
})[entity]);
const sitemap = readFileSync(sitemapPath, "utf8");
const pageUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(decode(match[1])));
assert(pageUrls.length, "The generated sitemap has no pages");
const siteOrigin = pageUrls[0].origin;

async function getPort() {
  const probe = createServer();
  await new Promise((resolveListen, reject) => probe.once("error", reject).listen(0, "127.0.0.1", resolveListen));
  const port = probe.address().port;
  await new Promise((resolveClose, reject) => probe.close((error) => error ? reject(error) : resolveClose()));
  return port;
}

function linkTags(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => {
    const attributes = {};
    for (const [, name, value] of tag.matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)) attributes[name.toLowerCase()] = decode(value);
    return attributes;
  });
}

function localPath(url) {
  const parsed = new URL(url, siteOrigin);
  assert(parsed.origin === siteOrigin && !parsed.username && !parsed.password, `Unexpected site URL: ${url}`);
  return `${parsed.pathname}${parsed.search}`;
}

function checkVisibleLinks(html, canonical, { home = false } = {}) {
  const { document } = parseHTML(html);
  for (const menu of [".nav-more", ".nav-groups"]) {
    const guide = document.querySelector(`${menu} a[data-menu-key="llms.txt"]`);
    assert(guide && guide.getAttribute("href") === "/llms.txt" && guide.textContent.trim(),
      `${canonical}: missing labelled guide link in ${menu}`);
  }
  const pageLink = document.querySelector("main nav.page-markdown-tools a.page-markdown-link");
  const expected = new URL(canonical).pathname === "/" ? `${canonical}index.md` : `${canonical}.md`;
  assert(pageLink && new URL(pageLink.getAttribute("href"), canonical).href === expected && pageLink.textContent.trim(),
    `${canonical}: missing visible Markdown link`);
  if (home) {
    const guide = document.querySelector('main a.home-llms-link[href="/llms.txt"]');
    assert(guide && guide.textContent.trim(), `${canonical}: homepage guide link missing`);
  }
}

// Cover every listed page, not only the HTTP samples below. The converter
// reads these same generated HTML files and rejects files over its size limit.
const realClient = realpathSync(client);
for (const page of pageUrls) {
  assert(page.origin === siteOrigin, `Unexpected sitemap origin: ${page.href}`);
  const file = realpathSync(resolve(realClient, `.${decodeURIComponent(page.pathname)}`, "index.html"));
  assert(file.startsWith(realClient + sep), `Page escapes build directory: ${page.href}`);
  const info = statSync(file);
  assert(info.isFile() && info.size <= MAX_MARKDOWN_SOURCE_BYTES, `Markdown source unavailable or too large: ${page.href}`);
  // Both representations must map to the same immutable page for every
  // sitemap entry, not just the live request samples below.
  const pagePath = page.pathname.replace(/\/+$/, "");
  const htmlPath = `${decodeURIComponent(pagePath)}/index.html`;
  assert(markdownPagePath(`${pagePath}/index.md`) === htmlPath, `Directory Markdown mapping failed for ${page.href}`);
  assert(!existsSync(resolve(realClient, `.${decodeURIComponent(pagePath)}/index.md`)), `Static file shadows the Markdown version of ${page.href}`);
  if (pagePath) {
    assert(markdownPagePath(`${pagePath}.md`) === htmlPath, `Short Markdown mapping failed for ${page.href}`);
    assert(!existsSync(resolve(realClient, `.${decodeURIComponent(pagePath)}.md`)), `Static file shadows the short Markdown version of ${page.href}`);
  }
  const html = readFileSync(file, "utf8");
  assert(/<main(?:\s|>)/i.test(html), `Markdown source has no main content: ${page.href}`);
  const head = html.slice(0, html.indexOf("</head>") + "</head>".length);
  const links = linkTags(head);
  const canonical = links.find((link) => link.rel === "canonical")?.href;
  const alternate = links.find((link) => link.rel === "alternate" && link.type === "text/markdown")?.href;
  const describedBy = links.find((link) => link.rel === "describedby")?.href;
  assert(canonical === page.href, `Incorrect canonical URL on ${page.href}`);
  assert(alternate === `${page.href.replace(/\/+$/, "")}/index.md`, `Incorrect Markdown alternate on ${page.href}`);
  assert(describedBy && localPath(describedBy) === "/llms.txt", `Missing llms.txt discovery on ${page.href}`);
}

const port = await getPort();
const origin = `http://127.0.0.1:${port}`;
const environment = { ...process.env, NODE_ENV: "production", HOST: "127.0.0.1", PORT: String(port) };
delete environment.SERVER_CERT_PATH;
delete environment.SERVER_KEY_PATH;
const server = spawn(process.execPath, [entry], { env: environment, stdio: ["ignore", "pipe", "pipe"] });
let output = "";
server.stdout.on("data", (chunk) => { output = (output + chunk).slice(-6000); });
server.stderr.on("data", (chunk) => { output = (output + chunk).slice(-6000); });
let exited = false;
server.once("exit", () => { exited = true; });

async function request(path, options = {}) {
  return fetch(`${origin}${path}`, { ...options, redirect: "manual", signal: AbortSignal.timeout(15000) });
}

// fetch() normalizes dot-segments before sending them. Use the raw HTTP path
// so the production boundary actually receives the attempted traversal.
async function rawStatus(path) {
  return new Promise((resolveStatus, reject) => {
    const req = httpRequest({ host: "127.0.0.1", port, path, method: "GET" }, (response) => {
      response.resume();
      response.on("end", () => resolveStatus(response.statusCode));
    });
    req.on("error", reject);
    req.setTimeout(15000, () => req.destroy(new Error("Raw request timed out")));
    req.end();
  });
}

async function waitForServer() {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline && !exited) {
    try {
      const response = await request("/");
      if (response.ok) { await response.body?.cancel(); return; }
    } catch { /* Server is still starting. */ }
    await delay(200);
  }
  throw new Error(`Production server failed to start: ${output}`);
}

async function checkMarkdown(path, canonical) {
  const response = await request(path);
  assert(response.status === 200, `${path}: expected 200, got ${response.status}`);
  assert(/^text\/markdown\b/i.test(response.headers.get("content-type") || ""), `${path}: incorrect content type`);
  assert(response.headers.get("x-robots-tag") === "noindex", `${path}: missing noindex header`);
  const links = response.headers.get("link") || "";
  assert(links.includes(`<${canonical}>; rel="canonical"`), `${path}: missing canonical source Link header`);
  assert(/<\/llms\.txt>;\s*rel="describedby"/i.test(links), `${path}: missing llms.txt Link header`);
  const text = await response.text();
  assert(text.includes(`Source: ${canonical}`), `${path}: missing source URL`);
  assert(/^#\s+\S/m.test(text) && text.trim().length > 150, `${path}: missing useful page content`);
  assert(!/<(?:script|nav|html)\b/i.test(text), `${path}: contains HTML chrome`);
  return text;
}

try {
  await waitForServer();
  const indexResponse = await request("/llms.txt");
  assert(indexResponse.status === 200, "/llms.txt is unavailable");
  assert(/^text\/plain\b/i.test(indexResponse.headers.get("content-type") || ""), "/llms.txt has an unexpected content type");
  const index = await indexResponse.text();
  assert(/^#\s+Open Plovdiv\s*$/m.test(index), "/llms.txt is missing its site heading");
  assert(/^>\s+\S/m.test(index) && /^##\s+\S/m.test(index), "/llms.txt is missing its summary or sections");
  const indexUrls = [...index.matchAll(/^-\s+\[[^\]]+\]\(([^)]+)\)/gm)].map((match) => match[1]);
  const markdownUrls = [...new Set(indexUrls.filter((url) => new URL(url, siteOrigin).pathname.endsWith(".md")))];
  assert(markdownUrls.length >= 8, "/llms.txt should link to useful Markdown pages");
  const visitedHomes = new Set();
  for (const url of markdownUrls) {
    const path = localPath(url);
    const pagePath = path.endsWith("/index.md")
      ? path.slice(0, -"index.md".length).replace(/\/$/, "") || "/"
      : path.slice(0, -".md".length);
    const response = await request(pagePath);
    assert(response.status === 200, `${pagePath}: index link has no source HTML`);
    const html = await response.text();
    const canonical = linkTags(html).find((link) => link.rel === "canonical")?.href;
    assert(canonical, `${pagePath}: missing canonical HTML URL`);
    const home = /^\/(?:en|de|fr|it|tr|es|el|ja|zh|tl|uk|ru|pl|pt)?$/.test(pagePath);
    if (home) visitedHomes.add(pagePath);
    checkVisibleLinks(html, canonical, { home });
    const markdown = await checkMarkdown(path, canonical);
    if (!path.endsWith("/index.md")) {
      assert(await checkMarkdown(`${pagePath}/index.md`, canonical) === markdown, `${pagePath}: short and directory versions differ`);
    }
    if (home && pagePath !== "/") {
      assert(await checkMarkdown(`${pagePath}.md`, canonical) === markdown, `${pagePath}.md: locale home alias differs`);
    }
  }
  assert(visitedHomes.size === 15, `Expected guide links on 15 localized homepages; checked ${visitedHomes.size}`);

  const samples = ["/", "/en/history", "/history", "/ja/history", "/zh/history", "/en/places"];
  for (const kind of ["places", "people", "stories", "routes", "neighbourhoods", "projects", "mayors"]) {
    const sample = pageUrls.find((url) => new RegExp(`^/en/${kind}/[^/]+$`).test(url.pathname));
    assert(sample, `No sitemap sample for ${kind}`);
    samples.push(sample.pathname);
  }
  for (const path of samples) {
    const response = await request(path);
    assert(response.status === 200, `${path}: HTML returned ${response.status}`);
    const html = await response.text();
    const links = linkTags(html);
    const canonical = links.find((link) => link.rel === "canonical")?.href;
    const alternate = links.find((link) => link.rel === "alternate" && link.type === "text/markdown")?.href;
    const describedBy = links.find((link) => link.rel === "describedby")?.href;
    assert(canonical && alternate && describedBy, `${path}: missing HTML discovery links`);
    checkVisibleLinks(html, canonical, { home: path === "/" });
    assert(localPath(describedBy) === "/llms.txt", `${path}: wrong llms.txt discovery URL`);
    const expectedPath = `${path === "/" ? "" : path}/index.md`;
    assert(localPath(alternate) === expectedPath, `${path}: wrong Markdown alternate ${alternate}`);
    const markdown = await checkMarkdown(expectedPath, canonical);
    if (path !== "/") {
      const alias = `${path}.md`;
      const shortMarkdown = await checkMarkdown(alias, canonical);
      assert(shortMarkdown === markdown, `${alias}: differs from the directory Markdown version`);
      assert(await checkMarkdown(`${alias}?source=check`, canonical) === markdown, `${alias}: query changes content`);
    }
    // The first visible page heading should survive conversion on each sample.
    const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
    const heading = h1 && decode(h1.replace(/<[^>]*>/g, "")).replace(/\s+/g, "");
    if (heading) assert(markdown.replace(/[\s*_`~]/g, "").includes(heading), `${path}: page heading missing from Markdown`);
    const language = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1];
    if (language) assert(markdown.includes(`Language: ${language}`), `${path}: language missing from Markdown`);
  }

  const head = await request("/en/history/index.md", { method: "HEAD" });
  assert(head.status === 200 && /^text\/markdown\b/i.test(head.headers.get("content-type") || "") && (await head.text()) === "", "Markdown HEAD request failed");
  const shortHead = await request("/en/history.md", { method: "HEAD" });
  assert(shortHead.status === 200 && /^text\/markdown\b/i.test(shortHead.headers.get("content-type") || "") && shortHead.headers.get("x-robots-tag") === "noindex" && (await shortHead.text()) === "", "Short Markdown HEAD request failed");
  const missing = await request("/en/no-such-page-llms-validation/index.md");
  assert(missing.status === 404, "Missing Markdown page should return 404");
  const missingShort = await request("/en/no-such-page-llms-validation.md");
  assert(missingShort.status === 404, "Missing short Markdown page should return 404");
  const missingHtml = await request("/en/no-such-page-llms-validation");
  assert(missingHtml.status === 404, "Missing HTML page should return 404");
  const missingDocument = parseHTML(await missingHtml.text()).document;
  assert(!missingDocument.querySelector("main nav.page-markdown-tools a.page-markdown-link"), "404 page must not advertise a Markdown version");
  const post = await request("/en/history/index.md", { method: "POST" });
  assert(post.status === 405 && /GET/.test(post.headers.get("allow") || "") && /HEAD/.test(post.headers.get("allow") || ""), "Markdown POST should return 405 with Allow");
  const shortPost = await request("/en/history.md", { method: "POST" });
  assert(shortPost.status === 405 && /GET/.test(shortPost.headers.get("allow") || "") && /HEAD/.test(shortPost.headers.get("allow") || ""), "Short Markdown POST should return 405 with Allow");
  for (const path of ["/fonts/README.md", "/images/plovdiv/README.md"]) {
    const response = await request(path);
    const expected = readFileSync(resolve("apps/web/public", `.${path}`), "utf8");
    assert(response.status === 200 && await response.text() === expected, `${path}: static Markdown file changed or became unavailable`);
    assert(!response.headers.get("x-robots-tag"), `${path}: static file should not inherit dynamic Markdown headers`);
  }
  for (const path of ["/%2e%2e/package.json.md", "/en/%2e%2e/package.json.md", "/en%2fhistory.md", "/en%5chistory.md", "/en/%00.md"]) {
    const status = await rawStatus(path);
    assert(status !== 200, `${path}: unsafe Markdown request unexpectedly succeeded`);
  }
  console.log(`llms validation passed: ${pageUrls.length} sitemap mappings, ${markdownUrls.length} index links, 15 localized homepage links, ${samples.length} HTML/Markdown pairs and short aliases; static files, traversal, HEAD, missing page and method handling verified.`);
} finally {
  if (!exited) {
    server.kill("SIGTERM");
    await Promise.race([new Promise((resolveExit) => server.once("exit", resolveExit)), delay(4000)]);
    if (!exited) server.kill("SIGKILL");
  }
}
