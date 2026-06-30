import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checkedAt = "2026-06-30";
const localizedRouteLanguages = ["bg", "en", "de", "fr", "it", "tr", "es", "el", "ja"];
const translationTargetLanguages = localizedRouteLanguages.filter((lang) => lang !== "bg" && lang !== "en");

const places = readJson("data/generated/history-knowledge/places.json");
const events = readJson("data/generated/history-knowledge/events.json");
const archiveItems = readJson("data/generated/history-knowledge/archive-items.json");
const thenNowPairs = readJson("data/generated/history-knowledge/then-now-pairs.json");
const storyLongreads = readJson("data/generated/history-knowledge/story-longreads.json");
const cityArchive = readJson("data/curated/city-archive.json");
const placeWikidata = readJson("data/curated/place-wikidata-enrichment.json");
const translations = Object.fromEntries(
  localizedRouteLanguages
    .filter((lang) => lang !== "bg" && lang !== "en")
    .map((lang) => [lang, readJson(`data/translations/${lang}.json`)])
);

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function wordCount(value) {
  return String(value ?? "").split(/\s+/).filter(Boolean).length;
}

function uniqueById(items) {
  return [...new Map(items.filter(Boolean).map((item) => [item.id, item])).values()];
}

const eventById = new Map(events.map((event) => [event.id, event]));

function placeEvents(place) {
  return uniqueById([
    ...(place.event_ids ?? []).map((id) => eventById.get(id)),
    ...events.filter((event) => (event.place_ids ?? []).includes(place.id))
  ]);
}

function translatedLanguages(enText) {
  const langs = ["bg", "en"];
  for (const [lang, dictionary] of Object.entries(translations)) {
    if (dictionary[enText]) langs.push(lang);
  }
  return langs;
}

function requiresTranslation(value) {
  const text = String(value ?? "").trim();
  return Boolean(text && /\p{L}/u.test(text) && !/^https?:\/\//i.test(text));
}

function translatedLanguagesForTexts(values) {
  const texts = [...new Set(values.map((value) => String(value ?? "").trim()).filter(requiresTranslation))];
  if (texts.length === 0) return localizedRouteLanguages;
  return [
    "bg",
    "en",
    ...translationTargetLanguages.filter((lang) => texts.every((text) => translations[lang]?.[text]))
  ];
}

function wikidataClaimCount(record) {
  return Object.values(record?.claims ?? {}).reduce((sum, values) => sum + values.length, 0);
}

function placeStatus({ storyWords, wikidataRecord, linkedLongreads, linkedEvents, archiveCount, pairCount }) {
  if (storyWords >= 90 || linkedLongreads > 0 || linkedEvents > 0 || archiveCount > 0 || pairCount > 0) {
    return "long_story_rendered";
  }
  if (wikidataRecord && (Object.keys(wikidataRecord.descriptions ?? {}).length > 0 || wikidataClaimCount(wikidataRecord) > 0)) {
    return "structured_record_rendered";
  }
  return "checked_no_added_story";
}

const placeChecks = places.map((place) => {
  const linkedEvents = placeEvents(place);
  const linkedLongreads = storyLongreads.filter((story) => (story.linked_place_ids ?? []).includes(place.id));
  const linkedArchive = archiveItems.filter((item) => item.place_id === place.id);
  const linkedPairs = thenNowPairs.filter((pair) => pair.place_id === place.id);
  const wikidataRecord = placeWikidata[place.id] ?? null;
  const translatedStoryTexts = [
    place.summary_en,
    place.era_en,
    place.current_status_en,
    place.date_context?.display_en,
    place.creator_context?.display_en,
    ...place.provenance.map((item) => item.claim_en),
    ...linkedEvents.flatMap((event) => [event.date?.display_en, event.title_en, event.summary_en]),
    ...linkedLongreads.flatMap((story) => [story.title_en, story.dek_en])
  ];
  const storyWords =
    wordCount(place.summary_en) +
    linkedEvents.reduce((sum, event) => sum + wordCount(event.title_en) + wordCount(event.summary_en), 0) +
    linkedLongreads.reduce((sum, story) => sum + wordCount(story.title_en) + wordCount(story.dek_en), 0) +
    wordCount(wikidataRecord?.descriptions?.en ?? wikidataRecord?.descriptions?.bg ?? "");
  const status = placeStatus({
    storyWords,
    wikidataRecord,
    linkedLongreads: linkedLongreads.length,
    linkedEvents: linkedEvents.length,
    archiveCount: linkedArchive.length,
    pairCount: linkedPairs.length
  });

  return {
    id: place.id,
    kind: "place",
    name_en: place.name_en,
    checked_at: checkedAt,
    status,
    localized_route_languages: localizedRouteLanguages,
    evidence: {
      summary_words_en: wordCount(place.summary_en),
      rendered_story_word_estimate_en: storyWords,
      source_count: place.source_ids.length,
      linked_events: linkedEvents.length,
      linked_longreads: linkedLongreads.length,
      archive_items: linkedArchive.length,
      then_now_pairs: linkedPairs.length,
      wikidata_id: wikidataRecord?.wikidata_id ?? place.wikidata_id,
      wikidata_claim_count: wikidataClaimCount(wikidataRecord),
      wikidata_description_languages: Object.keys(wikidataRecord?.descriptions ?? {}),
      wikipedia_sitelink_languages: Object.keys(wikidataRecord?.sitelinks ?? {}),
      translated_story_languages: translatedLanguagesForTexts(translatedStoryTexts)
    },
    decision:
      status === "checked_no_added_story"
        ? "Checked. No longer source-backed story was added because the local and Wikidata evidence is too thin."
        : status === "structured_record_rendered"
          ? "Checked. A structured public-record panel is rendered from Wikidata, but no long free-form story was added."
          : "Checked. The detail page renders a longer source-backed story from curated summary, linked events, archive links, longreads or Wikidata context."
  };
});

const mayorTerms = cityArchive.filter((record) => record.kind === "mayor_term");
const mayorChecks = mayorTerms.map((mayor) => {
  const bioWords = wordCount(mayor.bio_en);
  const translated = translatedLanguages(mayor.bio_en);
  const translatedStoryTexts = [mayor.bio_en, mayor.summary_en, mayor.period_en];
  return {
    id: mayor.id,
    kind: "mayor",
    name_en: mayor.actor_en,
    checked_at: checkedAt,
    status: bioWords >= 70 ? "long_story_rendered" : "checked_no_added_story",
    localized_route_languages: localizedRouteLanguages,
    evidence: {
      bio_words_en: bioWords,
      summary_words_en: wordCount(mayor.summary_en),
      translated_bio_languages: translated,
      has_source_document: Boolean(mayor.source_document?.url),
      reference_links: (mayor.reference_links ?? []).length,
      has_official_profile: Boolean(mayor.official_profile?.url),
      has_wikidata_enrichment: Boolean(mayor.birth_wikidata || mayor.more_url),
      translated_story_languages: translatedLanguagesForTexts(translatedStoryTexts)
    },
    decision:
      bioWords >= 70
        ? "Checked. The mayor detail page renders a long source-backed story from the curated biography and mayor-term evidence."
        : "Checked. No longer source-backed story was added because the curated biography is too thin."
  };
});

const checklist = {
  generated_at: `${checkedAt}T00:00:00.000Z`,
  checked_at: checkedAt,
  supported_languages: localizedRouteLanguages,
  policy:
    "Only source-backed material is rendered. Unsupported records stay checked but are not padded with invented narrative.",
  summary: {
    places_total: placeChecks.length,
    places_long_story_rendered: placeChecks.filter((item) => item.status === "long_story_rendered").length,
    places_structured_record_rendered: placeChecks.filter((item) => item.status === "structured_record_rendered").length,
    places_checked_no_added_story: placeChecks.filter((item) => item.status === "checked_no_added_story").length,
    mayors_total: mayorChecks.length,
    mayors_long_story_rendered: mayorChecks.filter((item) => item.status === "long_story_rendered").length,
    mayors_checked_no_added_story: mayorChecks.filter((item) => item.status === "checked_no_added_story").length
  },
  places: placeChecks,
  mayors: mayorChecks
};

const outPath = path.join(root, "data/audits/story-enrichment-checklist.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(checklist, null, 2)}\n`);
console.log(
  `wrote story enrichment checklist: ${placeChecks.length} places, ${mayorChecks.length} mayor terms to ${outPath}`
);
