# Open Plovdiv History API

Open Plovdiv publishes the normalized historical knowledge base as static JSON API routes and downloadable JSON/CSV files. The generated base is built from reviewed local JSON sources by `scripts/normalize/generate_history_knowledge.mjs`.

Current curated inputs include the city archive, the historical timeline, landmarks, the historical archive media layer, then/now pairs, primary-document transcriptions, story longreads, education resources, organizations from civic/community records, the starter notable-people file, and `data/curated/person-relationships.json`. Generated `people.json` merges mayor records with `data/curated/notable-people.json`; generated `events.json` also creates source-backed `notable_person_birth` events from that people file so people are linked into the timeline and citywide Plovdiv place record.

## Entity Types

The history knowledge base has five primary entity types:

| Entity | API route | JSON download | CSV download |
| --- | --- | --- | --- |
| Events | `/api/history/events.json` | `/data/history/events.json` | `/data/history/csv/events.csv` |
| People | `/api/history/people.json` | `/data/history/people.json` | `/data/history/csv/people.csv` |
| Places | `/api/history/places.json` | `/data/history/places.json` | `/data/history/csv/places.csv` |
| Organizations | `/api/history/organizations.json` | `/data/history/organizations.json` | `/data/history/csv/organizations.csv` |
| Sources | `/api/history/sources.json` | `/data/history/sources.json` | `/data/history/csv/sources.csv` |

`/api/history/index.json` and `/data/history/index.json` contain the current data version, counts, targets, endpoint list and download directories. The index also publishes `counts.exact_date_events` and `targets.exact_date_events` so API consumers can tell whether the "On this day" panel has enough source-backed day/month records to be useful. Place image coverage is exposed through `counts.places_with_media`, `counts.place_media_items` and `targets.places_with_media`.

Event dates always carry `date.year`, `date.year_end`, `date.precision`, `date.display_bg` and `date.display_en`. When a source-backed exact start day/month is available, `date.month` and `date.day` are populated and the history page uses those fields for its "On this day" panel. Single-day records use `date.precision: "day"`; exact archive ranges such as mayoral terms keep `date.precision: "date_range_or_year_range"` and may also expose `date.month_end` and `date.day_end`. Events without a verified day/month keep `month: null` and `day: null`.

Curated core timeline entries can carry `secondary_sources[]` in addition to their primary `source`. The generated event then receives all distinct source IDs and one provenance packet per source, and the history timeline renders those source links together. If a date or claim is contested, the event can expose bilingual `conflict_notes_bg` and `conflict_notes_en`; validation requires contested timeline records to have at least two sources.

The event CSV export includes `source_count`, `conflict_notes_bg` and `conflict_notes_en` so offline reviewers can prioritize single-source and contested timeline rows without parsing the full JSON payload.

Place records always carry `date_context.precision`, `date_context.display_bg`, `date_context.display_en` and `date_context.source_id`. When a curated exact build date or year exists, `precision` is `date` or `year`; otherwise it is `era` and the display text preserves the sourced era/build context instead of inventing a precise construction date. The same field is exported to `places.csv` as `date_context_bg`, `date_context_en` and `date_precision`.

Place records also carry `creator_context.status`, `creator_context.display_bg`, `creator_context.display_en` and `creator_context.source_id`. When a named architect or builder is present, `status` is `named`; otherwise it is `not_identified` or `not_applicable` so consumers can distinguish unknown attribution from natural/city-scale features. The same field is exported to `places.csv` as `creator_context_bg`, `creator_context_en` and `creator_status`.

Place records carry `event_ids`, `person_ids`, `organization_ids`, `archive_item_ids` and `then_now_pair_ids` as source-derived back-links. Event, person and organization links are generated from existing event rows; archive and then/now links are generated from supporting archive layer records. Validation fails if any place back-link drifts from those source records, and the same fields are exported in `places.csv` for map and place-centered graph queries.

## Relationship Graph Export

The people graph is also published as first-class open data:

| Layer | API route | JSON download | CSV download |
| --- | --- | --- | --- |
| Directed person relationships | `/api/history/person-relationships.json` | `/data/history/person-relationships.json` | `/data/history/csv/person-relationships.csv` |

Relationship records are directed rows with `from_person_id`, `to_person_id`, `relationship_type`, optional `event_id`, optional Wikidata `evidence_property`, `source_ids`, provenance and editorial status. The generated relationship file expands mayor succession links plus the Wikidata-backed family/kinship seed data, and validation checks that every exported relationship is also mirrored on its source person record.

Person records carry `event_ids`, `place_ids` and `organization_ids` as source-derived back-links. These arrays are generated from existing event `person_ids`, `place_ids` and `organization_ids`; validation fails if a person back-link drifts from the event graph. The fields are also exported in `people.csv` for person-centered timeline, map and organization queries.

Organization records carry `event_ids`, `person_ids` and `place_ids` as source-derived back-links. These arrays are generated from existing event `organization_ids`, `person_ids` and `place_ids`; validation fails if an organization back-link drifts from the event graph. The fields are also exported in `organizations.csv` for organization-centered graph queries.

## Archive Layers

The history bundle also publishes starter archive layers used by the historical map and then/now UI:

| Layer | API route | JSON download | CSV download |
| --- | --- | --- | --- |
| Georeferenced archive items | `/api/history/archive-items.json` | `/data/history/archive-items.json` | `/data/history/csv/archive-items.csv` |
| Then/now pairs | `/api/history/then-now-pairs.json` | `/data/history/then-now-pairs.json` | `/data/history/csv/then-now-pairs.csv` |
| Primary document excerpts | `/api/history/primary-documents.json` | `/data/history/primary-documents.json` | `/data/history/csv/primary-documents.csv` |
| Story longreads | `/api/history/story-longreads.json` | `/data/history/story-longreads.json` | `/data/history/csv/story-longreads.csv` |
| Education resources | `/api/history/education-resources.json` | `/data/history/education-resources.json` | `/data/history/csv/education-resources.csv` |
| Editorial sign-off log | `/api/history/editorial-signoffs.json` | `/data/history/editorial-signoffs.json` | `/data/history/csv/editorial-signoffs.csv` |
| Editorial review queue | `/api/history/editorial-review.json` | `/data/history/editorial-review.json` | `/data/history/csv/editorial-review.csv` |
| Source coverage report | `/api/history/source-coverage.json` | `/data/history/source-coverage.json` | `/data/history/csv/source-coverage.csv` |

Archive items are not counted as one of the five primary entity types. They are supporting media/map records linked to `place_id` values from `places.json`. Each item carries Commons source URL, accessed date, media URL, file page URL, credit, license, georeference method and editorial status. Historical map records also carry `overlay_bounds` with south/west/north/east coordinates, method and bilingual notes so the public map can show an approximate old-map image overlay without implying control-point rectification. Generated then/now pairs reference one archive item plus one current open-licensed place image, carry their own editorial status for match, license and context review, and add `source_ids` plus `provenance[]` for the historical and current media source pages. The generated `then_media.source_id` and `now_media.source_id` fields point back to `sources.json`, and validation fails if those IDs, source URLs, access dates or license statuses are missing.

Primary document records are starter transcriptions, not full diplomatic editions. Each record carries a short BG excerpt, EN translation, transcription note, source URL, accessed date, license/reuse status, editorial status, and links to normalized events, budget items, places and organizations where available.

Education resources are lesson-plan records linked back to events, places, archive items, then/now pairs and source IDs. The generated API records add top-level `provenance[]` entries for those source IDs, including source URL, accessed date and license/reuse status. They include quiz prompts, printable worksheet tasks and BG/EN audio-tour narration scripts. They remain draft teaching materials until pedagogical review and independent editorial sign-off are logged.

Story longreads are editorial records linked back to events, places, archive items, then/now pairs and source IDs. The generated API records add top-level `provenance[]` entries for those source IDs, including source URL, accessed date and license/reuse status. They include BG/EN section text, hero media references and explicit editorial status. They remain draft features until independent editorial sign-off is logged.

People records include mayor succession links where those are supported by the mayor chronology. The person-relationship seed file adds a first Wikidata-backed set of family and kinship links between people already present in the prosopography. Relationship objects carry a `source_id`; mayor succession links carry an `event_id`, while non-event biographical relationships use `event_id: null` and preserve the Wikidata property as `evidence_property`. The generated `person-relationships.json` file exposes the same links as standalone graph rows for API consumers.

Every generated person record also receives bilingual static profile pages at `/people/{person.id}/` and `/en/people/{person.id}/`. Those pages are assembled only from the same public records: person summary, roles, linked events, relationship rows, source IDs, provenance and editorial status.

## Provenance Rules

Every event, person, place and organization record must carry:

- `source_ids` with at least one source reference.
- `provenance[]` entries with source URL, accessed date, claim text and license/reuse status.
- `editorial.status`, currently `needs_editorial_signoff` unless an independent reviewer has approved the record through `data/curated/editorial-signoffs.json`.
- when `editorial.status` is `signed_off`, non-empty `editorial.reviewed_by` and `editorial.reviewed_at` fields copied from the matching sign-off log row.

Every source record must carry:

- `url`
- `accessed_at`
- `license.status`
- `license.label`
- bilingual usage and limitation notes

Every primary-document record must carry:

- a source URL, accessed date and license/reuse-status object
- a transcription object with BG excerpt, EN translation and notes
- explicit links to normalized event, budget, place and organization IDs where those links exist
- editorial status

## Editorial Review Report

`data/curated/editorial-signoffs.json` is the authoritative independent sign-off log. Each row points to one tracked record by `collection` and `record_id`, records the reviewer name, affiliation, review date, review scope, public review-artifact URL and bilingual notes, and is schema-validated before it can affect generated data. The generated `/api/history/editorial-signoffs.json` and `/data/history/editorial-signoffs.json` files publish that raw log.

`/api/history/editorial-review.json` and `/data/history/editorial-review.json` publish the current editorial review queue for events, people, person relationships, places, organizations, archive items, then/now pairs, primary documents, story longreads and education resources. The report remains `incomplete` until `summary.signed_off_records` equals `summary.total_tracked_records`, `summary.records_with_blockers` is `0`, and `tracking_gaps` is empty.

The generated review queue includes `review_url_bg`, `review_url_en` and `api_url` so reviewers can open the public bilingual surface and the raw API collection for each row. It also includes `review_sources[]`, `source_ids`, `source_urls`, `license_statuses` and `source_count`; every source packet carries a source URL, access date and license/reuse-status field. The CSV export carries the same reviewer handoff fields for offline review.

The generated review queue includes `signoff_id`, `reviewer_affiliation`, `review_scope` and `review_artifact_url` for signed-off records. Validation fails if a record is marked `signed_off` without a matching row in `data/curated/editorial-signoffs.json`, if the reviewer/date fields diverge from that row, or if a sign-off references a missing collection/record.

The current history bundle is expected to have no editorial tracking gaps; validation fails if the generated report lists an untracked published collection. The CSV version at `/data/history/csv/editorial-review.csv` is intended for review queues, while `/data/history/csv/editorial-signoffs.csv` is the raw signed-off ledger and may be header-only until the first independent reviews are logged.

## Source Coverage Report

`/api/history/source-coverage.json` and `/data/history/source-coverage.json` publish a source/license coverage audit for the same tracked records as the editorial-review queue. The report summarizes records with at least one source, records missing source or license/reuse metadata, single-source records that need stronger multi-source review, multi-source records, open-license rows and public-reference-terms rows. Its CSV export at `/data/history/csv/source-coverage.csv` is intended for offline evidence QA and editorial planning.

The source-coverage report is not the same as independent editorial sign-off. `source_traceability_status: "complete"` means every tracked row has at least one source packet and license/reuse-status metadata. `multi_source_review_status: "needs_review"` means some rows still rely on one source and should be checked before contested dates, figures or interpretations are treated as final.

## Validation

`npm run validate` regenerates the normalized history knowledge base and validates:

- existing curated JSON datasets
- generated history bundle index, editorial sign-off ledger and editorial-review report against JSON Schema
- generated history entities against JSON Schema
- unique IDs
- event/person/place/organization/source cross-links
- person reverse links back to the event, place and organization records that mention each person
- place reverse links back to event, person, organization, archive-item and then/now records
- organization reverse links back to the event, person and place records that mention each organization
- generated person-relationship graph rows, including source links, event links and parity with embedded person relationships
- exact event start dates used by "On this day" through the generated event schema, including archive date-range starts and a minimum 60 generated day/month records
- multi-source evidence for core timeline records and bilingual conflict notes whenever a timeline record carries a contested claim/date note
- place coordinates, current status text and required source-backed build/era date context
- place architect/builder attribution context, including explicit not-identified/not-applicable statuses
- landmark/place image coverage, source IDs, credits, source pages, access dates and open-license/public-domain labels
- archive item and then/now pair cross-links to normalized places
- archive media/source license metadata, generated then/now source IDs/provenance, historical-map overlay bounds, and the minimum 30 georeferenced item / 20 pair thresholds
- primary-document source metadata and cross-links to normalized events, budget items, places and organizations
- generated story-longread links to normalized events, places, archive items, then/now pairs and source records, generated provenance fields, plus the minimum 10 longread threshold
- generated education-resource links to normalized events, places, archive items, then/now pairs and source records, plus generated provenance fields
- curated person-relationship records and generated relationship source links
- curated editorial sign-off log schema, references to tracked generated records, reviewer/date parity, public artifact URLs and one sign-off per record
- generated editorial-review report totals, collection coverage, reviewer target URLs, source packets with URL/access date/license metadata, required external sign-off logs for signed-off records, source/license blockers, and absence of untracked editorial collections
- generated source-coverage report totals, per-collection rollups, license-status counts, reviewer target URLs and parity with the editorial-review source packets
- mayor archive completeness
- notable-person schema coverage

`npm run build` then copies generated JSON and CSV files to `apps/web/public/data/history/`.

`npm run validate:history-api` runs after a production build and checks the served open-data bundle under `apps/web/dist/client`: `/api/history/index.json` must match `/data/history/index.json`, API wrapper counts must match their array lengths and index counts, downloadable JSON must match the API payload data, generated JSON downloads must still satisfy their JSON Schemas, source-coverage/editorial-review summaries must match the index, and CSV exports must have the expected header plus data-row count.

## Editorial Status

The generated history base is a normalized, source-backed foundation. It is not treated as editorially complete until records are independently reviewed and marked `signed_off`.
