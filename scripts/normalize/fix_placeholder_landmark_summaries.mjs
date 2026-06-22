#!/usr/bin/env node
// Replace the remaining "[X] is a publicly documented site in Plovdiv" /
// "публично документиран обект" placeholder summaries (74 landmarks) with clean,
// truthful text. The marquee sites get hand-written descriptions; the rest get a
// category-based fallback built only from reliable fields (category, era, build
// year) — no fabricated detail. The landmark name already shows as the card title.
//
// Usage: node scripts/normalize/fix_placeholder_landmark_summaries.mjs [--write]

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "..", "..", "data", "curated", "plovdiv-landmarks.json");
const WRITE = process.argv.includes("--write");

const PLACEHOLDER = /publicly documented site|публично документиран обект/i;

// Famous sites — conservative facts (each landmark keeps its own source link).
const MARQUEE = {
  "landmark-dzhumaya-square-q59368698": {
    en: "One of Plovdiv's main squares, laid out above the northern curve of the Roman stadium of Philippopolis.",
    bg: "Един от главните площади на Пловдив, разположен над северната извивка на римския стадион на Филипопол."
  },
  "landmark-balabanov-house-q12272873": {
    en: "A reconstructed National Revival house in Plovdiv's Old Town, dating to around 1900 and used today for exhibitions and cultural events.",
    bg: "Възстановена възрожденска къща в Стария град на Пловдив от около 1900 г., използвана днес за изложби и културни събития."
  },
  "landmark-house-of-hristo-g-danov-q29961385": {
    en: "The house-museum of Hristo G. Danov, a pioneer of modern Bulgarian book publishing, in Plovdiv's Old Town.",
    bg: "Къщата музей на Христо Г. Данов — пионер на модерното българско книгоиздаване, в Стария град на Пловдив."
  },
  "landmark-house-of-nikola-nedkovich-q29961368": {
    en: "A National Revival house in Plovdiv's Old Town, built in 1863 and preserved as a house-museum of 19th-century urban life.",
    bg: "Възрожденска къща в Стария град на Пловдив, построена през 1863 г. и запазена като къща музей на градския бит от XIX век."
  },
  "landmark-kapana-q12282547": {
    en: "Kapana (\"the Trap\"), a quarter of narrow streets in central Plovdiv, today known as the city's creative and crafts district.",
    bg: "Капана — квартал от тесни улички в центъра на Пловдив, днес известен като творческия и занаятчийски квартал на града."
  }
};

function builtYear(l) {
  if (l.built_year) return String(l.built_year);
  if (l.built_date) { const m = String(l.built_date).match(/(\d{3,4})/); if (m) return m[1]; }
  return null;
}

function fallback(l) {
  const yr = builtYear(l);
  switch (l.category) {
    case "revival":
      return {
        en: `A building from Plovdiv's National Revival period${yr ? `, dating to ${yr}` : ""}.`,
        bg: `Сграда от епохата на Българското възраждане в Пловдив${yr ? `, от ${yr} г.` : ""}.`
      };
    case "religious":
      return {
        en: "A historic place of worship in the city of Plovdiv.",
        bg: "Историчен храм в град Пловдив."
      };
    case "hill":
      return {
        en: "One of the hills on which Plovdiv is built.",
        bg: "Един от хълмовете, върху които е изграден Пловдив."
      };
    case "civic":
    default:
      return {
        en: `A public site in the city of Plovdiv${yr ? `, dating to ${yr}` : ""}.`,
        bg: `Обществен обект в град Пловдив${yr ? `, от ${yr} г.` : ""}.`
      };
  }
}

const landmarks = JSON.parse(readFileSync(FILE, "utf8"));
let marquee = 0;
let generic = 0;
for (const l of landmarks) {
  if (!PLACEHOLDER.test((l.summary_en || "") + (l.summary_bg || ""))) continue;
  if (MARQUEE[l.id]) {
    l.summary_en = MARQUEE[l.id].en;
    l.summary_bg = MARQUEE[l.id].bg;
    if (l.data_quality === "public_source") l.data_quality = "manual_reviewed";
    marquee++;
  } else {
    const f = fallback(l);
    l.summary_en = f.en;
    l.summary_bg = f.bg;
    generic++;
  }
}
console.log(`Replaced placeholders — marquee: ${marquee}, category fallback: ${generic}.`);
const left = landmarks.filter((l) => PLACEHOLDER.test((l.summary_en || "") + (l.summary_bg || "")));
console.log("Remaining placeholder summaries:", left.length);
if (WRITE) {
  writeFileSync(FILE, JSON.stringify(landmarks, null, 2) + "\n");
  console.log("Wrote", FILE);
} else {
  console.log("(dry run — pass --write)");
}
