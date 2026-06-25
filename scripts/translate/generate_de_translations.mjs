import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const targetLang = process.argv[2] ?? "de";
const supportedTargetLangs = new Set(["de", "fr"]);
if (!supportedTargetLangs.has(targetLang)) {
  throw new Error(`Unsupported target language "${targetLang}". Expected one of: ${[...supportedTargetLangs].join(", ")}`);
}
const outputPath = path.join(root, `data/translations/${targetLang}.json`);
const sourceDirs = ["data/curated", "data/generated/history-knowledge"];
const splitToken = "\n<<<OP_TRANSLATION_SPLIT>>>\n";
const maxBatchChars = 4200;
const skipKey = /(^|_)url_en$|wikipedia_en$|review_url_en$/;
const cyrillic = /[Ѐ-ӿ]/u;
const latin = /[A-Za-z]/u;
const numericOnly = /^[-+]?\d+(?:[.,]\d+)?$/;
const protectedFieldBases = new Set(["actor", "architect", "birthplace", "builder"]);
let protectedNameFixups = [];

const manualTranslationsByLang = {
  de: {
    "Public web reference; reuse terms not verified":
      "Öffentliche Webreferenz; Wiederverwendungsbedingungen nicht geprüft",
    "Wikimedia Commons file license, verify per file":
      "Wikimedia-Commons-Dateilizenz; pro Datei prüfen",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0"
  },
  fr: {
    "Public web reference; reuse terms not verified":
      "Référence web publique ; conditions de réutilisation non vérifiées",
    "Wikimedia Commons file license, verify per file":
      "Licence de fichier Wikimedia Commons ; vérifier chaque fichier",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Attribution - Partage dans les mêmes conditions 4.0 International",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0"
  }
};
const manualTranslations = manualTranslationsByLang[targetLang];

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

function collect(value, key = "", out = new Set(), parentRecord = null) {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, key, out, parentRecord);
    return out;
  }
  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) collect(childValue, childKey, out, value);
    return out;
  }
  if (typeof value !== "string") return out;
  const text = value.trim();
  if (!text) return out;
  if (numericOnly.test(text)) return out;
  if (key.endsWith("_en") && !skipKey.test(key)) {
    const base = key.slice(0, -3);
    if (shouldTranslateField(parentRecord ?? {}, base)) out.add(text);
  }
  if (key === "title" && latin.test(text) && !cyrillic.test(text)) out.add(text);
  return out;
}

function collectProtectedNames(value, out = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectProtectedNames(item, out);
    return out;
  }
  if (value && typeof value === "object") {
    if (isPersonLikeRecord(value) && typeof value.name_en === "string") {
      const name = value.name_en.trim();
      if (name && !cyrillic.test(name)) out.add(name);
    }
    for (const base of protectedFieldBases) {
      const text = value[`${base}_en`];
      if (typeof text === "string" && text.trim() && !cyrillic.test(text)) out.add(text.trim());
    }
    for (const childValue of Object.values(value)) collectProtectedNames(childValue, out);
    return out;
  }
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
  url.searchParams.set("tl", targetLang);
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

async function buildProtectedNameFixups(protectedNames, existing) {
  const existingFixups = [...protectedNames]
    .map((name) => [existing[name], name])
    .filter(([translatedName, name]) => translatedName && translatedName !== name);

  const pendingNames = [...protectedNames].filter((name) => !existing[name]);
  const translatedFixups = [];
  for (const batch of makeBatches(pendingNames)) {
    const translated = await translateBatch(batch);
    for (let i = 0; i < batch.length; i += 1) {
      const originalName = batch[i];
      const translatedName = translated[i]?.trim();
      if (translatedName && translatedName !== originalName) translatedFixups.push([translatedName, originalName]);
    }
  }

  return [...existingFixups, ...translatedFixups].sort((a, b) => b[0].length - a[0].length);
}

function stripNamePrefix(value) {
  return value
    .replace(/^l['’]/i, "")
    .replace(/^le /i, "")
    .replace(/^la /i, "")
    .replace(/^les /i, "")
    .trim();
}

function translatedNameFromPattern(source, target, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const directPatterns = [
    [`Biographical reference: ${escapedName}`, /^Référence biographique\s*:\s*(.+)$/],
    [`Birth of ${escapedName}`, /^Naissance (?:d['’]|de |du |des )(.+)$/],
    [
      `Birth year and birthplace for ${escapedName}.`,
      /^Année et lieu de naissance (?:d['’]|de |du |des )(.+)\.$/
    ],
    [
      `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
      /^Données biographiques et lien vers le lieu de naissance de Plovdiv pour (.+)\.$/
    ],
    [`Mayor: ${escapedName}`, /^Maire\s*:\s*(.+)$/],
    [`Mayoral term\\(s\\) for ${escapedName}.`, /^.+ pour (?:l['’]|le |la |les )?(.+)\.$/],
    [`Wikipedia [—-] ${escapedName}`, /^Wikipédia [—-]\s*(.+)$/]
  ];

  for (const [sourcePattern, targetPattern] of directPatterns) {
    if (!new RegExp(`^${sourcePattern}$`).test(source)) continue;
    const match = target.match(targetPattern);
    return match ? stripNamePrefix(match[1]) : null;
  }

  const archiveMatch = source.match(new RegExp(`^City archive record "Mayor: ${escapedName}"\\.$`));
  if (archiveMatch) {
    const targetMatch = target.match(/Maire\s*:\s*([^"»]+)["»]\.?$/);
    return targetMatch ? stripNamePrefix(targetMatch[1]) : null;
  }

  const relationshipSource = source
    .replace(/^Person relationship: /, "")
    .replace(/\.$/, "")
    .match(/^(.+) — (succeeded by|succeeds) — (.+)$/);
  if (relationshipSource) {
    const targetBody = target.replace(/^Relation personnelle\s*:\s*/, "").replace(/\.$/, "");
    const targetParts = targetBody.split(/\s*—\s*/);
    if (targetParts.length === 3 && relationshipSource[1] === name) return stripNamePrefix(targetParts[0]);
    if (targetParts.length === 3 && relationshipSource[3] === name) return stripNamePrefix(targetParts[2]);
  }

  return null;
}

function inferProtectedNameFixups(translations, protectedNames) {
  const inferred = [];
  for (const [source, target] of Object.entries(translations)) {
    for (const name of protectedNames) {
      if (!source.includes(name) || target.includes(name)) continue;
      const translatedName = translatedNameFromPattern(source, target, name);
      if (translatedName && translatedName !== name) inferred.push([translatedName, name]);
    }
  }
  return inferred;
}

function normalizeAllTranslations(translations) {
  for (const [source, translated] of Object.entries(translations)) {
    translations[source] = normalizeTranslation(translated);
  }
}

const existing = fs.existsSync(outputPath) ? readJson(outputPath) : {};
const allStrings = new Set(Object.keys(manualTranslations));
const protectedNames = new Set();
for (const dir of sourceDirs) {
  for (const file of jsonFiles(path.join(root, dir))) {
    const json = readJson(file);
    collectProtectedNames(json, protectedNames);
    collect(json, "", allStrings);
  }
}
for (const name of protectedNames) allStrings.delete(name);
protectedNameFixups = await buildProtectedNameFixups(protectedNames, existing);

const translations = { ...manualTranslations };
for (const text of allStrings) {
  if (existing[text]) translations[text] = normalizeTranslation(existing[text]);
}
const pending = [...allStrings]
  .filter((text) => !translations[text])
  .sort((a, b) => a.length - b.length || a.localeCompare(b));

console.log(`${targetLang} translations: ${Object.keys(translations).length} cached, ${pending.length} pending`);

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

const inferredNameFixups = inferProtectedNameFixups(translations, protectedNames);
protectedNameFixups = [...protectedNameFixups, ...inferredNameFixups].sort((a, b) => b[0].length - a[0].length);
normalizeAllTranslations(translations);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(Object.fromEntries(Object.entries(translations).sort()), null, 2)}\n`);
console.log(`wrote ${path.relative(root, outputPath)} (${Object.keys(translations).length} entries)`);
