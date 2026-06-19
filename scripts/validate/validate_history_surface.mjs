import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const clientDir = path.join(root, "apps/web/dist/client");

if (!fs.existsSync(clientDir)) {
  throw new Error("history surface: apps/web/dist/client is missing; run npm run build first");
}

const issues = [];

function fail(message) {
  issues.push(message);
}

function fileForUrl(url) {
  const clean = url.replace(/^\//, "");
  if (clean.endsWith("/")) return path.join(clientDir, clean, "index.html");
  if (path.extname(clean)) return path.join(clientDir, clean);
  return path.join(clientDir, clean, "index.html");
}

function assertFile(url) {
  const filePath = fileForUrl(url);
  if (!fs.existsSync(filePath)) {
    fail(`missing built file for ${url}`);
    return null;
  }
  if (fs.statSync(filePath).size === 0) {
    fail(`empty built file for ${url}`);
    return null;
  }
  return filePath;
}

function readBuilt(url) {
  const filePath = assertFile(url);
  return filePath ? fs.readFileSync(filePath, "utf8") : "";
}

function readJson(url) {
  const filePath = assertFile(url);
  if (!filePath) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`invalid JSON at ${url}: ${error.message}`);
    return null;
  }
}

function collectionFromPayload(payload, preferredKey) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return null;
  if (preferredKey && Array.isArray(payload[preferredKey])) return payload[preferredKey];
  const arrays = Object.values(payload).filter(Array.isArray);
  return arrays.length === 1 ? arrays[0] : null;
}

function assertContains(url, html, patterns) {
  for (const pattern of patterns) {
    const matches = pattern instanceof RegExp ? pattern.test(html) : html.includes(pattern);
    if (!matches) fail(`${url} is missing required hook ${String(pattern)}`);
  }
}

function assertAlternateLinks(url, html, bgHref, enHref) {
  if (!html.includes(`hreflang="bg" href="${bgHref}"`)) {
    fail(`${url} missing bg alternate ${bgHref}`);
  }
  if (!html.includes(`hreflang="en" href="${enHref}"`)) {
    fail(`${url} missing en alternate ${enHref}`);
  }
}

function absolutePageHref(url) {
  const href = new URL(url, "https://openplovdiv.example").href;
  return href.endsWith("/") && href !== "https://openplovdiv.example/" ? href.slice(0, -1) : href;
}

function assertCountAtLeast(label, actual, target) {
  if (typeof actual !== "number" || actual < target) {
    fail(`${label}: expected at least ${target}, got ${actual}`);
  }
}

const corePagePairs = [
  { bg: "/", en: "/en/", hooks: ["<h1"] },
  {
    bg: "/history/",
    en: "/en/history/",
    hooks: [
      'id="history-search"',
      'id="history-event-list"',
      'id="history-on-this-day-date"',
      'id="history-map-canvas"',
      'id="history-timeline-config"',
      'id="history-map-config"'
    ]
  },
  {
    bg: "/history/editorial-review/",
    en: "/en/history/editorial-review/",
    hooks: [
      'id="editorial-review-dashboard"',
      'id="source-coverage-dashboard"',
      'id="editorial-review-config"',
      'id="editorial-review-list"',
      "/api/history/editorial-review.json",
      "/api/history/source-coverage.json"
    ]
  },
  {
    bg: "/history/contribute/",
    en: "/en/history/contribute/",
    hooks: [
      'id="history-contribution-form"',
      'name="kind" value="history_contribution"',
      'id="hc-photos"',
      'id="hc-confirm-personal"'
    ]
  },
  {
    bg: "/people/",
    en: "/en/people/",
    hooks: ['id="people-graph"', 'class="people-graph"', 'id="people-list"', 'id="people-config"']
  },
  {
    bg: "/places/",
    en: "/en/places/",
    hooks: ['id="places-search"', 'id="places-list"']
  },
  {
    bg: "/stories/",
    en: "/en/stories/",
    hooks: ['class="story-grid"', "/api/history/story-longreads.json"]
  },
  {
    bg: "/education/",
    en: "/en/education/",
    hooks: ['id="lessons"', "data-education-resource", "/api/history/education-resources.json"]
  },
  {
    bg: "/mayors/",
    en: "/en/mayors/",
    hooks: ['id="mayor-search"', "mayor-timeline"]
  },
  {
    bg: "/fix-map/report/",
    en: "/en/fix-map/report/",
    hooks: ['id="report-form"', 'id="rf-photos"', 'id="rf-confirm-personal"']
  }
];

for (const pair of corePagePairs) {
  const bgHtml = readBuilt(pair.bg);
  const enHtml = readBuilt(pair.en);
  assertAlternateLinks(pair.bg, bgHtml, absolutePageHref(pair.bg), absolutePageHref(pair.en));
  assertAlternateLinks(pair.en, enHtml, absolutePageHref(pair.bg), absolutePageHref(pair.en));
  assertContains(pair.bg, bgHtml, pair.hooks);
  assertContains(pair.en, enHtml, pair.hooks);
}

const historyIndex = readJson("/api/history/index.json");
if (historyIndex) {
  const { counts = {}, targets = {}, endpoints = {}, downloads = {} } = historyIndex;
  assertCountAtLeast("events", counts.events, targets.events ?? 300);
  assertCountAtLeast("exact-date events", counts.exact_date_events, targets.exact_date_events ?? 60);
  assertCountAtLeast("people", counts.people, targets.people ?? 200);
  assertCountAtLeast("places", counts.places, targets.places ?? 150);
  assertCountAtLeast("places with media", counts.places_with_media, targets.places_with_media ?? targets.places ?? 150);
  assertCountAtLeast("georeferenced archive items", counts.georeferenced_archive_items, targets.georeferenced_archive_items ?? 30);
  assertCountAtLeast("then-now pairs", counts.then_now_pairs, targets.then_now_pairs ?? 20);
  assertCountAtLeast("story longreads", counts.story_longreads, targets.longreads ?? 10);
  assertCountAtLeast("lesson plans", counts.lesson_plans, targets.lesson_plans ?? 5);

  for (const [name, endpoint] of Object.entries(endpoints)) {
    const data = readJson(endpoint);
    if (!data) continue;
    const arrayKey = name === "editorial_review" ? "records" : name;
    if (endpoint !== "/api/history/index.json" && !collectionFromPayload(data, arrayKey)) {
      fail(`history endpoint ${name} must return a wrapped or raw JSON array`);
    }
  }

  for (const [name, download] of Object.entries(downloads)) {
    if (name.endsWith("_directory")) continue;
    const filePath = assertFile(download);
    if (!filePath) continue;
    if (download.endsWith(".json")) readJson(download);
    if (download.endsWith(".csv")) {
      const lineCount = fs.readFileSync(filePath, "utf8").trim().split(/\r?\n/).length;
      const minimumRows = name === "editorial_signoffs_csv" ? 1 : 2;
      if (lineCount < minimumRows) {
        fail(`download ${download} must include a header${minimumRows > 1 ? " and at least one data row" : ""}`);
      }
    }
  }
}

const archiveItems = collectionFromPayload(readJson("/api/history/archive-items.json"), "archive_items") ?? [];
const historyEvents = collectionFromPayload(readJson("/api/history/events.json"), "events") ?? [];
const multiSourceTimelineEvents = historyEvents.filter(
  (event) => event.category === "historical_timeline" && new Set(event.source_ids ?? []).size >= 2
);
if (multiSourceTimelineEvents.length < 10) {
  fail(`history API must include at least 10 multi-source core timeline records, got ${multiSourceTimelineEvents.length}`);
}
if (!historyEvents.some((event) => event.conflict_notes_bg && event.conflict_notes_en)) {
  fail("history API must expose at least one bilingual timeline conflict note");
}
const mapOverlayItems = archiveItems.filter((item) => item.kind === "map" && item.overlay_bounds);
if (mapOverlayItems.length === 0) {
  fail("history archive layer must include at least one historical map with overlay_bounds");
}
for (const item of mapOverlayItems) {
  const bounds = item.overlay_bounds;
  if (!(bounds.south < bounds.north) || !(bounds.west < bounds.east)) {
    fail(`history archive map ${item.id} has invalid overlay_bounds`);
  }
}

const historyAssetScripts = fs
  .readdirSync(path.join(clientDir, "_astro"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.startsWith("HistoryView") && entry.name.endsWith(".js"))
  .map((entry) => fs.readFileSync(path.join(clientDir, "_astro", entry.name), "utf8"))
  .join("\n");
if (!historyAssetScripts.includes("imageOverlay")) {
  fail("history map bundle is missing Leaflet imageOverlay support");
}
if (!historyAssetScripts.includes("historical-map-overlay")) {
  fail("history map bundle is missing the historical-map-overlay layer class");
}
if (!historyAssetScripts.includes("history-conflict-note")) {
  fail("history timeline bundle is missing conflict-note rendering");
}

const places = collectionFromPayload(readJson("/api/history/places.json"), "places") ?? [];
for (const place of places) {
  assertFile(`/places/${place.id}/`);
  assertFile(`/en/places/${place.id}/`);
}

const people = collectionFromPayload(readJson("/api/history/people.json"), "people") ?? [];
for (const person of people) {
  const bgHtml = readBuilt(`/people/${person.id}/`);
  const enHtml = readBuilt(`/en/people/${person.id}/`);
  assertContains(`/people/${person.id}/`, bgHtml, [
    `data-person-profile="${person.id}"`,
    'class="profile-event-list"',
    'class="profile-source-list"'
  ]);
  assertContains(`/en/people/${person.id}/`, enHtml, [
    `data-person-profile="${person.id}"`,
    'class="profile-event-list"',
    'class="profile-source-list"'
  ]);
}
assertCountAtLeast("person profile pages", people.length, 200);

const stories = collectionFromPayload(readJson("/api/history/story-longreads.json"), "story_longreads") ?? [];
for (const story of stories) {
  assertFile(`/stories/${story.id}/`);
  assertFile(`/en/stories/${story.id}/`);
}

const cityArchive = collectionFromPayload(readJson("/data/city-archive.json")) ?? [];
const mayorTerms = cityArchive.filter((record) => record.kind === "mayor_term");
for (const term of mayorTerms) {
  assertFile(`/mayors/${term.id}/`);
  assertFile(`/en/mayors/${term.id}/`);
}
assertCountAtLeast("mayor detail pages", mayorTerms.length, 66);

if (issues.length > 0) {
  console.error(`history surface validation failed: ${issues.length} issue(s)`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(
  `history surface validation passed: ${corePagePairs.length * 2} core pages, ${people.length * 2} person pages, ${places.length * 2} place pages, ${stories.length * 2} story pages, ${mayorTerms.length * 2} mayor pages`
);
