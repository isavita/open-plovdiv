#!/usr/bin/env node
// Enrich Plovdiv mayors with sourced Wikidata facts: the person's own Wikipedia
// article, education (P69), occupations (P106), positions held (P39) and a
// Wikipedia link for the birthplace. Conservative matching: a candidate entity
// is only accepted when it is a human (P31=Q5) AND its birth/death years match
// the years already stated in our bio (±1), or — when the bio has no years — its
// description clearly ties it to Bulgaria/Plovdiv/a mayor/politician. Never
// guesses; unmatched mayors are simply skipped.
//
// Usage:
//   node scripts/ingest/enrich_mayors_wikidata.mjs            # dry run, prints
//   node scripts/ingest/enrich_mayors_wikidata.mjs --write    # writes data
//   node scripts/ingest/enrich_mayors_wikidata.mjs --limit 5  # only first N

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const ARCHIVE = join(ROOT, "data", "curated", "city-archive.json");

const UA = "OpenPlovdivResearch/1.0 (Plovdiv civic-history project; contact isavitaisa@gmail.com)";
const WRITE = process.argv.includes("--write");
const limitArg = process.argv.indexOf("--limit");
const LIMIT = limitArg > -1 ? Number(process.argv[limitArg + 1]) : Infinity;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wd(params) {
  const url = "https://www.wikidata.org/w/api.php?" + new URLSearchParams({ format: "json", ...params });
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
      if (res.ok) return await res.json();
    } catch {}
    await sleep(800 * (attempt + 1));
  }
  return null;
}

function bioYears(bio) {
  if (!bio) return null;
  // matches "(1854-1944)" or "(1854 – 1944)" or "(1854-)" near the name
  const m = bio.match(/\((\d{4})\s*[–-]\s*(\d{4})?\)/);
  if (!m) return null;
  const birth = Number(m[1]);
  const death = m[2] ? Number(m[2]) : null;
  // Guard against term-period parentheses like "(2003-2007)" being mistaken for a
  // lifespan: a real life is at least ~15 years and births predate ~2010.
  if (birth > 2010) return null;
  if (death != null && (death - birth < 15 || death - birth > 110)) return null;
  return { birth, death };
}

// Strip academic/professional honorifics that hurt name search.
function cleanName(name) {
  return (name || "")
    .replace(/^(д-р|др\.?|проф\.?|акад\.?|инж\.?|ген\.?|полк\.?|d-r|dr\.?|prof\.?|eng\.?|ing\.?)\s+/i, "")
    .trim();
}

function yearOf(claimDateValue) {
  // wikibase time value e.g. "+1854-00-00T00:00:00Z"
  if (!claimDateValue) return null;
  const m = String(claimDateValue).match(/^[+-]?(\d{4})/);
  return m ? Number(m[1]) : null;
}

function getClaimEntityIds(entity, prop) {
  const claims = entity?.claims?.[prop] ?? [];
  return claims
    .map((c) => c?.mainsnak?.datavalue?.value?.id)
    .filter(Boolean);
}

function getClaimTime(entity, prop) {
  const claims = entity?.claims?.[prop] ?? [];
  return claims.map((c) => yearOf(c?.mainsnak?.datavalue?.value?.time)).filter((y) => y != null);
}

function getClaimString(entity, prop) {
  const claims = entity?.claims?.[prop] ?? [];
  return claims.map((c) => c?.mainsnak?.datavalue?.value).filter((v) => typeof v === "string");
}

async function fetchEntities(ids) {
  if (!ids.length) return {};
  const out = {};
  for (let i = 0; i < ids.length; i += 45) {
    const batch = ids.slice(i, i + 45);
    const data = await wd({
      action: "wbgetentities",
      ids: batch.join("|"),
      props: "labels|descriptions|claims|sitelinks/urls",
      languages: "bg|en"
    });
    Object.assign(out, data?.entities ?? {});
    await sleep(300);
  }
  return out;
}

function label(entity, lang) {
  return entity?.labels?.[lang]?.value ?? entity?.labels?.en?.value ?? entity?.labels?.bg?.value ?? null;
}
function wikiUrl(entity, lang) {
  return entity?.sitelinks?.[`${lang}wiki`]?.url ?? null;
}

async function resolvePerson(nameBg, nameEn, years) {
  const seen = new Set();
  const candidates = [];
  for (const [name, lang] of [[cleanName(nameBg), "bg"], [cleanName(nameEn), "en"]]) {
    if (!name) continue;
    const search = await wd({ action: "wbsearchentities", search: name, language: lang, uselang: lang, limit: "6", type: "item" });
    for (const r of search?.search ?? []) if (!seen.has(r.id)) { seen.add(r.id); candidates.push(r.id); }
    await sleep(250);
  }
  if (!candidates.length) return null;
  const entities = await fetchEntities(candidates);
  let best = null;
  for (const id of candidates) {
    const e = entities[id];
    if (!e) continue;
    const isHuman = getClaimEntityIds(e, "P31").includes("Q5");
    if (!isHuman) continue;
    const births = getClaimTime(e, "P569");
    const deaths = getClaimTime(e, "P570");
    const desc = `${e.descriptions?.bg?.value ?? ""} ${e.descriptions?.en?.value ?? ""}`.toLowerCase();
    // "strong" = ties this entity to Plovdiv or a mayoralty specifically; "weak" =
    // generic Bulgarian-politician wording (not enough on its own).
    const descStrong = /кмет|пловдив|mayor|plovdiv/.test(desc);
    const descWeak = /bulgar|българ|политик|politician|депутат|министър|minister|общественик/.test(desc);
    const birthMatch = years?.birth != null && births.some((y) => Math.abs(y - years.birth) <= 1);
    const deathMatch = years?.death != null && deaths.some((y) => Math.abs(y - years.death) <= 1);
    let score = 0;
    if (birthMatch) score += 10;
    if (deathMatch) score += 6;
    if (descStrong) score += 5; else if (descWeak) score += 2;
    const hasWiki = wikiUrl(e, "bg") || wikiUrl(e, "en");
    // Accept only on a confirmed birth year, or a Plovdiv/mayor-specific description
    // backed by a Wikipedia article. Generic "politician" alone is rejected.
    const accept = birthMatch || (descStrong && hasWiki);
    if (accept && score > (best?.score ?? -1)) best = { id, entity: e, score };
  }
  return best;
}

async function main() {
  const archive = JSON.parse(readFileSync(ARCHIVE, "utf8"));
  const records = Array.isArray(archive) ? archive : archive.records ?? [];
  const mayors = records.filter((r) => r.kind === "mayor_term");

  // unique persons by actor_bg (multiple terms share one person)
  const byPerson = new Map();
  for (const m of mayors) {
    if (!byPerson.has(m.actor_bg)) byPerson.set(m.actor_bg, m);
  }
  const persons = [...byPerson.values()].slice(0, LIMIT);
  console.log(`Resolving ${persons.length} unique mayors...\n`);

  const enrichment = {};
  let matched = 0;
  for (const m of persons) {
    const years = bioYears(field(m, "bio"));
    const best = await resolvePerson(m.actor_bg, m.actor_en, years);
    if (!best) {
      console.log(`✗ ${m.actor_bg} ${years ? `(${years.birth}-${years.death ?? ""})` : ""} — no confident match`);
      continue;
    }
    const e = best.entity;
    const eduIds = getClaimEntityIds(e, "P69");
    const occIds = getClaimEntityIds(e, "P106");
    const posIds = getClaimEntityIds(e, "P39");
    // birthplace: prefer the QID we already curated, else the person's P19
    const birthQid = m.birth_wikidata || getClaimEntityIds(e, "P19")[0] || null;
    const refEntities = await fetchEntities([
      ...new Set([...eduIds, ...occIds, ...posIds, ...(birthQid ? [birthQid] : [])])
    ]);
    const mapEnt = (ids) => [...new Set(ids)].map((id) => ({
      wikidata: id,
      name_bg: label(refEntities[id], "bg"),
      name_en: label(refEntities[id], "en"),
      wikipedia_bg: wikiUrl(refEntities[id], "bg"),
      wikipedia_en: wikiUrl(refEntities[id], "en")
    })).filter((x) => x.name_en || x.name_bg);

    const birthEnt = birthQid ? refEntities[birthQid] : null;
    const rec = {
      person_wikidata: best.id,
      person_wikipedia_bg: wikiUrl(e, "bg"),
      person_wikipedia_en: wikiUrl(e, "en"),
      official_website: getClaimString(e, "P856")[0] ?? null,
      birthplace_wikidata: birthQid,
      birthplace_name_bg: label(birthEnt, "bg"),
      birthplace_name_en: label(birthEnt, "en"),
      birthplace_wikipedia_bg: wikiUrl(birthEnt, "bg"),
      birthplace_wikipedia_en: wikiUrl(birthEnt, "en"),
      education: mapEnt(eduIds),
      occupations: mapEnt(occIds).slice(0, 4),
      positions: mapEnt(posIds).slice(0, 5)
    };
    enrichment[m.actor_bg] = rec;
    matched++;
    console.log(`✓ ${m.actor_bg} → ${best.id} (score ${best.score})`);
    console.log(`   wiki: ${rec.person_wikipedia_bg ?? rec.person_wikipedia_en ?? "—"}`);
    console.log(`   education: ${rec.education.map((x) => x.name_en || x.name_bg).join(", ") || "—"}`);
    console.log(`   occupations: ${rec.occupations.map((x) => x.name_en || x.name_bg).join(", ") || "—"}`);
    await sleep(400);
  }

  console.log(`\nMatched ${matched}/${persons.length}.`);
  if (WRITE) {
    const outPath = join(ROOT, "data", "curated", "mayor-wikidata-enrichment.json");
    writeFileSync(outPath, JSON.stringify(enrichment, null, 2) + "\n");
    console.log(`Wrote ${outPath}`);
  } else {
    console.log("(dry run — pass --write to save)");
  }
}

function field(rec, base) {
  return rec[`${base}_bg`] ?? rec[`${base}_en`] ?? "";
}

main().catch((e) => { console.error(e); process.exit(1); });
