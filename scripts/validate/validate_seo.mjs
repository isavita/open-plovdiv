import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";
import { parseHTML } from "linkedom";

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
const locales = ["bg", "en", "de", "fr", "it", "tr", "es", "el", "ja", "zh", "tl", "uk", "ru", "pl", "pt"];
const expectedOrigin = process.env.PUBLIC_SITE_URL ? new URL(process.env.PUBLIC_SITE_URL).origin : new URL(xmlDecode(entries[0][1])).origin;
const urls = new Set();
const groups = new Map();
const files = new Map();
const placeIds = JSON.parse(readFileSync("data/generated/history-knowledge/places.json", "utf8")).map((place) => place.id);
const englishPlaceNames = {
  "place-halm-na-osvoboditelite-q58079069": "Hill of the Liberators",
  "place-sveta-petka-stara-q12293078": "St Petka Stara Church",
  "place-pravoslavna-duhovna-akademiya-sv-sv-kiril-i-metodiy-q19706780": "Saints Cyril and Methodius Orthodox Theological Academy",
  "place-panair-han-q60394704": "Panair Han",
  "place-zala-stroitel-q61115940": "Stroitel Hall"
};
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
    const markdownUrl = `${loc.replace(/\/+$/, "")}/index.md`;
    assert(head.includes(`<link rel="alternate" type="text/markdown" href="${markdownUrl}">`), `Missing Markdown alternate on ${loc}`);
    assert(head.includes(`<link rel="describedby" type="text/plain" href="${expectedOrigin}/llms.txt">`), `Missing llms.txt discovery on ${loc}`);
    assert(head.includes(`<link rel="alternate" hreflang="${locale}" href="${loc}">`), `Missing self hreflang on ${loc}`);
    assert(/<title>[^<]+<\/title>/.test(head) && /<meta name="description" content="[^"]+"/.test(head), `Missing title or description on ${loc}`);
    if (logicalPath === "/" && locale === "en") {
      assert(/<title>Plovdiv Travel Guide: Things to Do and Places · Open Plovdiv<\/title>/.test(head), `Missing descriptive English homepage title: ${loc}`);
    }
    if (logicalPath === "/" && locale === "pt") {
      assert(html.includes("Descubra o que fazer em Plovdiv, Bulgária"), `Missing Portuguese homepage introduction: ${loc}`);
    }
    if (logicalPath === "/places") {
      const { document } = parseHTML(html);
      const directory = document.querySelector("details[data-place-directory]");
      assert(directory && directory.querySelector("summary")?.textContent.trim(), `Missing accessible place directory on ${loc}`);
      assert(!directory.querySelector("img"), `Place directory must not eagerly load images: ${loc}`);
      const links = new Set([...directory.querySelectorAll("a[href]")].map((link) => link.getAttribute("href")));
      const prefix = locale === "bg" ? "" : `/${locale}`;
      assert(links.size === placeIds.length, `Place directory link count mismatch on ${loc}`);
      for (const id of placeIds) assert(links.has(`${prefix}/places/${id}`), `Missing crawlable place link ${id} on ${loc}`);
      if (locale === "en") {
        assert(/<title>Places and Landmarks in Plovdiv · Open Plovdiv<\/title>/.test(head), `Missing English places title: ${loc}`);
        assert(document.querySelector("h1")?.textContent.trim() === "Places and Landmarks in Plovdiv", `Missing English places heading: ${loc}`);
        for (const [id, name] of Object.entries(englishPlaceNames)) {
          const href = `/en/places/${id}`;
          const directoryLink = directory.querySelector(`a[href="${href}"]`);
          assert(directoryLink?.textContent.trim() === name, `Missing English directory name for ${id}`);
          const detailUrl = new URL(href, expectedOrigin).href;
          assert(files.has(detailUrl), `Missing English place detail ${detailUrl}`);
          const detail = parseHTML(readFileSync(files.get(detailUrl), "utf8")).document;
          assert(detail.querySelector("h1")?.textContent.trim() === name, `Missing English detail heading for ${id}`);
        }
      }
    }
    assert(!/<meta name="robots" content="[^"]*noindex/i.test(head), `Indexed page marked noindex: ${loc}`);
    const jsonLd = head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert(jsonLd, `Missing structured data on ${loc}`);
    JSON.parse(jsonLd[1]);
  }
}
const notFoundPath = resolve(root, "404.html");
if (existsSync(notFoundPath)) {
  const head = readFileSync(notFoundPath, "utf8").split("</head>")[0];
  assert(!head.includes('type="text/markdown"') && !head.includes('rel="describedby"'), "404 page must not advertise an unrelated Markdown alternate");
}
console.log(`SEO validation passed: ${urls.size} sitemap URLs, ${groups.size} reciprocal locale groups, and ${locales.length * 6} rendered pages.`);
