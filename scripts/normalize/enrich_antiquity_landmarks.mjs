#!/usr/bin/env node
// Hand-written, source-backed descriptions for Plovdiv's marquee antiquity sites,
// drawn from the Plovdiv Wikipedia article ("Antiquity" and "Roman City" sections).
// Replaces terse/auto-imported summaries with readable prose. Nebet Tepe already
// has a rich summary and is left untouched.
//
// Usage: node scripts/normalize/enrich_antiquity_landmarks.mjs [--write]

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "..", "..", "data", "curated", "plovdiv-landmarks.json");
const WRITE = process.argv.includes("--write");

const ENRICHMENT = {
  "landmark-ancient-theatre": {
    en: "Probably the best-known ancient monument in Bulgaria, built in the 90s of the 1st century AD under Emperor Domitian. Set in the saddle between two of the three hills, it seated about 7,000 on two tiers of 14 rows each. Studied and restored between 1968 and 1984, it is among the best-preserved Roman theatres in the world and still hosts the Opera Open and other festivals.",
    bg: "Вероятно най-известният античен паметник в България, изграден през 90-те години на I век при император Домициан. Разположен в седловината между два от трите хълма, той е побирал около 7000 зрители на два сектора с по 14 реда. Проучен и реставриран между 1968 и 1984 г., той е сред най-добре запазените римски театри в света и днес е сцена на Opera Open и други фестивали."
  },
  "landmark-ancient-stadium": {
    en: "One of the largest structures of Roman Philippopolis, built in the 2nd century under Emperor Hadrian and modelled on the stadium at Delphi. Around 240 metres long, it could hold up to 30,000 spectators for athletic games staged by the provincial assembly of Thrace — games the city's mint celebrated on its coins. Today only the northern curve, with 14 rows of seats, is exposed beneath Dzhumaya Square; the rest lies under the modern city.",
    bg: "Една от най-големите постройки на римския Филипопол, изградена през II век при император Адриан и по образец на стадиона в Делфи. Дълъг около 240 метра, той е побирал до 30 000 зрители за атлетически игри, организирани от провинциалното събрание на Тракия — игри, които градският монетен двор отбелязва върху монетите си. Днес е разкрита само северната извивка с 14 реда седалки под площад Джумая; останалото е под съвременния град."
  },
  "landmark-forum-philippopolis": {
    en: "The civic heart of Roman Philippopolis: a public square begun under Emperor Vespasian in the 1st century and completed in the 2nd, covering about 11 hectares. Ringed by shops, the city council's Odeon and other public buildings, it was the focal point of the ancient street grid, near today's central post office.",
    bg: "Гражданското сърце на римския Филипопол: площад, започнат при император Веспасиан през I век и завършен през II век, с площ около 11 хектара. Заобиколен от магазини, одеона на градския съвет и други обществени сгради, той е средоточието на античната улична мрежа, близо до днешната Централна поща."
  },
  "landmark-odeon-of-philippopolis-q26046109": {
    en: "The smaller of Philippopolis's two antique theatres, built between the 2nd and 5th centuries. It began as a bouleuterion — the meeting house of the city council — seating about 350, and was later remodelled into a theatre. Restored in 2004, it stands beside the Roman Forum.",
    bg: "По-малкият от двата античния театъра на Филипопол, изграден между II и V век. Първоначално е булевтерион — сграда на градския съвет с около 350 места, а по-късно е преустроен в театър. Реставриран през 2004 г., той се намира до Римския форум."
  },
  "landmark-eirene-residence-q26898191": {
    en: "A richly decorated late-Roman town house (3rd–4th century) that belonged to a wealthy citizen, preserved in the Archaeological Underpass. It is named after Eirene — the Christian name of Penelope, a maiden said to have converted in the 2nd century — and is known for its colourful mosaics of geometric patterns and figures.",
    bg: "Богато украсена късноримска градска къща (III–IV век) на заможен гражданин, запазена в Археологическия подлез. Носи името Ейрене — християнското име на Пенелопа, девойка, приела християнството през II век — и е известна с пъстрите си мозайки с геометрични фигури и образи."
  }
};

const landmarks = JSON.parse(readFileSync(FILE, "utf8"));
let changed = 0;
for (const l of landmarks) {
  const e = ENRICHMENT[l.id];
  if (!e) continue;
  l.summary_en = e.en;
  l.summary_bg = e.bg;
  if (l.data_quality === "public_source") l.data_quality = "manual_reviewed";
  changed++;
  console.log(`✓ ${l.id} (${e.en.length} chars)`);
}
console.log(`\nEnriched ${changed}/${Object.keys(ENRICHMENT).length} sites.`);
if (WRITE) {
  writeFileSync(FILE, JSON.stringify(landmarks, null, 2) + "\n");
  console.log("Wrote", FILE);
} else {
  console.log("(dry run — pass --write)");
}
