#!/usr/bin/env node
// The official Община Пловдив list records two democratic-era mayors who each won
// two consecutive 4-year local elections as a single continuous span:
//   • Dr Ivan Chomakov — 1999–2007 (elected 1999 and 2003)
//   • Eng. Ivan Totev  — 2011–2019 (elected 2011 and 2015; his bio states "two
//                                    consecutive terms")
// Because they are single records, the "Multi-term mayors" graph/list (which
// groups term records by name) never flags them, so the newest multi-mandate
// mayors don't appear. This splits each into its two mandates — mirroring how the
// historical multi-term mayors are already stored (one record per term, each with
// the full bio/portrait) — using the fixed Bulgarian local-election cycle
// (1999, 2003, 2007, 2011, 2015, 2019) for the boundary.
//
// Usage: node scripts/normalize/split_consecutive_mayor_terms.mjs [--write]

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "..", "..", "data", "curated", "city-archive.json");
const WRITE = process.argv.includes("--write");

const SPLITS = {
  "archive-plovdiv-mayor-62-d-r-ivan-chomakov": {
    mid: 2003,
    t1: {
      period_bg: "1 ноември 1999 – 2003 г.",
      period_en: "1 November 1999 – 2003",
      summary_bg: "Първи от два последователни мандата като кмет на Пловдив (1999–2003).",
      summary_en: "First of two consecutive terms as mayor of Plovdiv (1999–2003)."
    },
    t2: {
      period_bg: "2003 – 28 октомври 2007 г.",
      period_en: "2003 – 28 October 2007",
      summary_bg: "Втори от два последователни мандата като кмет на Пловдив (2003–2007).",
      summary_en: "Second of two consecutive terms as mayor of Plovdiv (2003–2007)."
    }
  },
  "archive-plovdiv-mayor-64-inzh-ivan-totev": {
    mid: 2015,
    t1: {
      period_bg: "30 октомври 2011 – 2015 г.",
      period_en: "30 October 2011 – 2015",
      summary_bg: "Първи от два последователни мандата като кмет на Пловдив (2011–2015).",
      summary_en: "First of two consecutive terms as mayor of Plovdiv (2011–2015)."
    },
    t2: {
      period_bg: "2015 – 8 ноември 2019 г.",
      period_en: "2015 – 8 November 2019",
      summary_bg: "Втори от два последователни мандата като кмет на Пловдив (2015–2019).",
      summary_en: "Second of two consecutive terms as mayor of Plovdiv (2015–2019)."
    }
  }
};

const records = JSON.parse(readFileSync(FILE, "utf8"));
const out = [];
let split = 0;
for (const rec of records) {
  const plan = SPLITS[rec.id];
  if (!plan) {
    out.push(rec);
    continue;
  }
  const term1 = {
    ...rec,
    year_end: plan.mid,
    period_bg: plan.t1.period_bg,
    period_en: plan.t1.period_en,
    summary_bg: plan.t1.summary_bg,
    summary_en: plan.t1.summary_en
  };
  const term2 = {
    ...rec,
    id: `${rec.id}-2`,
    year_start: plan.mid,
    period_bg: plan.t2.period_bg,
    period_en: plan.t2.period_en,
    summary_bg: plan.t2.summary_bg,
    summary_en: plan.t2.summary_en
  };
  out.push(term1, term2);
  split++;
  console.log(`Split ${rec.id} → ${term1.year_start}-${term1.year_end} + ${term2.year_start}-${term2.year_end}`);
}
console.log(`\nSplit ${split} mayors; records ${records.length} → ${out.length}.`);
if (WRITE) {
  writeFileSync(FILE, JSON.stringify(out, null, 2) + "\n");
  console.log("Wrote", FILE);
} else {
  console.log("(dry run — pass --write)");
}
