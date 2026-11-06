import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";

// Run after a production build. Validate generated artifacts, not assumptions
// about what the source templates ought to emit.
const root = resolve("apps/web/dist/client");
const sitemapPath = resolve(root, "sitemap.xml");
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const xmlDecode = (s) => s.replace(/&(amp|lt|gt|quot|apos);/g, (_, n) => ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" })[n]);
assert(existsSync(sitemapPath), "Build the site before validating SEO: sitemap.xml is missing");
assert(statSync(sitemapPath).size <= 50 * 1024 * 1024, "Sitemap exceeds the 50 MB uncompressed limit");
const sitemap = readFileSync(sitemapPath, "utf8");
const entries = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g)];
assert(entries.length > 0 && entries.length <= 50000, `Invalid sitemap URL count: ${entries.length}`);
const locales = ["bg", "en", "de", "fr", "it", "tr", "es", "el", "ja", "tl", "uk", "ru", "pl", "pt"];
const expectedOrigin = process.env.PUBLIC_SITE_URL ? new URL(process.env.PUBLIC_SITE_URL).origin : new URL(xmlDecode(entries[0][1])).origin;
const urls = new Set();
const groups = new Map();
const files = new Map();
for (const [, rawLoc, body] of entries) {
  const loc = xmlDecode(rawLoc);
  const url = new URL(loc);
  assert(url.origin === expectedOrigin && !url.search && !url.hash, `Unexpected sitemap URL ${loc}`);
  assert(!urls.has(loc), `Duplicate sitemap URL ${loc}`);
  urls.add(loc);
  const file = resolve(root, `.${decodeURIComponent(url.pathname)}`, "index.html");
  assert((file === root || file.startsWith(root + sep)) && existsSync(file), `Missing sitemap page ${loc}`);
  files.set(loc, file);
  const links = [...body.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\s*\/>/g)];
  assert(links.length === locales.length + 1, `Incorrect alternate count for ${loc}`);
  const alternates = Object.fromEntries(links.map(([, lang, href]) => [lang, xmlDecode(href)]));
  assert(Object.keys(alternates).length === locales.length + 1 && locales.every((lang) => alternates[lang]), `Missing/duplicate alternate for ${loc}`);
  assert(alternates["x-default"] === alternates.bg, `Incorrect x-default for ${loc}`);
  assert(locales.some((lang) => alternates[lang] === loc), `Missing self alternate for ${loc}`);
  const key = alternates.bg;
  const representation = JSON.stringify(alternates);
  assert(!groups.has(key) || groups.get(key) === representation, `Non-reciprocal alternates for ${loc}`);
  groups.set(key, representation);
}
for (const encoded of groups.values()) {
  const links = JSON.parse(encoded);
  for (const locale of locales) assert(urls.has(links[locale]), `Sitemap alternate not listed: ${links[locale]}`);
}
const robots = readFileSync(resolve(root, "robots.txt"), "utf8");
assert(robots.includes(`Sitemap: ${expectedOrigin}/sitemap.xml`), "robots.txt does not advertise the canonical sitemap");
// Sample all locales and key page types for server-rendered metadata. Full
// sitemap coverage above also checks every listed page exists in the build.
for (const logicalPath of ["/", "/history", "/places", "/people", "/stories", "/routes"]) {
  const defaultUrl = new URL(logicalPath, expectedOrigin).href;
  const alternates = JSON.parse(groups.get(defaultUrl) ?? "null");
  assert(alternates, `Missing sitemap group ${logicalPath}`);
  for (const locale of locales) {
    const loc = alternates[locale];
    const html = readFileSync(files.get(loc), "utf8");
    const head = html.split("</head>")[0];
    assert(head.includes(`<link rel="canonical" href="${loc}">`), `Wrong canonical on ${loc}`);
    assert(head.includes(`<link rel="alternate" hreflang="${locale}" href="${loc}">`), `Missing self hreflang on ${loc}`);
    assert(/<title>[^<]+<\/title>/.test(head) && /<meta name="description" content="[^"]+"/.test(head), `Missing title or description on ${loc}`);
    assert(!/<meta name="robots" content="[^"]*noindex/i.test(head), `Indexed page marked noindex: ${loc}`);
    const jsonLd = head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert(jsonLd, `Missing structured data on ${loc}`);
    JSON.parse(jsonLd[1]);
  }
}
console.log(`SEO validation passed: ${urls.size} sitemap URLs, ${groups.size} reciprocal locale groups, and ${locales.length * 6} rendered pages.`);
