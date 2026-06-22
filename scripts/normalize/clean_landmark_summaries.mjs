#!/usr/bin/env node
// One-time cleanup: strip machine-provenance slop from landmark summaries so the
// public Places/History cards read as written prose, not data-pipeline output.
// Removes the "Coordinates … linked to public Wikidata/Wikimedia records" /
// "drawn from Wikidata/Wikimedia and require editorial review" trailers and the
// redundant "Wikidata inception/build date: YYYY-MM-DD." fragment (the build date
// already lives in built_year/built_date). Keeps the factual base description.
//
// Usage: node scripts/normalize/clean_landmark_summaries.mjs [--write]

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "..", "..", "data", "curated", "plovdiv-landmarks.json");
const WRITE = process.argv.includes("--write");

function clean(text) {
  if (!text) return text;
  let s = text;
  // redundant machine build-date fragments (EN + BG)
  s = s.replace(/\s*Wikidata inception\/build date:[^.]*\.?/g, "");
  s = s.replace(/\s*Дата\/година от Wikidata:[^.]*\.?/g, "");
  // metadata-provenance trailer (always at the end); covers both EN and BG variants
  s = s.replace(/\s*(Coordinates,|Координатите,)[\s\S]*$/u, "");
  s = s.replace(/\s+/g, " ").trim();
  if (s) {
    s = s.charAt(0).toLocaleUpperCase("bg-BG") + s.slice(1);
    if (!/[.!?]$/.test(s)) s += ".";
  }
  return s;
}

const landmarks = JSON.parse(readFileSync(FILE, "utf8"));
let changed = 0;
for (const l of landmarks) {
  const en = clean(l.summary_en);
  const bg = clean(l.summary_bg);
  if (en !== l.summary_en || bg !== l.summary_bg) changed++;
  l.summary_en = en;
  l.summary_bg = bg;
}

console.log(`Cleaned ${changed}/${landmarks.length} landmark summaries.`);
if (WRITE) {
  writeFileSync(FILE, JSON.stringify(landmarks, null, 2) + "\n");
  console.log("Wrote", FILE);
} else {
  console.log("(dry run — pass --write)");
  // preview a few
  for (const id of ["landmark-odeon-of-philippopolis-q26046109", "landmark-alyosha-monument-q4063802", "landmark-bishop-s-basilica-of-philippopolis-q20500169"]) {
    const l = landmarks.find((x) => x.id === id);
    if (l) console.log(`  ${id}\n    EN: ${l.summary_en}\n    BG: ${l.summary_bg}`);
  }
}
