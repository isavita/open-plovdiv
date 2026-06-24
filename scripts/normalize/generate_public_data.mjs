import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const publicDir = path.join(root, "apps/web/public/data");
const historyPublicDir = path.join(publicDir, "history");
const translationsPath = path.join(root, "data/translations/de.json");
const deTranslations = fs.existsSync(translationsPath)
  ? JSON.parse(fs.readFileSync(translationsPath, "utf8"))
  : {};
const untranslatedFieldBases = new Set(["actor", "architect", "birthplace", "builder", "name"]);

const files = [
  "projects.json",
  "community-initiatives.json",
  "budget-items.json",
  "city-archive.json",
  "fix-reports.json",
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

function translateEnToDe(value) {
  return deTranslations[String(value).trim()] ?? null;
}

function withGermanFields(value) {
  if (Array.isArray(value)) return value.map((item) => withGermanFields(item));
  if (!value || typeof value !== "object") return value;

  const out = {};
  for (const [key, child] of Object.entries(value)) out[key] = withGermanFields(child);
  for (const [key, child] of Object.entries(value)) {
    if (!key.endsWith("_en") || typeof child !== "string") continue;
    const base = key.slice(0, -3);
    if (untranslatedFieldBases.has(base)) continue;
    const deKey = `${base}_de`;
    if (typeof out[deKey] === "string" && out[deKey].trim()) continue;
    const translated = translateEnToDe(child);
    if (translated) out[deKey] = translated;
  }
  for (const key of ["title", "label"]) {
    const child = value[key];
    const deKey = `${key}_de`;
    if (typeof child !== "string") continue;
    if (typeof out[deKey] === "string" && out[deKey].trim()) continue;
    const translated = translateEnToDe(child);
    if (translated) out[deKey] = translated;
  }
  return out;
}

function writeJson(target, value) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(withGermanFields(value), null, 2)}\n`);
}

fs.mkdirSync(publicDir, { recursive: true });

for (const file of files) {
  const source = path.join(root, "data/curated", file);
  const target = path.join(publicDir, file);
  const json = JSON.parse(fs.readFileSync(source, "utf8"));
  writeJson(target, json);
  console.log(`generated apps/web/public/data/${file}`);
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
