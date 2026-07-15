import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { normalizePublishedEditorialNotices } from "./editorial_notices.mjs";

const root = process.cwd();
const publicDir = path.join(root, "apps/web/public/data");
const historyPublicDir = path.join(publicDir, "history");
const translationLangs = ["de", "fr", "it", "tr", "es", "el", "ja", "tl", "uk", "ru"];
const translationsByLang = Object.fromEntries(
  translationLangs.map((lang) => {
    const translationsPath = path.join(root, `data/translations/${lang}.json`);
    return [
      lang,
      fs.existsSync(translationsPath) ? JSON.parse(fs.readFileSync(translationsPath, "utf8")) : {}
    ];
  })
);
const protectedFieldBases = new Set(["actor", "architect", "birthplace", "builder"]);

const files = [
  "walking-routes.json",
  "neighbourhood-histories.json",
  "projects.json",
  "community-initiatives.json",
  "budget-items.json",
  "city-archive.json",
  "sources.json",
  "plovdiv-history.json",
  "plovdiv-landmarks.json",
  "historical-archive-items.json",
  "then-now-pairs.json",
  "primary-documents.json",
  "education-resources.json",
  "story-longreads.json",
  "notable-people.json",
  "person-relationships.json"
];

execFileSync(process.execPath, ["scripts/validate/validate_data.mjs"], {
  cwd: root,
  stdio: "inherit"
});

function translateEn(value, lang) {
  return translationsByLang[lang]?.[String(value).trim()] ?? null;
}

function isPersonLikeRecord(record) {
  return (
    record.type === "person" ||
    String(record.id ?? "").startsWith("person-") ||
    String(record.id ?? "").startsWith("notable-person-") ||
    Array.isArray(record.roles) ||
    "birth_year" in record ||
    "death_year" in record
  );
}

function shouldTranslateField(record, base) {
  if (protectedFieldBases.has(base)) return false;
  if (base === "name" && isPersonLikeRecord(record)) return false;
  return true;
}

function withTranslatedFields(value) {
  if (Array.isArray(value)) return value.map((item) => withTranslatedFields(item));
  if (!value || typeof value !== "object") return value;

  const out = {};
  for (const [key, child] of Object.entries(value)) out[key] = withTranslatedFields(child);
  for (const [key, child] of Object.entries(value)) {
    if (!key.endsWith("_en") || typeof child !== "string") continue;
    const base = key.slice(0, -3);
    if (!shouldTranslateField(value, base)) continue;
    for (const lang of translationLangs) {
      const translatedKey = `${base}_${lang}`;
      if (typeof out[translatedKey] === "string" && out[translatedKey].trim()) continue;
      const translated = translateEn(child, lang);
      if (translated) out[translatedKey] = translated;
    }
  }
  for (const key of ["title", "label"]) {
    const child = value[key];
    if (typeof child !== "string") continue;
    for (const lang of translationLangs) {
      const translatedKey = `${key}_${lang}`;
      if (typeof out[translatedKey] === "string" && out[translatedKey].trim()) continue;
      const translated = translateEn(child, lang);
      if (translated) out[translatedKey] = translated;
    }
  }
  return out;
}

function writeJson(target, value) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(withTranslatedFields(value), null, 2)}\n`);
}

fs.mkdirSync(publicDir, { recursive: true });

for (const file of files) {
  const source = path.join(root, "data/curated", file);
  const target = path.join(publicDir, file);
  let json = JSON.parse(fs.readFileSync(source, "utf8"));
  if (file === "historical-archive-items.json") {
    json = normalizePublishedEditorialNotices(json, "archive");
  } else if (file === "then-now-pairs.json") {
    json = normalizePublishedEditorialNotices(json, "pair");
  }
  writeJson(target, json);
  console.log(`generated apps/web/public/data/${file}`);
}

// Walking-route geometry ships both as raw GeoJSON records and as GPX tracks
// (stops as numbered waypoints + the OSRM line as a track) so visitors can
// load a route into any map app or GPS device for offline use.
const geometryDir = path.join(root, "data/curated/route-geometry");
const geometryPublicDir = path.join(publicDir, "route-geometry");
const routesForGpx = JSON.parse(fs.readFileSync(path.join(root, "data/curated/walking-routes.json"), "utf8"));
const placesForGpx = JSON.parse(
  fs.readFileSync(path.join(root, "data/generated/history-knowledge/places.json"), "utf8")
);
const placeNameById = new Map(placesForGpx.map((place) => [place.id, place.name_en || place.name_bg]));

function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function toGpx(route, geometry) {
  const waypoints = geometry.stops
    .map((stop, index) => {
      const name = `${index + 1}. ${placeNameById.get(stop.place_id) ?? stop.place_id}`;
      return `  <wpt lat="${stop.snapped[1]}" lon="${stop.snapped[0]}">\n    <name>${xmlEscape(name)}</name>\n  </wpt>`;
    })
    .join("\n");
  const trackpoints = geometry.geometry.coordinates
    .map(([lng, lat]) => `      <trkpt lat="${lat}" lon="${lng}"></trkpt>`)
    .join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<gpx version="1.1" creator="Open Plovdiv" xmlns="http://www.topografix.com/GPX/1/1">',
    `  <metadata>\n    <name>${xmlEscape(route.title_en)}</name>\n  </metadata>`,
    waypoints,
    `  <trk>\n    <name>${xmlEscape(route.title_en)}</name>\n    <trkseg>\n${trackpoints}\n    </trkseg>\n  </trk>`,
    "</gpx>",
    ""
  ].join("\n");
}

fs.rmSync(geometryPublicDir, { recursive: true, force: true });
fs.mkdirSync(geometryPublicDir, { recursive: true });
if (fs.existsSync(geometryDir)) {
  for (const entry of fs.readdirSync(geometryDir)) {
    if (!entry.endsWith(".json")) continue;
    fs.copyFileSync(path.join(geometryDir, entry), path.join(geometryPublicDir, entry));
    const geometry = JSON.parse(fs.readFileSync(path.join(geometryDir, entry), "utf8"));
    const route = routesForGpx.find((candidate) => candidate.id === geometry.route_id);
    if (route) {
      fs.writeFileSync(path.join(geometryPublicDir, `${geometry.route_id}.gpx`), toGpx(route, geometry));
    }
  }
  console.log("generated apps/web/public/data/route-geometry (GeoJSON + GPX)");
}

fs.rmSync(historyPublicDir, { recursive: true, force: true });
fs.mkdirSync(historyPublicDir, { recursive: true });
for (const entry of fs.readdirSync(path.join(root, "data/generated/history-knowledge"), { withFileTypes: true })) {
  const source = path.join(root, "data/generated/history-knowledge", entry.name);
  const target = path.join(historyPublicDir, entry.name);
  if (entry.isDirectory()) {
    fs.cpSync(source, target, { recursive: true });
  } else if (entry.isFile() && entry.name.endsWith(".json")) {
    writeJson(target, JSON.parse(fs.readFileSync(source, "utf8")));
  }
}
console.log("generated apps/web/public/data/history");
