import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const publicDir = path.join(root, "apps/web/public/data");
const historyPublicDir = path.join(publicDir, "history");
const translationLangs = ["de", "fr", "it", "tr", "es", "el", "ja"];
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
