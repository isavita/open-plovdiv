import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const supportedLanguages = ["bg", "en", "de", "fr", "it", "tr", "es", "el", "ja"];
const translationTargetLanguages = supportedLanguages.filter((lang) => lang !== "bg" && lang !== "en");
const validPlaceStatuses = new Set(["long_story_rendered", "structured_record_rendered", "checked_no_added_story"]);
const validMayorStatuses = new Set(["long_story_rendered", "checked_no_added_story"]);
const issues = [];

function fail(message) {
  issues.push(message);
}

function readJson(relativePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
  } catch (error) {
    throw new Error(`${relativePath}: ${error.message}`);
  }
}

function sameArray(a, b) {
  return Array.isArray(a) && a.length === b.length && a.every((value, index) => value === b[index]);
}

function sortedIds(items) {
  return items.map((item) => item.id).sort((a, b) => a.localeCompare(b));
}

function wordCount(value) {
  return String(value ?? "").split(/\s+/).filter(Boolean).length;
}

function uniqueById(items) {
  return [...new Map(items.filter(Boolean).map((item) => [item.id, item])).values()];
}

function requiresTranslation(value) {
  const text = String(value ?? "").trim();
  return Boolean(text && /\p{L}/u.test(text) && !/^https?:\/\//i.test(text));
}

function translatedLanguagesForTexts(values, translations) {
  const texts = [...new Set(values.map((value) => String(value ?? "").trim()).filter(requiresTranslation))];
  if (texts.length === 0) return supportedLanguages;
  return [
    "bg",
    "en",
    ...translationTargetLanguages.filter((lang) => texts.every((text) => translations[lang]?.[text]))
  ];
}

function translatedLanguages(enText, translations) {
  const langs = ["bg", "en"];
  for (const lang of translationTargetLanguages) {
    if (translations[lang]?.[enText]) langs.push(lang);
  }
  return langs;
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

function assertLanguageArray(label, value) {
  if (!sameArray(value, supportedLanguages)) {
    fail(`${label}: expected languages ${supportedLanguages.join(", ")}, got ${Array.isArray(value) ? value.join(", ") : value}`);
  }
}

function assertExactArray(label, actual, expected) {
  if (!sameArray(actual, expected)) {
    fail(`${label}: expected ${expected.join(", ")}, got ${Array.isArray(actual) ? actual.join(", ") : actual}`);
  }
}

const checklist = readJson("data/audits/story-enrichment-checklist.json");
const places = readJson("data/generated/history-knowledge/places.json");
const events = readJson("data/generated/history-knowledge/events.json");
const archiveItems = readJson("data/generated/history-knowledge/archive-items.json");
const thenNowPairs = readJson("data/generated/history-knowledge/then-now-pairs.json");
const storyLongreads = readJson("data/generated/history-knowledge/story-longreads.json");
const cityArchive = readJson("data/curated/city-archive.json");
const placeWikidata = readJson("data/curated/place-wikidata-enrichment.json");
const translations = Object.fromEntries(
  translationTargetLanguages.map((lang) => [lang, readJson(`data/translations/${lang}.json`)])
);

assertLanguageArray("checklist.supported_languages", checklist.supported_languages);
if (!checklist.policy?.includes("Unsupported records")) {
  fail("checklist policy must state that unsupported records are not padded with invented narrative");
}

const eventById = new Map(events.map((event) => [event.id, event]));
const checklistPlaces = checklist.places ?? [];
const checklistMayors = checklist.mayors ?? [];
const placeByChecklistId = new Map(checklistPlaces.map((item) => [item.id, item]));
const mayorByChecklistId = new Map(checklistMayors.map((item) => [item.id, item]));
const mayorTerms = cityArchive.filter((record) => record.kind === "mayor_term");

assertExactArray("place checklist ids", sortedIds(checklistPlaces), sortedIds(places));
assertExactArray("mayor checklist ids", sortedIds(checklistMayors), sortedIds(mayorTerms));

function placeEvents(place) {
  return uniqueById([
    ...(place.event_ids ?? []).map((id) => eventById.get(id)),
    ...events.filter((event) => (event.place_ids ?? []).includes(place.id))
  ]);
}

for (const place of places) {
  const item = placeByChecklistId.get(place.id);
  if (!item) continue;
  if (!validPlaceStatuses.has(item.status)) fail(`${place.id}: invalid place status ${item.status}`);
  assertLanguageArray(`${place.id}.localized_route_languages`, item.localized_route_languages);

  const linkedEvents = placeEvents(place);
  const linkedLongreads = storyLongreads.filter((story) => (story.linked_place_ids ?? []).includes(place.id));
  const linkedArchive = archiveItems.filter((archiveItem) => archiveItem.place_id === place.id);
  const linkedPairs = thenNowPairs.filter((pair) => pair.place_id === place.id);
  const wikidataRecord = placeWikidata[place.id] ?? null;
  const storyWords =
    wordCount(place.summary_en) +
    linkedEvents.reduce((sum, event) => sum + wordCount(event.title_en) + wordCount(event.summary_en), 0) +
    linkedLongreads.reduce((sum, story) => sum + wordCount(story.title_en) + wordCount(story.dek_en), 0) +
    wordCount(wikidataRecord?.descriptions?.en ?? wikidataRecord?.descriptions?.bg ?? "");
  const expectedStatus = placeStatus({
    storyWords,
    wikidataRecord,
    linkedLongreads: linkedLongreads.length,
    linkedEvents: linkedEvents.length,
    archiveCount: linkedArchive.length,
    pairCount: linkedPairs.length
  });
  if (item.status !== expectedStatus) {
    fail(`${place.id}: status ${item.status} does not match recomputed status ${expectedStatus}`);
  }

  const translatedStoryTexts = [
    place.summary_en,
    place.era_en,
    place.current_status_en,
    place.date_context?.display_en,
    place.creator_context?.display_en,
    ...(place.provenance ?? []).map((provenance) => provenance.claim_en),
    ...linkedEvents.flatMap((event) => [event.date?.display_en, event.title_en, event.summary_en]),
    ...linkedLongreads.flatMap((story) => [story.title_en, story.dek_en])
  ];
  const expectedStoryLanguages = translatedLanguagesForTexts(translatedStoryTexts, translations);
  assertExactArray(`${place.id}.translated_story_languages`, item.evidence?.translated_story_languages, expectedStoryLanguages);
  assertLanguageArray(`${place.id}.translated_story_languages complete`, item.evidence?.translated_story_languages);

  const evidence = item.evidence ?? {};
  if (evidence.summary_words_en !== wordCount(place.summary_en)) fail(`${place.id}: summary word count drifted`);
  if (evidence.rendered_story_word_estimate_en !== storyWords) fail(`${place.id}: rendered story word estimate drifted`);
  if (evidence.source_count !== (place.source_ids ?? []).length) fail(`${place.id}: source count drifted`);
  if (evidence.linked_events !== linkedEvents.length) fail(`${place.id}: linked event count drifted`);
  if (evidence.linked_longreads !== linkedLongreads.length) fail(`${place.id}: linked longread count drifted`);
  if (evidence.archive_items !== linkedArchive.length) fail(`${place.id}: archive item count drifted`);
  if (evidence.then_now_pairs !== linkedPairs.length) fail(`${place.id}: then/now pair count drifted`);
  if (evidence.wikidata_id !== (wikidataRecord?.wikidata_id ?? place.wikidata_id)) fail(`${place.id}: Wikidata id drifted`);
  if (evidence.wikidata_claim_count !== wikidataClaimCount(wikidataRecord)) fail(`${place.id}: Wikidata claim count drifted`);

  if (item.status === "long_story_rendered") {
    const hasNarrativeEvidence =
      storyWords >= 90 || linkedEvents.length > 0 || linkedLongreads.length > 0 || linkedArchive.length > 0 || linkedPairs.length > 0;
    if (!hasNarrativeEvidence) fail(`${place.id}: long story status has no narrative evidence`);
  }
  if (item.status === "structured_record_rendered" && !wikidataRecord) {
    fail(`${place.id}: structured record status requires Wikidata evidence`);
  }
  if (item.status === "checked_no_added_story" && !item.decision?.includes("No longer source-backed story")) {
    fail(`${place.id}: checked-no-story decision must explain that no unsupported story was added`);
  }
}

for (const mayor of mayorTerms) {
  const item = mayorByChecklistId.get(mayor.id);
  if (!item) continue;
  if (!validMayorStatuses.has(item.status)) fail(`${mayor.id}: invalid mayor status ${item.status}`);
  assertLanguageArray(`${mayor.id}.localized_route_languages`, item.localized_route_languages);

  const evidence = item.evidence ?? {};
  const expectedStatus = wordCount(mayor.bio_en) >= 70 ? "long_story_rendered" : "checked_no_added_story";
  if (item.status !== expectedStatus) fail(`${mayor.id}: status ${item.status} does not match recomputed status ${expectedStatus}`);
  if (evidence.bio_words_en !== wordCount(mayor.bio_en)) fail(`${mayor.id}: bio word count drifted`);
  if (evidence.summary_words_en !== wordCount(mayor.summary_en)) fail(`${mayor.id}: summary word count drifted`);
  if (evidence.has_source_document !== Boolean(mayor.source_document?.url)) fail(`${mayor.id}: source document evidence drifted`);
  if (evidence.reference_links !== (mayor.reference_links ?? []).length) fail(`${mayor.id}: reference link count drifted`);

  assertExactArray(
    `${mayor.id}.translated_bio_languages`,
    evidence.translated_bio_languages,
    translatedLanguages(mayor.bio_en, translations)
  );
  assertLanguageArray(`${mayor.id}.translated_bio_languages complete`, evidence.translated_bio_languages);
  assertExactArray(
    `${mayor.id}.translated_story_languages`,
    evidence.translated_story_languages,
    translatedLanguagesForTexts([mayor.bio_en, mayor.summary_en, mayor.period_en], translations)
  );
  assertLanguageArray(`${mayor.id}.translated_story_languages complete`, evidence.translated_story_languages);

  if (item.status === "long_story_rendered" && !mayor.source_document?.url) {
    fail(`${mayor.id}: long mayor story requires a source document`);
  }
  if (item.status === "checked_no_added_story" && !item.decision?.includes("curated biography is too thin")) {
    fail(`${mayor.id}: checked-no-story decision must explain why no long story was added`);
  }
}

const summary = checklist.summary ?? {};
const actualPlaceStatusCounts = Object.fromEntries([...validPlaceStatuses].map((status) => [status, 0]));
for (const item of checklistPlaces) actualPlaceStatusCounts[item.status] = (actualPlaceStatusCounts[item.status] ?? 0) + 1;
const actualMayorStatusCounts = Object.fromEntries([...validMayorStatuses].map((status) => [status, 0]));
for (const item of checklistMayors) actualMayorStatusCounts[item.status] = (actualMayorStatusCounts[item.status] ?? 0) + 1;

if (summary.places_total !== places.length) fail(`summary.places_total expected ${places.length}, got ${summary.places_total}`);
if (summary.places_long_story_rendered !== actualPlaceStatusCounts.long_story_rendered) fail("summary places_long_story_rendered drifted");
if (summary.places_structured_record_rendered !== actualPlaceStatusCounts.structured_record_rendered) fail("summary places_structured_record_rendered drifted");
if (summary.places_checked_no_added_story !== actualPlaceStatusCounts.checked_no_added_story) fail("summary places_checked_no_added_story drifted");
if (summary.mayors_total !== mayorTerms.length) fail(`summary.mayors_total expected ${mayorTerms.length}, got ${summary.mayors_total}`);
if (summary.mayors_long_story_rendered !== actualMayorStatusCounts.long_story_rendered) fail("summary mayors_long_story_rendered drifted");
if (summary.mayors_checked_no_added_story !== actualMayorStatusCounts.checked_no_added_story) fail("summary mayors_checked_no_added_story drifted");

if (issues.length > 0) {
  console.error(`story enrichment checklist validation failed: ${issues.length} issue(s)`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(
  `story enrichment checklist validation passed: ${places.length} places and ${mayorTerms.length} mayor terms checked across ${supportedLanguages.length} locales`
);
