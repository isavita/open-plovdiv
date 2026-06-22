#!/usr/bin/env node
// After slop-stripping, a handful of landmark summaries fell below the schema's
// 20-char minimum (bare Wikidata descriptors like "Хотел в Пловдив."). This sets
// concise, truthful bilingual summaries for those, using only facts implied by
// the landmark's name/type (e.g. a boulevard's namesake, district position).
//
// Usage: node scripts/normalize/fix_short_landmark_summaries.mjs [--write]

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "..", "..", "data", "curated", "plovdiv-landmarks.json");
const WRITE = process.argv.includes("--write");

const FIX = {
  "landmark-alyosha-monument-q4063802": {
    en: "An 11-metre ferroconcrete statue of a Soviet soldier on Bunardzhik Hill in Plovdiv.",
    bg: "11-метрова стоманобетонна статуя на съветски войник на хълма Бунарджик в Пловдив."
  },
  "landmark-church-of-st-constantine-and-helena-q5117391": {
    en: "An Orthodox church in Plovdiv's Old Town, dedicated to Saints Constantine and Helena.",
    bg: "Православна църква в Стария град на Пловдив, посветена на светите Константин и Елена."
  },
  "landmark-dzhendem-tepe-q5319673": {
    en: "The highest of Plovdiv's hills (also called Mladezhki Halm).",
    bg: "Най-високият от хълмовете на Пловдив (известен и като Младежки хълм)."
  },
  "landmark-hristo-botev-stadium-q849662": {
    en: "A football stadium in Plovdiv, home ground of Botev Plovdiv.",
    bg: "Футболен стадион в Пловдив, дом на Ботев Пловдив."
  },
  "landmark-humanitarian-high-school-saints-cyril-and-methodius-plovdiv-q12290859": {
    en: "The Saints Cyril and Methodius humanities high school in Plovdiv.",
    bg: "Хуманитарна гимназия „Св. св. Кирил и Методий“ в Пловдив."
  },
  "landmark-maritsa-hotel-q6765912": {
    en: "A hotel in the city of Plovdiv, Bulgaria.",
    bg: "Хотел в град Пловдив, България."
  },
  "landmark-markovo-tepe-q6771348": {
    en: "One of the syenite hills of Plovdiv, Bulgaria.",
    bg: "Един от сиенитните хълмове на Пловдив."
  },
  "landmark-plovdiv-synagogue-q7205169": {
    en: "The Zion Synagogue in Plovdiv, one of the few preserved synagogues in Bulgaria.",
    bg: "Синагогата „Цион“ в Пловдив — една от малкото запазени синагоги в България."
  },
  "landmark-small-basilica-q16744679": {
    en: "An Early Christian basilica in Plovdiv, known for its mosaic floors.",
    bg: "Раннохристиянска базилика в Пловдив, известна с подовите си мозайки."
  },
  "landmark-synagogue-of-philippopolis-q20499146": {
    en: "An ancient synagogue uncovered in Plovdiv (Philippopolis).",
    bg: "Антична синагога, открита в Пловдив (Филипопол)."
  },
  "landmark-tashkyopryu-mosque-q26258392": {
    en: "An Ottoman-era mosque in the city of Plovdiv.",
    bg: "Османска джамия в град Пловдив."
  },
  "landmark-trakiya-district-q3557743": {
    en: "Trakiya, a large residential district of Plovdiv.",
    bg: "„Тракия“ — голям жилищен район на Пловдив."
  },
  "landmark-central-district-q5062096": {
    en: "The Central district of Plovdiv, covering the historic core.",
    bg: "Централният район на Пловдив, обхващащ историческото ядро."
  },
  "landmark-eastern-district-q12281496": {
    en: "The Eastern district of Plovdiv, Bulgaria.",
    bg: "Източният район на град Пловдив, България."
  },
  "landmark-sahabettin-imaret-mosque-q3409168": {
    en: "The Imaret Mosque, an Ottoman-era mosque in Plovdiv.",
    bg: "Имарет джамия — османска джамия в Пловдив."
  },
  "landmark-naycho-tsanov-boulevard-in-plovdiv-q31192970": {
    en: "A boulevard in Plovdiv named after Naycho Tsanov.",
    bg: "Булевард в Пловдив, носещ името на Найчо Цанов."
  },
  "landmark-russian-boulevard-in-plovdiv-q58300426": {
    en: "Russian Boulevard, a thoroughfare in the city of Plovdiv.",
    bg: "Руски булевард — голяма артерия в град Пловдив."
  },
  "landmark-vasil-aprilov-boulevard-in-plovdiv-q31192975": {
    en: "A boulevard in Plovdiv named after Vasil Aprilov.",
    bg: "Булевард в Пловдив, носещ името на Васил Априлов."
  }
};

const landmarks = JSON.parse(readFileSync(FILE, "utf8"));
let changed = 0;
for (const l of landmarks) {
  const f = FIX[l.id];
  if (!f) continue;
  l.summary_en = f.en;
  l.summary_bg = f.bg;
  changed++;
}
console.log(`Fixed ${changed}/${Object.keys(FIX).length} short summaries.`);
const stillShort = landmarks.filter((l) => (l.summary_bg || "").length < 20 || (l.summary_en || "").length < 20);
console.log("Remaining <20-char summaries:", stillShort.length, stillShort.map((l) => l.id).join(", "));
if (WRITE) {
  writeFileSync(FILE, JSON.stringify(landmarks, null, 2) + "\n");
  console.log("Wrote", FILE);
} else {
  console.log("(dry run — pass --write)");
}
