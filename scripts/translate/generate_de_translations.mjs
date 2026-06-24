import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outputPath = path.join(root, "data/translations/de.json");
const sourceDirs = ["data/curated", "data/generated/history-knowledge"];
const splitToken = "\n<<<OP_TRANSLATION_SPLIT>>>\n";
const maxBatchChars = 4200;
const skipKey = /(^|_)url_en$|wikipedia_en$|review_url_en$/;
const cyrillic = /[Ѐ-ӿ]/u;
const latin = /[A-Za-z]/u;
const numericOnly = /^[-+]?\d+(?:[.,]\d+)?$/;
const untranslatedFieldBases = new Set(["actor", "architect", "birthplace", "builder", "name"]);
let protectedNameFixups = [];

const manualTranslations = {
  "Public web reference; reuse terms not verified":
    "Öffentliche Webreferenz; Wiederverwendungsbedingungen nicht geprüft",
  "Wikimedia Commons file license, verify per file":
    "Wikimedia-Commons-Dateilizenz; pro Datei prüfen",
  "Creative Commons Attribution-ShareAlike 4.0 International":
    "Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International",
  "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
  "Open Database License 1.0": "Open Database License 1.0"
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function* jsonFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* jsonFiles(full);
    else if (entry.isFile() && entry.name.endsWith(".json")) yield full;
  }
}

function collect(value, key = "", out = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, key, out);
    return out;
  }
  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) collect(childValue, childKey, out);
    return out;
  }
  if (typeof value !== "string") return out;
  const text = value.trim();
  if (!text) return out;
  if (numericOnly.test(text)) return out;
  if (key.endsWith("_en") && !skipKey.test(key)) {
    const base = key.slice(0, -3);
    if (!untranslatedFieldBases.has(base)) out.add(text);
  }
  if (key === "title" && latin.test(text) && !cyrillic.test(text)) out.add(text);
  return out;
}

function collectProtectedNames(value, key = "", out = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectProtectedNames(item, key, out);
    return out;
  }
  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) collectProtectedNames(childValue, childKey, out);
    return out;
  }
  if (typeof value !== "string") return out;
  const text = value.trim();
  if (!text || cyrillic.test(text)) return out;
  if (key.endsWith("_en") && untranslatedFieldBases.has(key.slice(0, -3))) out.add(text);
  return out;
}

function makeBatches(strings) {
  const batches = [];
  let current = [];
  let currentChars = 0;
  for (const text of strings) {
    const nextChars = currentChars + text.length + splitToken.length;
    if (current.length > 0 && nextChars > maxBatchChars) {
      batches.push(current);
      current = [];
      currentChars = 0;
    }
    current.push(text);
    currentChars += text.length + splitToken.length;
  }
  if (current.length > 0) batches.push(current);
  return batches;
}

async function translateBatch(batch) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", "de");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", batch.join(splitToken));

  const response = await fetch(url);
  if (!response.ok) throw new Error(`translation failed: ${response.status} ${response.statusText}`);
  const payload = await response.json();
  const translated = payload?.[0]?.map((part) => part?.[0] ?? "").join("") ?? "";
  const parts = translated.split("<<<OP_TRANSLATION_SPLIT>>>").map((part) => part.trim());
  if (parts.length !== batch.length) {
    throw new Error(`translation split mismatch: expected ${batch.length}, got ${parts.length}`);
  }
  return parts;
}

function normalizeTranslation(text) {
  let normalized = text
    .replaceAll("BGN", "BGN")
    .replaceAll("EUR", "EUR")
    .replaceAll("Open Plowdiw", "Open Plovdiv")
    .replaceAll("Open Plovdiv", "Open Plovdiv")
    .replaceAll("Wikidaten", "Wikidata")
    .replaceAll("Wiki-Daten", "Wikidata")
    .replaceAll("Wikipedien", "Wikipedia")
    .replaceAll("Wikipedia", "Wikipedia")
    .trim();
  for (const [translatedName, originalName] of protectedNameFixups) {
    normalized = normalized.replaceAll(translatedName, originalName);
  }
  return normalized;
}

const existing = fs.existsSync(outputPath) ? readJson(outputPath) : {};
const allStrings = new Set(Object.keys(manualTranslations));
const protectedNames = new Set();
for (const dir of sourceDirs) {
  for (const file of jsonFiles(path.join(root, dir))) {
    const json = readJson(file);
    collectProtectedNames(json, "", protectedNames);
    collect(json, "", allStrings);
  }
}
for (const name of protectedNames) allStrings.delete(name);
protectedNameFixups = [...protectedNames]
  .map((name) => [existing[name], name])
  .filter(([translatedName, name]) => translatedName && translatedName !== name)
  .sort((a, b) => b[0].length - a[0].length);

const translations = { ...manualTranslations };
for (const text of allStrings) {
  if (existing[text]) translations[text] = normalizeTranslation(existing[text]);
}
const pending = [...allStrings]
  .filter((text) => !translations[text])
  .sort((a, b) => a.length - b.length || a.localeCompare(b));

console.log(`German translations: ${Object.keys(translations).length} cached, ${pending.length} pending`);

const batches = makeBatches(pending);
for (let i = 0; i < batches.length; i += 1) {
  const batch = batches[i];
  const translated = await translateBatch(batch);
  for (let j = 0; j < batch.length; j += 1) translations[batch[j]] = normalizeTranslation(translated[j]);
  if ((i + 1) % 10 === 0 || i === batches.length - 1) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(Object.fromEntries(Object.entries(translations).sort()), null, 2)}\n`);
    console.log(`translated ${i + 1}/${batches.length} batches`);
  }
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(Object.fromEntries(Object.entries(translations).sort()), null, 2)}\n`);
console.log(`wrote ${path.relative(root, outputPath)} (${Object.keys(translations).length} entries)`);
