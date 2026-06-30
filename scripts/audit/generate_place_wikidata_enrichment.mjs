import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const langs = ["bg", "en", "de", "fr", "it", "tr", "es", "el", "ja"];
const checkedAt = "2026-06-30";
const userAgent = "OpenPlovdivPlaceStoryAudit/1.0 (local source-backed curation)";

const claimMap = {
  P31: "instance_of",
  P1435: "heritage_designation",
  P571: "inception",
  P580: "start_time",
  P84: "architect",
  P170: "creator",
  P127: "owned_by",
  P137: "operator",
  P131: "located_in_admin_entity",
  P276: "location",
  P6375: "street_address"
};

const places = JSON.parse(fs.readFileSync(path.join(root, "data/generated/history-knowledge/places.json"), "utf8"));

function placeQid(place) {
  if (place.wikidata_id) return place.wikidata_id;
  for (const sourceId of place.source_ids ?? []) {
    const match = String(sourceId).match(/(?:^|-)q(\d+)(?:-|$)/i);
    if (match) return `Q${match[1]}`;
  }
  return null;
}

const qids = [...new Set(places.map(placeQid).filter(Boolean))];

function chunk(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

async function fetchEntities(ids, props = "labels|descriptions|claims|sitelinks") {
  const entities = new Map();
  for (const idsChunk of chunk(ids, 50)) {
    const url = new URL("https://www.wikidata.org/w/api.php");
    url.searchParams.set("action", "wbgetentities");
    url.searchParams.set("ids", idsChunk.join("|"));
    url.searchParams.set("props", props);
    url.searchParams.set("languages", langs.join("|"));
    url.searchParams.set("format", "json");
    url.searchParams.set("origin", "*");
    const response = await fetch(url, { headers: { "User-Agent": userAgent } });
    if (!response.ok) throw new Error(`Wikidata fetch failed ${response.status}: ${await response.text()}`);
    const payload = await response.json();
    for (const [id, entity] of Object.entries(payload.entities ?? {})) entities.set(id, entity);
  }
  return entities;
}

function localizedMap(values = {}) {
  return Object.fromEntries(langs.map((lang) => [lang, values[lang]?.value ?? ""]).filter(([, value]) => value));
}

function timeValue(value) {
  if (!value?.time) return null;
  const year = Number(value.time.slice(0, 5));
  return {
    time: value.time,
    precision: value.precision,
    year: Number.isFinite(year) ? year : null
  };
}

function textValue(value) {
  if (!value?.text) return null;
  return {
    text: value.text,
    language: value.language ?? null
  };
}

function siteLinks(entity) {
  return Object.fromEntries(
    langs
      .map((lang) => {
        const site = entity?.sitelinks?.[`${lang}wiki`];
        if (!site?.title) return null;
        return [
          lang,
          {
            title: site.title,
            url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(site.title.replaceAll(" ", "_"))}`
          }
        ];
      })
      .filter(Boolean)
  );
}

const entities = await fetchEntities(qids);
const valueIds = new Set();
for (const entity of entities.values()) {
  for (const property of Object.keys(claimMap)) {
    for (const claim of entity.claims?.[property] ?? []) {
      const value = claim.mainsnak?.datavalue?.value;
      if (value?.["entity-type"] === "item" && value.id) valueIds.add(value.id);
    }
  }
}
const valueEntities = await fetchEntities([...valueIds], "labels|descriptions");

function itemValue(value) {
  const entity = valueEntities.get(value.id);
  return {
    id: value.id,
    labels: localizedMap(entity?.labels ?? {}),
    descriptions: localizedMap(entity?.descriptions ?? {})
  };
}

function normalizeClaim(claim) {
  const value = claim.mainsnak?.datavalue?.value;
  if (!value) return null;
  if (value["entity-type"] === "item" && value.id) return { type: "item", ...itemValue(value) };
  if (value.time) return { type: "time", ...timeValue(value) };
  if (value.text) return { type: "text", ...textValue(value) };
  return null;
}

const records = {};
for (const place of places) {
  const qid = placeQid(place);
  const entity = qid ? entities.get(qid) : null;
  if (!entity) continue;
  const claims = {};
  for (const [property, key] of Object.entries(claimMap)) {
    const values = (entity.claims?.[property] ?? []).map(normalizeClaim).filter(Boolean);
    if (values.length > 0) claims[key] = values.slice(0, 5);
  }
  records[place.id] = {
    place_id: place.id,
    wikidata_id: qid,
    wikidata_url: `https://www.wikidata.org/wiki/${qid}`,
    checked_at: checkedAt,
    labels: localizedMap(entity.labels ?? {}),
    descriptions: localizedMap(entity.descriptions ?? {}),
    sitelinks: siteLinks(entity),
    claims
  };
}

const outPath = path.join(root, "data/curated/place-wikidata-enrichment.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(records, null, 2)}\n`);
console.log(`wrote ${Object.keys(records).length} place Wikidata enrichment records to ${outPath}`);
