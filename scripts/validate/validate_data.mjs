import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const root = process.cwd();
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

execFileSync(process.execPath, ["scripts/normalize/generate_history_knowledge.mjs"], {
  cwd: root,
  stdio: "inherit"
});

const datasets = [
  {
    label: "projects",
    dataPath: "data/curated/projects.json",
    schemaPath: "data/schemas/project.schema.json",
    minRecords: 1
  },
  {
    label: "community initiatives",
    dataPath: "data/curated/community-initiatives.json",
    schemaPath: "data/schemas/community-initiative.schema.json",
    minRecords: 1
  },
  {
    label: "budget items",
    dataPath: "data/curated/budget-items.json",
    schemaPath: "data/schemas/budget-item.schema.json",
    minRecords: 1
  },
  {
    label: "city archive",
    dataPath: "data/curated/city-archive.json",
    schemaPath: "data/schemas/city-archive.schema.json",
    minRecords: 1
  },
  {
    label: "history timeline",
    dataPath: "data/curated/plovdiv-history.json",
    schemaPath: "data/schemas/plovdiv-history.schema.json",
    minRecords: 1
  },
  {
    label: "landmarks",
    dataPath: "data/curated/plovdiv-landmarks.json",
    schemaPath: "data/schemas/plovdiv-landmark.schema.json",
    minRecords: 1
  },
  {
    label: "population",
    dataPath: "data/curated/plovdiv-population.json",
    schemaPath: "data/schemas/plovdiv-population.schema.json",
    minRecords: 1
  },
  {
    label: "neighbourhoods",
    dataPath: "data/curated/plovdiv-neighbourhoods.json",
    schemaPath: "data/schemas/plovdiv-neighbourhood.schema.json",
    minRecords: 1
  },
  {
    label: "climate",
    dataPath: "data/curated/plovdiv-climate.json",
    schemaPath: "data/schemas/plovdiv-climate.schema.json",
    minRecords: 12
  },
  {
    label: "historical archive items",
    dataPath: "data/curated/historical-archive-items.json",
    schemaPath: "data/schemas/historical-archive-item.schema.json",
    minRecords: 30
  },
  {
    label: "then-now pairs",
    dataPath: "data/curated/then-now-pairs.json",
    schemaPath: "data/schemas/then-now-pair.schema.json",
    minRecords: 20
  },
  {
    label: "primary documents",
    dataPath: "data/curated/primary-documents.json",
    schemaPath: "data/schemas/primary-document.schema.json",
    minRecords: 3
  },
  {
    label: "education resources",
    dataPath: "data/curated/education-resources.json",
    schemaPath: "data/schemas/education-resource.schema.json",
    minRecords: 5
  },
  {
    label: "story longreads",
    dataPath: "data/curated/story-longreads.json",
    schemaPath: "data/schemas/story-longread.schema.json",
    minRecords: 10
  },
  {
    label: "notable people",
    dataPath: "data/curated/notable-people.json",
    schemaPath: "data/schemas/notable-person.schema.json",
    minRecords: 1
  },
  {
    label: "person relationships",
    dataPath: "data/curated/person-relationships.json",
    schemaPath: "data/schemas/person-relationship.schema.json",
    minRecords: 1
  },
  {
    label: "editorial signoffs",
    dataPath: "data/curated/editorial-signoffs.json",
    schemaPath: "data/schemas/editorial-signoff.schema.json",
    minRecords: 0
  },
  {
    label: "fix reports",
    dataPath: "data/curated/fix-reports.json",
    schemaPath: "data/schemas/fix-report.schema.json",
    minRecords: 0
  },
  {
    label: "knowledge sources",
    dataPath: "data/generated/history-knowledge/sources.json",
    schemaPath: "data/schemas/knowledge-source.schema.json",
    minRecords: 1
  },
  {
    label: "knowledge index",
    dataPath: "data/generated/history-knowledge/index.json",
    schemaPath: "data/schemas/history-index.schema.json",
    topLevel: "object"
  },
  {
    label: "knowledge events",
    dataPath: "data/generated/history-knowledge/events.json",
    schemaPath: "data/schemas/knowledge-event.schema.json",
    minRecords: 1
  },
  {
    label: "knowledge people",
    dataPath: "data/generated/history-knowledge/people.json",
    schemaPath: "data/schemas/knowledge-person.schema.json",
    minRecords: 1
  },
  {
    label: "knowledge person relationships",
    dataPath: "data/generated/history-knowledge/person-relationships.json",
    schemaPath: "data/schemas/knowledge-person-relationship.schema.json",
    minRecords: 1
  },
  {
    label: "knowledge places",
    dataPath: "data/generated/history-knowledge/places.json",
    schemaPath: "data/schemas/knowledge-place.schema.json",
    minRecords: 1
  },
  {
    label: "knowledge organizations",
    dataPath: "data/generated/history-knowledge/organizations.json",
    schemaPath: "data/schemas/knowledge-organization.schema.json",
    minRecords: 1
  },
  {
    label: "knowledge archive items",
    dataPath: "data/generated/history-knowledge/archive-items.json",
    schemaPath: "data/schemas/historical-archive-item.schema.json",
    minRecords: 30
  },
  {
    label: "knowledge then-now pairs",
    dataPath: "data/generated/history-knowledge/then-now-pairs.json",
    schemaPath: "data/schemas/knowledge-then-now-pair.schema.json",
    minRecords: 20
  },
  {
    label: "knowledge primary documents",
    dataPath: "data/generated/history-knowledge/primary-documents.json",
    schemaPath: "data/schemas/primary-document.schema.json",
    minRecords: 3
  },
  {
    label: "knowledge story longreads",
    dataPath: "data/generated/history-knowledge/story-longreads.json",
    schemaPath: "data/schemas/story-longread.schema.json",
    minRecords: 10
  },
  {
    label: "knowledge education resources",
    dataPath: "data/generated/history-knowledge/education-resources.json",
    schemaPath: "data/schemas/education-resource.schema.json",
    minRecords: 5
  },
  {
    label: "knowledge editorial signoffs",
    dataPath: "data/generated/history-knowledge/editorial-signoffs.json",
    schemaPath: "data/schemas/editorial-signoff.schema.json",
    minRecords: 0
  },
  {
    label: "knowledge editorial review",
    dataPath: "data/generated/history-knowledge/editorial-review.json",
    schemaPath: "data/schemas/editorial-review.schema.json",
    topLevel: "object"
  },
  {
    label: "knowledge source coverage",
    dataPath: "data/generated/history-knowledge/source-coverage.json",
    schemaPath: "data/schemas/source-coverage.schema.json",
    topLevel: "object"
  },
  {
    label: "walking routes",
    dataPath: "data/curated/walking-routes.json",
    schemaPath: "data/schemas/walking-route.schema.json",
    minRecords: 12
  },
  {
    label: "neighbourhood histories",
    dataPath: "data/curated/neighbourhood-histories.json",
    schemaPath: "data/schemas/neighbourhood-history.schema.json",
    minRecords: 12
  }
];

const forbiddenFixKeys = new Set([
  "name",
  "email",
  "phone",
  "ip",
  "ip_address",
  "user_id",
  "account_id",
  "submitted_by"
]);

const openMediaLicensePattern = /\b(CC BY(?:-SA)?|CC0|Creative Commons|Public Domain|PD-(?:OLD|US|ART))\b/i;

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function formatErrors(errors = []) {
  return errors
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
}

function assertUniqueIds(records, label) {
  const seen = new Set();
  for (const record of records) {
    if (seen.has(record.id)) {
      throw new Error(`${label}: duplicate id ${record.id}`);
    }
    seen.add(record.id);
  }
}

function assertNoPrivateFixFields(records) {
  for (const record of records) {
    for (const key of Object.keys(record)) {
      if (forbiddenFixKeys.has(key.toLowerCase())) {
        throw new Error(`fix reports: private field "${key}" is not allowed`);
      }
    }
  }
}

function assertProjectBudgetLinks(projects, budgetItems) {
  const budgetIds = new Set(budgetItems.map((item) => item.id));
  for (const project of projects) {
    // The link is optional; only validate it when a project declares one.
    if (project.related_budget_item_id && !budgetIds.has(project.related_budget_item_id)) {
      throw new Error(
        `projects: ${project.id} references missing budget item ${project.related_budget_item_id}`
      );
    }
  }
}

function assertCommunityProjectLinks(initiatives, projects) {
  const projectIds = new Set(projects.map((project) => project.id));
  for (const initiative of initiatives) {
    for (const projectId of initiative.related_project_ids ?? []) {
      if (!projectIds.has(projectId)) {
        throw new Error(
          `community initiatives: ${initiative.id} references missing project ${projectId}`
        );
      }
    }
  }
}

function assertMayorArchiveCompleteness(cityArchive) {
  const municipalityMayorListUrl =
    "https://www.plovdiv.bg/administration/mayor/mayors-of-plovdiv/";
  const administrativeRegisterUrl =
    "https://iisda.government.bg/ras/governing_bodies/governing_body/4700";
  const mayors = cityArchive
    .filter((record) => record.kind === "mayor_term")
    .sort((a, b) => a.year_start - b.year_start || (a.year_end ?? 9999) - (b.year_end ?? 9999));
  const normalizedMunicipalityTerms = mayors.filter((record) =>
    record.source_document.url === municipalityMayorListUrl
  );
  const current = mayors.find(
    (record) => record.actor_bg === "Костадин Димитров" && record.year_start === 2023 && record.year_end == null
  );
  const splitTermGroups = [
    {
      actor: "Д-р Иван Чомаков",
      ids: [
        "archive-plovdiv-mayor-62-d-r-ivan-chomakov",
        "archive-plovdiv-mayor-62-d-r-ivan-chomakov-2"
      ],
      periods: [
        [1999, 2003],
        [2003, 2007]
      ]
    },
    {
      actor: "инж. Иван Тотев",
      ids: [
        "archive-plovdiv-mayor-64-inzh-ivan-totev",
        "archive-plovdiv-mayor-64-inzh-ivan-totev-2"
      ],
      periods: [
        [2011, 2015],
        [2015, 2019]
      ]
    }
  ];
  const normalizedSplitIds = new Set(splitTermGroups.flatMap((group) => group.ids));
  const verbatimMunicipalityRows = normalizedMunicipalityTerms.filter(
    (record) => !normalizedSplitIds.has(record.id)
  );

  // The municipality publishes 65 historical rows. Its two consolidated
  // democratic-era spans are normalized into four elected terms for the
  // multi-term views, so the local chronology contains 67 historical terms.
  if (normalizedMunicipalityTerms.length !== 67) {
    throw new Error(
      `city archive: expected 67 normalized municipality mayor terms, got ${normalizedMunicipalityTerms.length}`
    );
  }
  if (verbatimMunicipalityRows.length !== 63 || verbatimMunicipalityRows.length + splitTermGroups.length !== 65) {
    throw new Error(
      `city archive: expected 63 verbatim municipality rows plus 2 consolidated spans, got ${verbatimMunicipalityRows.length} rows`
    );
  }
  for (const group of splitTermGroups) {
    const terms = group.ids.map((id) => mayors.find((record) => record.id === id));
    if (terms.some((term) => !term)) {
      throw new Error(`city archive: missing normalized term for ${group.actor}`);
    }
    terms.forEach((term, index) => {
      const [yearStart, yearEnd] = group.periods[index];
      if (
        term.actor_bg !== group.actor ||
        term.year_start !== yearStart ||
        term.year_end !== yearEnd ||
        term.source_document.url !== municipalityMayorListUrl
      ) {
        throw new Error(`city archive: invalid normalized municipality term ${term.id}`);
      }
    });
  }
  if (mayors.length !== 68) {
    throw new Error(`city archive: expected 68 mayor terms including incumbent, got ${mayors.length}`);
  }
  if (mayors[0]?.actor_bg !== "Атанас Самоковлиев" || mayors[0]?.year_start !== 1878) {
    throw new Error("city archive: first mayor term must be Атанас Самоковлиев in 1878");
  }
  if (verbatimMunicipalityRows.at(-1)?.actor_bg !== "Здравко Димитров") {
    throw new Error("city archive: official municipality list should end with Здравко Димитров");
  }
  if (!current) {
    throw new Error("city archive: missing incumbent mayor term for Костадин Димитров from 2023");
  }
  if (current.source_document.url !== administrativeRegisterUrl) {
    throw new Error("city archive: incumbent mayor must be sourced to the Bulgarian Administrative Register");
  }
  const dateMatch = current.source_document.accessed_at.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateMatch) {
    throw new Error("city archive: incumbent source must have an ISO access date");
  }
  const [, year, month, day] = dateMatch;
  const bgMonthNames = [
    "януари",
    "февруари",
    "март",
    "април",
    "май",
    "юни",
    "юли",
    "август",
    "септември",
    "октомври",
    "ноември",
    "декември"
  ];
  const enMonthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const accessDateBg = `${Number(day)} ${bgMonthNames[Number(month) - 1]} ${year} г.`;
  const accessDateEn = `${Number(day)} ${enMonthNames[Number(month) - 1]} ${year}`;
  if (
    !current.period_bg.endsWith(`действащ към ${accessDateBg}`) ||
    !current.period_en.endsWith(`incumbent as of ${accessDateEn}`)
  ) {
    throw new Error("city archive: incumbent display date must match its Administrative Register access date");
  }
  for (const mayor of mayors) {
    if (mayor.summary_bg?.includes("г..")) {
      throw new Error(`city archive: ${mayor.id} has duplicate terminal punctuation in Bulgarian`);
    }
  }
}

function assertReviewedTimelineFacts(historyTimeline) {
  const byId = new Map(historyTimeline.map((record) => [record.id, record]));
  const liberation = byId.get("history-liberation-1878");
  if (
    !liberation ||
    liberation.date_month !== 1 ||
    liberation.date_day !== 16 ||
    liberation.source?.url !==
      "https://rimplovdiv.com/en/2026/01/16/the-liberation-of-plovdiv-16-january-1878/" ||
    liberation.data_quality !== "manual_reviewed" ||
    liberation.conflict_notes_bg ||
    liberation.conflict_notes_en
  ) {
    throw new Error(
      "history timeline: Liberation of Plovdiv must use the reviewed 16 January 1878 Regional History Museum record"
    );
  }

  const bessiContext = byId.get("history-thracian-town-bessi");
  if (
    !bessiContext ||
    bessiContext.year !== -600 ||
    bessiContext.source?.url !== "https://www.visitplovdiv.com/en/node/145"
  ) {
    throw new Error(
      "history timeline: Bessi/Odrysian context must retain the reviewed 6th-to-early-5th-century source"
    );
  }

  const nebetTepe = byId.get("history-prehistory-nebet-tepe");
  if (
    !nebetTepe ||
    nebetTepe.year !== -5000 ||
    !nebetTepe.conflict_notes_bg ||
    !nebetTepe.conflict_notes_en ||
    nebetTepe.source?.url !== "https://www.visitplovdiv.com/en/node/521"
  ) {
    throw new Error(
      "history timeline: Nebet Tepe must preserve the reviewed source range and bilingual date uncertainty note"
    );
  }
}

function assertEnglishArchiveDateParity(cityArchive) {
  const bgDateTokens = [
    "януари",
    "февруари",
    "март",
    "април",
    "май",
    "юни",
    "юли",
    "август",
    "септември",
    "октомври",
    "ноември",
    "декември",
    "и.д. кмет",
    "действащ към"
  ];

  for (const record of cityArchive) {
    for (const field of ["period_en", "summary_en"]) {
      const value = record[field];
      if (typeof value !== "string") continue;
      const foundToken = bgDateTokens.find((token) => value.includes(token));
      if (foundToken || /\bг\./.test(value)) {
        throw new Error(`city archive: ${record.id} has non-English date text in ${field}`);
      }
    }
  }
}

function assertKnowledgeLinks(loaded) {
  const sources = new Set(loaded.get("knowledge sources").map((record) => record.id));
  const events = new Set(loaded.get("knowledge events").map((record) => record.id));
  const people = new Set(loaded.get("knowledge people").map((record) => record.id));
  const embeddedPersonRelationships = new Set(
    loaded
      .get("knowledge people")
      .flatMap((record) =>
        record.relationships.map((relationship) =>
          [
            record.id,
            relationship.type,
            relationship.person_id,
            relationship.event_id ?? "",
            relationship.source_id,
            relationship.evidence_property ?? ""
          ].join("|")
        )
      )
  );
  const places = new Set(loaded.get("knowledge places").map((record) => record.id));
  const organizations = new Set(loaded.get("knowledge organizations").map((record) => record.id));
  const archiveItems = new Set(loaded.get("knowledge archive items").map((record) => record.id));
  const thenNowPairs = new Set(loaded.get("knowledge then-now pairs").map((record) => record.id));
  const budgetItems = new Set(loaded.get("budget items").map((record) => record.id));
  const placeBacklinks = new Map(
    [...places].map((id) => [
      id,
      {
        event_ids: new Set(),
        person_ids: new Set(),
        organization_ids: new Set(),
        archive_item_ids: new Set(),
        then_now_pair_ids: new Set()
      }
    ])
  );
  const personBacklinks = new Map(
    [...people].map((id) => [
      id,
      {
        event_ids: new Set(),
        place_ids: new Set(),
        organization_ids: new Set()
      }
    ])
  );
  const organizationBacklinks = new Map(
    [...organizations].map((id) => [
      id,
      {
        event_ids: new Set(),
        person_ids: new Set(),
        place_ids: new Set()
      }
    ])
  );

  const assertKnown = (record, field, id, set) => {
    if (!set.has(id)) {
      throw new Error(`knowledge: ${record.id} references missing ${field} ${id}`);
    }
  };

  const assertSources = (record) => {
    if (!record.source_ids?.length) {
      throw new Error(`knowledge: ${record.id} has no source_ids`);
    }
    for (const sourceId of record.source_ids) assertKnown(record, "source", sourceId, sources);
    for (const item of record.provenance ?? []) assertKnown(record, "source", item.source_id, sources);
  };

  const assertExactBacklinkSet = (record, field, actual, expected) => {
    const actualValues = actual ?? [];
    const actualSet = new Set(actualValues);
    if (actualSet.size !== actualValues.length) {
      throw new Error(`knowledge: ${record.id} has duplicate ${field}`);
    }
    if (actualSet.size !== expected.size || [...expected].some((id) => !actualSet.has(id))) {
      throw new Error(
        `knowledge: ${record.id} ${field} does not match source-derived graph`
      );
    }
  };

  for (const record of loaded.get("knowledge events")) {
    assertSources(record);
    for (const id of record.person_ids) {
      assertKnown(record, "person", id, people);
      const backLinks = personBacklinks.get(id);
      backLinks.event_ids.add(record.id);
      for (const placeId of record.place_ids) backLinks.place_ids.add(placeId);
      for (const organizationId of record.organization_ids) backLinks.organization_ids.add(organizationId);
    }
    for (const id of record.place_ids) {
      assertKnown(record, "place", id, places);
      const backLinks = placeBacklinks.get(id);
      backLinks.event_ids.add(record.id);
      for (const personId of record.person_ids) backLinks.person_ids.add(personId);
      for (const organizationId of record.organization_ids) backLinks.organization_ids.add(organizationId);
    }
    for (const id of record.organization_ids) {
      assertKnown(record, "organization", id, organizations);
      const backLinks = organizationBacklinks.get(id);
      backLinks.event_ids.add(record.id);
      for (const personId of record.person_ids) backLinks.person_ids.add(personId);
      for (const placeId of record.place_ids) backLinks.place_ids.add(placeId);
    }
  }

  for (const record of loaded.get("knowledge archive items")) {
    assertKnown(record, "place", record.place_id, places);
    const backLinks = placeBacklinks.get(record.place_id);
    backLinks.archive_item_ids.add(record.id);
  }

  for (const record of loaded.get("knowledge then-now pairs")) {
    assertKnown(record, "place", record.place_id, places);
    const backLinks = placeBacklinks.get(record.place_id);
    backLinks.then_now_pair_ids.add(record.id);
  }

  for (const record of loaded.get("knowledge people")) {
    assertSources(record);
    for (const id of record.term_events) assertKnown(record, "event", id, events);
    for (const id of record.event_ids) assertKnown(record, "event", id, events);
    for (const id of record.place_ids) assertKnown(record, "place", id, places);
    for (const id of record.organization_ids) assertKnown(record, "organization", id, organizations);
    const expected = personBacklinks.get(record.id);
    assertExactBacklinkSet(record, "event_ids", record.event_ids, expected.event_ids);
    assertExactBacklinkSet(record, "place_ids", record.place_ids, expected.place_ids);
    assertExactBacklinkSet(record, "organization_ids", record.organization_ids, expected.organization_ids);
    for (const relationship of record.relationships) {
      assertKnown(record, "person", relationship.person_id, people);
      if (relationship.event_id) assertKnown(record, "event", relationship.event_id, events);
      assertKnown(record, "source", relationship.source_id, sources);
    }
  }

  for (const record of loaded.get("knowledge person relationships")) {
    assertSources(record);
    assertKnown(record, "from person", record.from_person_id, people);
    assertKnown(record, "to person", record.to_person_id, people);
    if (record.event_id) assertKnown(record, "event", record.event_id, events);
    const embeddedKey = [
      record.from_person_id,
      record.relationship_type,
      record.to_person_id,
      record.event_id ?? "",
      record.source_ids[0],
      record.evidence_property ?? ""
    ].join("|");
    if (!embeddedPersonRelationships.has(embeddedKey)) {
      throw new Error(`knowledge: ${record.id} is not mirrored in its source person record`);
    }
  }

  for (const record of loaded.get("knowledge places")) {
    assertSources(record);
    if (record.coordinates) assertKnown(record, "source", record.coordinates.source_id, sources);
    for (const id of record.event_ids) assertKnown(record, "event", id, events);
    for (const id of record.person_ids) assertKnown(record, "person", id, people);
    for (const id of record.organization_ids) assertKnown(record, "organization", id, organizations);
    for (const id of record.archive_item_ids) assertKnown(record, "archive item", id, archiveItems);
    for (const id of record.then_now_pair_ids) assertKnown(record, "then-now pair", id, thenNowPairs);
    const expected = placeBacklinks.get(record.id);
    assertExactBacklinkSet(record, "event_ids", record.event_ids, expected.event_ids);
    assertExactBacklinkSet(record, "person_ids", record.person_ids, expected.person_ids);
    assertExactBacklinkSet(record, "organization_ids", record.organization_ids, expected.organization_ids);
    assertExactBacklinkSet(record, "archive_item_ids", record.archive_item_ids, expected.archive_item_ids);
    assertExactBacklinkSet(record, "then_now_pair_ids", record.then_now_pair_ids, expected.then_now_pair_ids);
  }

  for (const record of loaded.get("knowledge organizations")) {
    assertSources(record);
    for (const id of record.event_ids) assertKnown(record, "event", id, events);
    for (const id of record.person_ids) assertKnown(record, "person", id, people);
    for (const id of record.place_ids) assertKnown(record, "place", id, places);
    const expected = organizationBacklinks.get(record.id);
    assertExactBacklinkSet(record, "event_ids", record.event_ids, expected.event_ids);
    assertExactBacklinkSet(record, "person_ids", record.person_ids, expected.person_ids);
    assertExactBacklinkSet(record, "place_ids", record.place_ids, expected.place_ids);
  }

  for (const record of loaded.get("knowledge primary documents")) {
    assertSources(record);
    if (!record.source?.url || !record.source?.accessed_at || !record.source?.license?.url) {
      throw new Error(`primary documents: ${record.id} has incomplete source provenance`);
    }
    for (const id of record.linked_event_ids) assertKnown(record, "event", id, events);
    for (const id of record.linked_budget_item_ids) assertKnown(record, "budget item", id, budgetItems);
    for (const id of record.linked_place_ids) assertKnown(record, "place", id, places);
    for (const id of record.linked_organization_ids) assertKnown(record, "organization", id, organizations);
  }
}

function assertTimelineExactDateCoverage(loaded) {
  const events = loaded.get("knowledge events");
  for (const record of events) {
    if (Boolean(record.date?.month) !== Boolean(record.date?.day)) {
      throw new Error(`knowledge events: ${record.id} has incomplete start day/month`);
    }
    if (Boolean(record.date?.month_end) !== Boolean(record.date?.day_end)) {
      throw new Error(`knowledge events: ${record.id} has incomplete end day/month`);
    }
    if ((record.date?.month_end || record.date?.day_end) && !(record.date?.month && record.date?.day)) {
      throw new Error(`knowledge events: ${record.id} has an end day/month without a start day/month`);
    }
  }
  const exactDateEvents = events.filter((record) => record.date?.month && record.date?.day);
  if (exactDateEvents.length < 60) {
    throw new Error(
      `knowledge events: expected at least 60 events with exact day/month for On This Day, got ${exactDateEvents.length}`
    );
  }
}

function assertTimelineSourceRigor(loaded) {
  const timelineEvents = loaded
    .get("knowledge events")
    .filter((record) => record.category === "historical_timeline");
  const multiSourceEvents = timelineEvents.filter((record) => new Set(record.source_ids ?? []).size >= 2);
  if (multiSourceEvents.length < 10) {
    throw new Error(
      `knowledge events: expected at least 10 multi-source core timeline records, got ${multiSourceEvents.length}`
    );
  }
  for (const record of timelineEvents) {
    if (Boolean(record.conflict_notes_bg) !== Boolean(record.conflict_notes_en)) {
      throw new Error(`knowledge events: ${record.id} has incomplete bilingual conflict notes`);
    }
    if ((record.conflict_notes_bg || record.conflict_notes_en) && new Set(record.source_ids ?? []).size < 2) {
      throw new Error(`knowledge events: ${record.id} has conflict notes without at least two sources`);
    }
  }
}

function extractLifeYearsFromText(...texts) {
  for (const text of texts.filter(Boolean)) {
    const matches = String(text).matchAll(/\((р\.|b\.)?\s*(\d{4})(?:\s*[–-]\s*(\d{4}))?[^)]*\)/giu);
    for (const match of matches) {
      const hasBirthMarker = Boolean(match[1]);
      const birthYear = Number(match[2]);
      const deathYear = match[3] ? Number(match[3]) : null;
      if (deathYear && deathYear - birthYear >= 15 && deathYear - birthYear <= 125) {
        return { birth_year: birthYear, death_year: deathYear };
      }
      if (!deathYear && hasBirthMarker) {
        return { birth_year: birthYear, death_year: null };
      }
    }
  }
  return null;
}

function assertKnowledgePersonProfiles(loaded) {
  const people = loaded.get("knowledge people");
  const peopleByNameBg = new Map(people.map((record) => [record.name_bg, record]));
  const mayorTerms = loaded.get("city archive").filter((record) => record.kind === "mayor_term");
  const mayorNames = [...new Set(mayorTerms.map((record) => record.actor_bg))];

  for (const name of mayorNames) {
    const person = peopleByNameBg.get(name);
    if (!person) {
      throw new Error(`knowledge people: missing mayor profile for ${name}`);
    }
    if (!person.roles.includes("mayor")) {
      throw new Error(`knowledge people: mayor profile ${person.id} is missing mayor role`);
    }
    if (!person.term_events.length) {
      throw new Error(`knowledge people: mayor profile ${person.id} has no term_events`);
    }
  }

  for (const person of people) {
    const lifeYears = extractLifeYearsFromText(person.summary_bg, person.summary_en);
    if (lifeYears && person.birth_year !== lifeYears.birth_year) {
      throw new Error(
        `knowledge people: ${person.id} summary life birth year ${lifeYears.birth_year} does not match structured birth_year ${person.birth_year}`
      );
    }
    if (lifeYears && (person.death_year ?? null) !== lifeYears.death_year) {
      throw new Error(
        `knowledge people: ${person.id} summary life death year ${lifeYears.death_year} does not match structured death_year ${person.death_year}`
      );
    }
  }
}

function assertKnowledgePlaceCoverage(loaded) {
  const sources = new Set(loaded.get("knowledge sources").map((record) => record.id));
  const allowedPrecisions = new Set(["date", "year", "era"]);
  const allowedCreatorStatuses = new Set(["named", "not_identified", "not_applicable"]);

  for (const record of loaded.get("knowledge places")) {
    if (!record.coordinates) {
      throw new Error(`knowledge places: ${record.id} is missing coordinates`);
    }
    if (!record.current_status_bg || !record.current_status_en) {
      throw new Error(`knowledge places: ${record.id} is missing current status text`);
    }
    if (!record.date_context?.display_bg || !record.date_context?.display_en) {
      throw new Error(`knowledge places: ${record.id} is missing build/era date context`);
    }
    if (!allowedPrecisions.has(record.date_context.precision)) {
      throw new Error(`knowledge places: ${record.id} has invalid date precision ${record.date_context.precision}`);
    }
    if (!sources.has(record.date_context.source_id)) {
      throw new Error(`knowledge places: ${record.id} date_context references missing source ${record.date_context.source_id}`);
    }
    if ((record.built_date || record.built_year != null) && record.date_context.precision === "era") {
      throw new Error(`knowledge places: ${record.id} has an exact build value but only era date context`);
    }
    if (!record.built_date && record.built_year == null && record.date_context.precision !== "era") {
      throw new Error(`knowledge places: ${record.id} has no exact build value but non-era date context`);
    }
    if (!record.creator_context?.display_bg || !record.creator_context?.display_en) {
      throw new Error(`knowledge places: ${record.id} is missing architect/builder attribution context`);
    }
    if (!allowedCreatorStatuses.has(record.creator_context.status)) {
      throw new Error(`knowledge places: ${record.id} has invalid creator status ${record.creator_context.status}`);
    }
    if (!sources.has(record.creator_context.source_id)) {
      throw new Error(`knowledge places: ${record.id} creator_context references missing source ${record.creator_context.source_id}`);
    }
    if ((record.architect_bg || record.builder_bg) && record.creator_context.status !== "named") {
      throw new Error(`knowledge places: ${record.id} has named architect/builder data but non-named creator context`);
    }
    if (!record.architect_bg && !record.builder_bg && record.creator_context.status === "named") {
      throw new Error(`knowledge places: ${record.id} has named creator context without architect/builder fields`);
    }
  }
}

function assertGeneratedProvenance(label, record) {
  if (!record.source_ids?.length) {
    throw new Error(`${label}: ${record.id} has no source_ids`);
  }
  if (!Array.isArray(record.provenance) || record.provenance.length === 0) {
    throw new Error(`${label}: ${record.id} has no generated provenance`);
  }
  const provenanceSourceIds = new Set(record.provenance.map((item) => item.source_id));
  for (const sourceId of record.source_ids) {
    if (!provenanceSourceIds.has(sourceId)) {
      throw new Error(`${label}: ${record.id} provenance is missing source ${sourceId}`);
    }
  }
  for (const item of record.provenance) {
    if (!item.url || !item.accessed_at || !item.license_status) {
      throw new Error(`${label}: ${record.id} has incomplete provenance for ${item.source_id}`);
    }
  }
}

function assertOpenMedia(label, record, media, field) {
  const missingFields = ["url", "page_url", "credit", "license", "license_url", "accessed_at"].filter(
    (key) => !media?.[key]
  );
  if (missingFields.length > 0) {
    throw new Error(`${label}: ${record.id} has incomplete ${field} metadata: ${missingFields.join(", ")}`);
  }
  if (!openMediaLicensePattern.test(media.license)) {
    throw new Error(`${label}: ${record.id} has non-open ${field} license "${media.license}"`);
  }
  for (const key of ["url", "page_url", "license_url"]) {
    try {
      if (new URL(media[key]).protocol !== "https:") {
        throw new Error(`${label}: ${record.id} ${field}.${key} must use HTTPS`);
      }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`${label}: ${record.id} ${field}.${key} is not a valid URL`);
      }
      throw error;
    }
  }
}

function mediaUrlKey(value) {
  try {
    const url = new URL(value);
    return `${url.hostname}${decodeURIComponent(url.pathname)}`.toLocaleLowerCase("en");
  } catch {
    return String(value ?? "").trim().toLocaleLowerCase("en");
  }
}

function assertPlaceMediaLicensing(loaded) {
  for (const record of loaded.get("landmarks")) {
    if (!Array.isArray(record.media) || record.media.length === 0) {
      throw new Error(`landmarks: ${record.id} must include at least one rights-cleared image`);
    }
    for (const [index, media] of record.media.entries()) {
      assertOpenMedia("landmarks", record, media, `media[${index}]`);
    }
  }

  for (const record of loaded.get("knowledge places")) {
    if (!Array.isArray(record.media) || record.media.length === 0) {
      throw new Error(`knowledge places: ${record.id} must include at least one rights-cleared image`);
    }
    for (const [index, media] of record.media.entries()) {
      assertOpenMedia("knowledge places", record, media, `media[${index}]`);
      if (!media.source_id) {
        throw new Error(`knowledge places: ${record.id} media[${index}] is missing source_id`);
      }
    }
  }
}

function assertArchiveLayer(loaded) {
  const places = new Set(loaded.get("knowledge places").map((record) => record.id));
  const archiveItems = loaded.get("historical archive items");
  const publishedArchiveItems = loaded.get("knowledge archive items");
  const thenNowPairs = loaded.get("knowledge then-now pairs");
  const archiveIds = new Set(archiveItems.map((record) => record.id));
  const sourceIds = new Set(loaded.get("knowledge sources").map((record) => record.id));

  const georeferencedItems = archiveItems.filter((record) => record.coordinates);
  if (georeferencedItems.length < 30) {
    throw new Error(
      `historical archive items: expected at least 30 georeferenced records, got ${georeferencedItems.length}`
    );
  }

  if (thenNowPairs.length < 20) {
    throw new Error(`then-now pairs: expected at least 20 pairs, got ${thenNowPairs.length}`);
  }

  for (const [label, records] of [
    ["published archive items", publishedArchiveItems],
    ["published then-now pairs", thenNowPairs]
  ]) {
    for (const record of records) {
      if (record.editorial?.status !== "needs_editorial_signoff") continue;
      const note = record.editorial.notes_en ?? "";
      if (!note.includes("provisional reference") || note.includes("before final publication")) {
        throw new Error(`${label}: ${record.id} must expose an accurate published editorial-review notice`);
      }
    }
  }

  for (const record of archiveItems) {
    if (!places.has(record.place_id)) {
      throw new Error(`historical archive items: ${record.id} references missing place ${record.place_id}`);
    }
    if (!places.has(record.coordinates.source_place_id)) {
      throw new Error(
        `historical archive items: ${record.id} references missing coordinate source place ${record.coordinates.source_place_id}`
      );
    }
    if (!record.source?.url || !record.source?.accessed_at || !record.source?.license?.url) {
      throw new Error(`historical archive items: ${record.id} has incomplete source provenance`);
    }
    assertOpenMedia("historical archive items", record, record.media, "media");
    if (record.kind === "map") {
      if (!record.overlay_bounds) {
        throw new Error(`historical archive items: ${record.id} map item is missing overlay_bounds`);
      }
      if (!(record.overlay_bounds.south < record.overlay_bounds.north)) {
        throw new Error(`historical archive items: ${record.id} overlay_bounds south must be below north`);
      }
      if (!(record.overlay_bounds.west < record.overlay_bounds.east)) {
        throw new Error(`historical archive items: ${record.id} overlay_bounds west must be below east`);
      }
      if (!["map_extent_approximated_to_city", "manual_control_points"].includes(record.georeference.method)) {
        throw new Error(`historical archive items: ${record.id} map overlay must use a map georeference method`);
      }
    } else if (record.overlay_bounds) {
      throw new Error(`historical archive items: ${record.id} non-map item cannot define overlay_bounds`);
    }
  }

  for (const pair of thenNowPairs) {
    if (!archiveIds.has(pair.historical_archive_item_id)) {
      throw new Error(
        `then-now pairs: ${pair.id} references missing archive item ${pair.historical_archive_item_id}`
      );
    }
    if (!places.has(pair.place_id)) {
      throw new Error(`then-now pairs: ${pair.id} references missing place ${pair.place_id}`);
    }
    const archiveItem = archiveItems.find((item) => item.id === pair.historical_archive_item_id);
    if (archiveItem?.place_id !== pair.place_id) {
      throw new Error(
        `then-now pairs: ${pair.id} place ${pair.place_id} does not match archive item ${archiveItem?.place_id}`
      );
    }
    if (mediaUrlKey(pair.then_media?.url) === mediaUrlKey(pair.now_media?.url)) {
      throw new Error(`then-now pairs: ${pair.id} uses the same file for then_media and now_media`);
    }
    for (const [field, media] of [
      ["then_media", pair.then_media],
      ["now_media", pair.now_media]
    ]) {
      assertOpenMedia("then-now pairs", pair, media, field);
      if (!media.source_id || !sourceIds.has(media.source_id)) {
        throw new Error(`then-now pairs: ${pair.id} ${field} references missing generated source_id`);
      }
    }
    const expectedSourceIds = new Set([pair.then_media.source_id, pair.now_media.source_id]);
    for (const sourceId of pair.source_ids) {
      if (!sourceIds.has(sourceId)) {
        throw new Error(`then-now pairs: ${pair.id} references missing source ${sourceId}`);
      }
      if (!expectedSourceIds.has(sourceId)) {
        throw new Error(`then-now pairs: ${pair.id} source_ids include ${sourceId} not used by media`);
      }
    }
    if (expectedSourceIds.size !== pair.source_ids.length) {
      throw new Error(`then-now pairs: ${pair.id} source_ids do not match media source IDs`);
    }
    const provenanceSourceIds = new Set(pair.provenance.map((entry) => entry.source_id));
    for (const sourceId of expectedSourceIds) {
      if (!provenanceSourceIds.has(sourceId)) {
        throw new Error(`then-now pairs: ${pair.id} provenance is missing source ${sourceId}`);
      }
    }
    for (const entry of pair.provenance) {
      if (!entry.url || !entry.accessed_at || !entry.license_status) {
        throw new Error(`then-now pairs: ${pair.id} has incomplete generated provenance`);
      }
    }
  }
}

function assertEducationResources(loaded) {
  const events = new Set(loaded.get("knowledge events").map((record) => record.id));
  const places = new Set(loaded.get("knowledge places").map((record) => record.id));
  const sources = new Set(loaded.get("knowledge sources").map((record) => record.id));
  const archiveItems = new Set(loaded.get("historical archive items").map((record) => record.id));
  const thenNowPairs = new Set(loaded.get("then-now pairs").map((record) => record.id));

  for (const resource of loaded.get("knowledge education resources")) {
    assertGeneratedProvenance("education resources", resource);
    for (const sourceId of resource.source_ids) {
      if (!sources.has(sourceId)) {
        throw new Error(`education resources: ${resource.id} references missing source ${sourceId}`);
      }
    }
    for (const eventId of resource.linked_event_ids) {
      if (!events.has(eventId)) {
        throw new Error(`education resources: ${resource.id} references missing event ${eventId}`);
      }
    }
    for (const placeId of resource.linked_place_ids) {
      if (!places.has(placeId)) {
        throw new Error(`education resources: ${resource.id} references missing place ${placeId}`);
      }
    }
    for (const placeId of resource.audio_tour.stops.map((stop) => stop.place_id)) {
      if (!places.has(placeId)) {
        throw new Error(`education resources: ${resource.id} audio stop references missing place ${placeId}`);
      }
    }
    for (const archiveItemId of resource.linked_archive_item_ids) {
      if (!archiveItems.has(archiveItemId)) {
        throw new Error(`education resources: ${resource.id} references missing archive item ${archiveItemId}`);
      }
    }
    for (const pairId of resource.linked_then_now_pair_ids) {
      if (!thenNowPairs.has(pairId)) {
        throw new Error(`education resources: ${resource.id} references missing then-now pair ${pairId}`);
      }
    }
  }
}

function assertStoryLongreads(loaded) {
  const events = new Set(loaded.get("knowledge events").map((record) => record.id));
  const places = loaded.get("knowledge places");
  const placesById = new Map(places.map((record) => [record.id, record]));
  const placeIds = new Set(placesById.keys());
  const sources = new Set(loaded.get("knowledge sources").map((record) => record.id));
  const archiveItems = new Set(loaded.get("historical archive items").map((record) => record.id));
  const thenNowPairs = new Set(loaded.get("then-now pairs").map((record) => record.id));

  const assertKnown = (story, field, id, set) => {
    if (!set.has(id)) {
      throw new Error(`story longreads: ${story.id} references missing ${field} ${id}`);
    }
  };

  const stories = loaded.get("knowledge story longreads");
  const processLanguage = [
    /\bOpen Plovdiv\b/i,
    /\bthis story\b/i,
    /\bthe platform\b/i,
    /\bthe record (?:shows|on|for)\b/i,
    /\bmetadata\b/i,
    /\bdata provenance\b/i,
    /\bcurrent base\b/i,
    /\bmanually checked\b/i,
    /\bsource-backed\b/i,
    /\bverifiable sources?\b/i,
    /\bcoordinates?\b/i,
    /този разказ/i,
    /платформата/i,
    /записът (?:показва|за)/i,
    /метаданн/i,
    /произхода на данните/i,
    /текущата база/i,
    /координат/i
  ];
  const editorialCaptionLanguage = [
    /\bused as (?:a|the) visual/i,
    /\bvisual (?:entry|evidence)\b/i,
    /\bintroduces? (?:the|this)\b/i,
    /използван[ао]? като визуал/i,
    /визуал(?:ен|но) (?:вход|доказателство)/i,
    /въвежда (?:в|разказа)/i
  ];

  let totalEnglishWords = 0;
  for (const story of stories) {
    assertGeneratedProvenance("story longreads", story);
    for (const sourceId of story.source_ids) assertKnown(story, "source", sourceId, sources);
    for (const eventId of story.linked_event_ids) assertKnown(story, "event", eventId, events);
    for (const placeId of story.linked_place_ids) assertKnown(story, "place", placeId, placeIds);
    for (const archiveItemId of story.linked_archive_item_ids) {
      assertKnown(story, "archive item", archiveItemId, archiveItems);
    }
    for (const pairId of story.linked_then_now_pair_ids) {
      assertKnown(story, "then-now pair", pairId, thenNowPairs);
    }

    if (
      story.hero.kind === "archive_item" &&
      !archiveItems.has(story.hero.ref_id)
    ) {
      throw new Error(`story longreads: ${story.id} hero references missing archive item ${story.hero.ref_id}`);
    }
    if (
      story.hero.kind === "then_now_pair" &&
      !thenNowPairs.has(story.hero.ref_id)
    ) {
      throw new Error(`story longreads: ${story.id} hero references missing then-now pair ${story.hero.ref_id}`);
    }
    if (story.hero.kind === "place_media") {
      const place = placesById.get(story.hero.ref_id);
      if (!place) {
        throw new Error(`story longreads: ${story.id} hero references missing place ${story.hero.ref_id}`);
      }
      if (!place.media?.length) {
        throw new Error(`story longreads: ${story.id} hero place ${story.hero.ref_id} has no media`);
      }
    }

    for (const [index, section] of story.sections.entries()) {
      for (const sourceId of section.source_ids) assertKnown(story, `section ${index + 1} source`, sourceId, sources);
      for (const eventId of section.linked_event_ids) assertKnown(story, `section ${index + 1} event`, eventId, events);
      for (const placeId of section.linked_place_ids) assertKnown(story, `section ${index + 1} place`, placeId, placeIds);

      for (const sourceId of section.source_ids) {
        if (!story.source_ids.includes(sourceId)) {
          throw new Error(`story longreads: ${story.id} section ${index + 1} source ${sourceId} is missing from story source_ids`);
        }
      }
      for (const eventId of section.linked_event_ids) {
        if (!story.linked_event_ids.includes(eventId)) {
          throw new Error(`story longreads: ${story.id} section ${index + 1} event ${eventId} is missing from story linked_event_ids`);
        }
      }
      for (const placeId of section.linked_place_ids) {
        if (!story.linked_place_ids.includes(placeId)) {
          throw new Error(`story longreads: ${story.id} section ${index + 1} place ${placeId} is missing from story linked_place_ids`);
        }
      }

      if (!section.body_en.includes("\n\n") || !section.body_bg.includes("\n\n")) {
        throw new Error(`story longreads: ${story.id} section ${index + 1} must contain at least two real paragraphs in BG and EN`);
      }
    }

    if (story.sections.length < 5) {
      throw new Error(`story longreads: ${story.id} needs at least 5 narrative chapters, got ${story.sections.length}`);
    }

    const narrativeEn = [
      story.title_en,
      story.dek_en,
      ...story.sections.flatMap((section) => [section.heading_en, section.body_en])
    ].join(" ");
    const narrativeBg = [
      story.title_bg,
      story.dek_bg,
      ...story.sections.flatMap((section) => [section.heading_bg, section.body_bg])
    ].join(" ");
    const englishWords = narrativeEn.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
    totalEnglishWords += englishWords;
    if (englishWords < 600) {
      throw new Error(`story longreads: ${story.id} is still a thin outline (${englishWords} English words; minimum 600)`);
    }
    const bilingualLengthRatio = narrativeBg.length / narrativeEn.length;
    if (bilingualLengthRatio < 0.72 || bilingualLengthRatio > 1.45) {
      throw new Error(
        `story longreads: ${story.id} BG/EN narrative length ratio ${bilingualLengthRatio.toFixed(2)} suggests an incomplete locale`
      );
    }

    const expectedMinutes = Math.max(4, Math.ceil(englishWords / 200));
    if (story.reading_minutes !== expectedMinutes) {
      throw new Error(
        `story longreads: ${story.id} reading_minutes must be ${expectedMinutes} for ${englishWords} English words, got ${story.reading_minutes}`
      );
    }

    for (const pattern of processLanguage) {
      if (pattern.test(narrativeEn) || pattern.test(narrativeBg)) {
        throw new Error(`story longreads: ${story.id} still contains editorial/process language (${pattern})`);
      }
    }
    const displayedCaptions = [story.hero, ...story.sections.map((section) => section.media).filter(Boolean)];
    for (const caption of displayedCaptions) {
      for (const pattern of editorialCaptionLanguage) {
        if (pattern.test(caption.caption_en) || pattern.test(caption.caption_bg)) {
          throw new Error(`story longreads: ${story.id} caption describes editorial purpose instead of the image (${pattern})`);
        }
      }
    }
  }

  const translatedCount = assertTranslatedStrings("story longreads", stories);
  for (const story of stories) {
    story.sections.forEach((section, index) => {
      for (const [lang, map] of translationsByLangMap()) {
        const translatedBody = map[section.body_en.trim()];
        if (!translatedBody?.includes("\n\n")) {
          throw new Error(
            `story longreads: ${story.id} section ${index + 1} ${lang} translation lost its paragraph break`
          );
        }
      }
    });
  }
  console.log(
    `story longread checks passed: ${stories.length} stories, ${totalEnglishWords} English words, ${translatedCount} translated strings`
  );
}

function assertEditorialReviewReport(loaded) {
  const report = readJson("data/generated/history-knowledge/editorial-review.json");
  const trackedCollections = [
    ["events", "knowledge events"],
    ["people", "knowledge people"],
    ["person_relationships", "knowledge person relationships"],
    ["places", "knowledge places"],
    ["organizations", "knowledge organizations"],
    ["archive_items", "knowledge archive items"],
    ["then_now_pairs", "knowledge then-now pairs"],
    ["primary_documents", "knowledge primary documents"],
    ["story_longreads", "knowledge story longreads"],
    ["education_resources", "knowledge education resources"]
  ];
  const signoffs = loaded.get("editorial signoffs");

  if (!Array.isArray(report.records)) {
    throw new Error("editorial review: expected records array");
  }
  if (!report.summary || !report.collections || !Array.isArray(report.tracking_gaps)) {
    throw new Error("editorial review: expected summary, collections and tracking_gaps");
  }

  const expectedTotal = trackedCollections.reduce((sum, [, loadedLabel]) => sum + loaded.get(loadedLabel).length, 0);
  const signedOff = report.records.filter((record) => record.editorial_status === "signed_off").length;
  const needsReview = report.records.filter((record) => record.editorial_status !== "signed_off").length;
  const recordsWithBlockers = report.records.filter((record) => record.blockers?.length > 0).length;

  if (report.summary.total_tracked_records !== expectedTotal) {
    throw new Error(
      `editorial review: expected ${expectedTotal} tracked records, got ${report.summary.total_tracked_records}`
    );
  }
  if (report.summary.signed_off_records !== signedOff) {
    throw new Error("editorial review: signed_off_records summary does not match records");
  }
  if (report.summary.records_needing_review !== needsReview) {
    throw new Error("editorial review: records_needing_review summary does not match records");
  }
  if (report.summary.records_with_blockers !== recordsWithBlockers) {
    throw new Error("editorial review: records_with_blockers summary does not match records");
  }

  const reportByKey = new Map(report.records.map((record) => [`${record.collection}:${record.id}`, record]));
  const validRecordKeys = new Set(report.records.map((record) => `${record.collection}:${record.id}`));
  const signoffsByRecordKey = new Map();
  const signoffsById = new Map();
  for (const signoff of signoffs) {
    const key = `${signoff.collection}:${signoff.record_id}`;
    if (!validRecordKeys.has(key)) {
      throw new Error(`editorial signoffs: ${signoff.id} references missing report record ${key}`);
    }
    if (signoffsByRecordKey.has(key)) {
      throw new Error(`editorial signoffs: duplicate sign-off for ${key}`);
    }
    signoffsByRecordKey.set(key, signoff);
    signoffsById.set(signoff.id, signoff);
  }

  for (const [collectionId, loadedLabel] of trackedCollections) {
    const records = loaded.get(loadedLabel);
    const collectionSummary = report.collections[collectionId];
    if (!collectionSummary) {
      throw new Error(`editorial review: missing collection summary for ${collectionId}`);
    }
    if (collectionSummary.total_records !== records.length) {
      throw new Error(
        `editorial review: collection ${collectionId} expected ${records.length} records, got ${collectionSummary.total_records}`
      );
    }
    for (const record of records) {
      const reportRecord = reportByKey.get(`${collectionId}:${record.id}`);
      if (!reportRecord) {
        throw new Error(`editorial review: missing report record for ${collectionId}:${record.id}`);
      }
      if (reportRecord.editorial_status !== record.editorial?.status) {
        throw new Error(`editorial review: ${record.id} status does not match source record`);
      }
      if (!reportRecord.review_url_bg || !reportRecord.review_url_en || !reportRecord.api_url) {
        throw new Error(`editorial review: ${record.id} is missing reviewer target URLs`);
      }
      if (!String(reportRecord.review_url_bg).startsWith("/") || !String(reportRecord.review_url_en).startsWith("/en/")) {
        throw new Error(`editorial review: ${record.id} reviewer target URLs must include BG and EN public paths`);
      }
      if (!String(reportRecord.api_url).startsWith("/api/history/")) {
        throw new Error(`editorial review: ${record.id} api_url must point to a history API endpoint`);
      }
      if (!Array.isArray(reportRecord.review_sources)) {
        throw new Error(`editorial review: ${record.id} is missing review_sources`);
      }
      if (reportRecord.source_count !== reportRecord.review_sources.length) {
        throw new Error(`editorial review: ${record.id} source_count does not match review_sources`);
      }
      if (reportRecord.review_sources.length === 0) {
        throw new Error(`editorial review: ${record.id} has no reviewer source packet`);
      }
      for (const [sourceIndex, source] of reportRecord.review_sources.entries()) {
        if (!source.url || !source.accessed_at) {
          throw new Error(`editorial review: ${record.id} source packet ${sourceIndex + 1} lacks URL/access date`);
        }
        if (!source.license_status && !source.license_label && !source.license_url) {
          throw new Error(`editorial review: ${record.id} source packet ${sourceIndex + 1} lacks license/reuse status`);
        }
      }
      const expectedSourceUrls = new Set(reportRecord.review_sources.map((source) => source.url).filter(Boolean));
      const reportedSourceUrls = new Set(reportRecord.source_urls ?? []);
      if (expectedSourceUrls.size !== reportedSourceUrls.size || [...expectedSourceUrls].some((url) => !reportedSourceUrls.has(url))) {
        throw new Error(`editorial review: ${record.id} source_urls do not match review_sources`);
      }
      const expectedSourceIds = new Set(reportRecord.review_sources.map((source) => source.source_id).filter(Boolean));
      const reportedSourceIds = new Set(reportRecord.source_ids ?? []);
      if (expectedSourceIds.size !== reportedSourceIds.size || [...expectedSourceIds].some((id) => !reportedSourceIds.has(id))) {
        throw new Error(`editorial review: ${record.id} source_ids do not match review_sources`);
      }
      const signoff = signoffsByRecordKey.get(`${collectionId}:${record.id}`);
      if (record.editorial?.status === "signed_off") {
        if (!signoff) {
          throw new Error(`editorial review: ${record.id} is signed off without an external sign-off ledger row`);
        }
        if (reportRecord.signoff_id !== signoff.id) {
          throw new Error(`editorial review: ${record.id} signoff_id does not match ledger`);
        }
        if (reportRecord.review_artifact_url !== signoff.review_artifact_url) {
          throw new Error(`editorial review: ${record.id} review_artifact_url does not match ledger`);
        }
        if (!record.editorial.reviewed_by || !record.editorial.reviewed_at) {
          throw new Error(`editorial review: ${record.id} is signed off without reviewer/date`);
        }
        if (record.editorial.reviewed_by !== signoff.reviewed_by || record.editorial.reviewed_at !== signoff.reviewed_at) {
          throw new Error(`editorial review: ${record.id} reviewer/date does not match sign-off ledger`);
        }
        if (reportRecord.blockers?.includes("missing_independent_editorial_signoff_log")) {
          throw new Error(`editorial review: ${record.id} reports missing sign-off reviewer/date`);
        }
        if (reportRecord.blockers?.includes("missing_external_editorial_signoff_record")) {
          throw new Error(`editorial review: ${record.id} reports missing external sign-off ledger row`);
        }
      }
      if (reportRecord.blockers?.includes("missing_source_reference")) {
        throw new Error(`editorial review: ${record.id} reports missing source reference`);
      }
      if (reportRecord.blockers?.includes("missing_license_or_reuse_status")) {
        throw new Error(`editorial review: ${record.id} reports missing license/reuse status`);
      }
    }
  }

  for (const [signoffId, signoff] of signoffsById) {
    const reportRecord = reportByKey.get(`${signoff.collection}:${signoff.record_id}`);
    if (!reportRecord || reportRecord.editorial_status !== "signed_off") {
      throw new Error(`editorial signoffs: ${signoffId} did not produce a signed-off report record`);
    }
  }

  if (report.tracking_gaps.length > 0) {
    const collections = report.tracking_gaps.map((gap) => gap.collection).join(", ");
    throw new Error(`editorial review: untracked editorial collections remain: ${collections}`);
  }
  if (report.status === "complete" && (needsReview > 0 || recordsWithBlockers > 0)) {
    throw new Error("editorial review: complete status requires all records signed off and no blockers");
  }
}

function sameStringArray(left = [], right = []) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((value, index) => value === right[index]);
}

function sourceCoverageSummaryFor(records) {
  const recordsWithSources = records.filter((record) => record.source_count > 0).length;
  const recordsWithLicense = records.filter((record) => record.has_license_or_reuse_status).length;
  const singleSourceRecords = records.filter((record) => record.source_count === 1).length;
  const multiSourceRecords = records.filter((record) => record.source_count >= 2).length;
  const openLicenseRecords = records.filter((record) => record.license_statuses?.includes("open_license")).length;
  const publicReferenceTermsRecords = records.filter((record) =>
    record.license_statuses?.includes("public_reference_terms_unverified")
  ).length;

  return {
    total_records: records.length,
    records_with_sources: recordsWithSources,
    records_without_sources: records.length - recordsWithSources,
    records_with_license_or_reuse_status: recordsWithLicense,
    records_missing_license_or_reuse_status: records.length - recordsWithLicense,
    single_source_records: singleSourceRecords,
    multi_source_records: multiSourceRecords,
    needs_multi_source_review_records: singleSourceRecords,
    open_license_records: openLicenseRecords,
    public_reference_terms_records: publicReferenceTermsRecords
  };
}

function assertSourceCoverageSummary(label, summary, records) {
  const expected = sourceCoverageSummaryFor(records);
  for (const [key, expectedValue] of Object.entries(expected)) {
    if (summary?.[key] !== expectedValue) {
      throw new Error(`source coverage: ${label}.${key} expected ${expectedValue}, got ${summary?.[key]}`);
    }
  }
}

function assertSourceCoverageReport() {
  const coverage = readJson("data/generated/history-knowledge/source-coverage.json");
  const review = readJson("data/generated/history-knowledge/editorial-review.json");

  if (!Array.isArray(coverage.records)) {
    throw new Error("source coverage: expected records array");
  }
  if (!coverage.summary || !coverage.collections || !coverage.license_statuses) {
    throw new Error("source coverage: expected summary, collections and license_statuses");
  }
  if (!Array.isArray(review.records)) {
    throw new Error("source coverage: editorial review records are unavailable");
  }

  assertSourceCoverageSummary("summary", coverage.summary, coverage.records);

  if (coverage.summary.total_records !== review.records.length) {
    throw new Error(
      `source coverage: expected ${review.records.length} tracked records, got ${coverage.summary.total_records}`
    );
  }
  if (
    coverage.source_traceability_status === "complete" &&
    (coverage.summary.records_without_sources > 0 || coverage.summary.records_missing_license_or_reuse_status > 0)
  ) {
    throw new Error("source coverage: complete traceability status cannot include missing source or license rows");
  }
  if (
    coverage.multi_source_review_status === "complete" &&
    coverage.summary.needs_multi_source_review_records > 0
  ) {
    throw new Error("source coverage: complete multi-source status cannot include single-source review rows");
  }

  const reviewByKey = new Map(review.records.map((record) => [`${record.collection}:${record.id}`, record]));
  const coverageByKey = new Map(coverage.records.map((record) => [`${record.collection}:${record.id}`, record]));

  for (const reviewRecord of review.records) {
    const key = `${reviewRecord.collection}:${reviewRecord.id}`;
    const coverageRecord = coverageByKey.get(key);
    if (!coverageRecord) {
      throw new Error(`source coverage: missing coverage row for ${key}`);
    }
    for (const field of ["role", "title_bg", "title_en", "review_url_bg", "review_url_en", "api_url", "editorial_status"]) {
      if (coverageRecord[field] !== reviewRecord[field]) {
        throw new Error(`source coverage: ${key} ${field} does not match editorial review`);
      }
    }
    if (coverageRecord.source_count !== reviewRecord.source_count) {
      throw new Error(`source coverage: ${key} source_count does not match editorial review`);
    }
    if (!sameStringArray(coverageRecord.source_ids, reviewRecord.source_ids)) {
      throw new Error(`source coverage: ${key} source_ids do not match editorial review`);
    }
    if (!sameStringArray(coverageRecord.source_urls, reviewRecord.source_urls)) {
      throw new Error(`source coverage: ${key} source_urls do not match editorial review`);
    }
    if (!sameStringArray(coverageRecord.license_statuses, reviewRecord.license_statuses)) {
      throw new Error(`source coverage: ${key} license_statuses do not match editorial review`);
    }
    if (coverageRecord.has_license_or_reuse_status !== reviewRecord.has_license_or_reuse_status) {
      throw new Error(`source coverage: ${key} license/reuse flag does not match editorial review`);
    }
    if (coverageRecord.has_open_license !== reviewRecord.license_statuses.includes("open_license")) {
      throw new Error(`source coverage: ${key} open-license flag does not match license statuses`);
    }
    if (
      coverageRecord.has_public_reference_terms !==
      reviewRecord.license_statuses.includes("public_reference_terms_unverified")
    ) {
      throw new Error(`source coverage: ${key} public-reference flag does not match license statuses`);
    }
    if (coverageRecord.needs_multi_source_review !== (reviewRecord.source_count < 2)) {
      throw new Error(`source coverage: ${key} multi-source review flag does not match source_count`);
    }
    if (!sameStringArray(coverageRecord.blockers, reviewRecord.blockers)) {
      throw new Error(`source coverage: ${key} blockers do not match editorial review`);
    }
  }

  for (const coverageRecord of coverage.records) {
    const key = `${coverageRecord.collection}:${coverageRecord.id}`;
    if (!reviewByKey.has(key)) {
      throw new Error(`source coverage: coverage row has no editorial review source ${key}`);
    }
  }

  for (const [collectionId, summary] of Object.entries(coverage.collections)) {
    const records = coverage.records.filter((record) => record.collection === collectionId);
    assertSourceCoverageSummary(`collections.${collectionId}`, summary, records);
  }

  const expectedLicenseCounts = coverage.records.reduce((counts, record) => {
    for (const status of record.license_statuses) {
      counts[status] = (counts[status] ?? 0) + 1;
    }
    return counts;
  }, {});
  for (const [status, expectedCount] of Object.entries(expectedLicenseCounts)) {
    if (coverage.license_statuses[status] !== expectedCount) {
      throw new Error(`source coverage: license_statuses.${status} expected ${expectedCount}, got ${coverage.license_statuses[status]}`);
    }
  }
  for (const status of Object.keys(coverage.license_statuses)) {
    if (!(status in expectedLicenseCounts)) {
      throw new Error(`source coverage: unexpected license status count ${status}`);
    }
  }
}

const addedSchemaPaths = new Set();
for (const dataset of datasets) {
  if (addedSchemaPaths.has(dataset.schemaPath)) continue;
  ajv.addSchema(readJson(dataset.schemaPath));
  addedSchemaPaths.add(dataset.schemaPath);
}

const loaded = new Map();

for (const dataset of datasets) {
  const schema = readJson(dataset.schemaPath);
  const validate = ajv.getSchema(schema.$id) ?? ajv.compile(schema);
  const data = readJson(dataset.dataPath);

  if (dataset.topLevel === "object") {
    if (Array.isArray(data) || !data || typeof data !== "object") {
      throw new Error(`${dataset.label}: expected top-level object`);
    }
    if (!validate(data)) {
      throw new Error(`${dataset.label}: ${formatErrors(validate.errors)}`);
    }
    loaded.set(dataset.label, data);
    console.log(`valid ${dataset.label}: object`);
    continue;
  }

  if (!Array.isArray(data)) {
    throw new Error(`${dataset.label}: expected top-level array`);
  }
  if (data.length < dataset.minRecords) {
    throw new Error(
      `${dataset.label}: expected at least ${dataset.minRecords} records, got ${data.length}`
    );
  }

  data.forEach((record, index) => {
    if (!validate(record)) {
      throw new Error(
        `${dataset.label}[${index}] ${record.id || "(missing id)"}: ${formatErrors(validate.errors)}`
      );
    }
  });

  assertUniqueIds(data, dataset.label);
  loaded.set(dataset.label, data);
  console.log(`valid ${dataset.label}: ${data.length}`);
}

/**
 * Walking routes must stay a pure remix layer: every stop/detour resolves to
 * a published place WITH coordinates, linked stories/education records exist,
 * the committed OSRM geometry is present and plausibly matches the stops, the
 * suggested duration agrees with walking time + dwell, and every English
 * string is covered by all ten translation maps so no locale silently falls
 * back to English.
 */
const translationLangs = ["de", "fr", "it", "tr", "es", "el", "ja", "tl", "uk", "ru"];
const nonLatinTranslationLangs = new Set(["el", "ja", "uk", "ru"]);
let cachedTranslationsByLang = null;

function translationsByLangMap() {
  if (!cachedTranslationsByLang) {
    cachedTranslationsByLang = new Map(
      translationLangs.map((lang) => [lang, readJson(`data/translations/${lang}.json`)])
    );
  }
  return cachedTranslationsByLang;
}

function collectEnglishStrings(value, key, out) {
  if (Array.isArray(value)) {
    for (const item of value) collectEnglishStrings(item, key, out);
    return out;
  }
  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) {
      collectEnglishStrings(childValue, childKey, out);
    }
    return out;
  }
  if (typeof value === "string" && key.endsWith("_en") && value.trim()) {
    // Mirror the translation generator's collector: numeric-only strings
    // (years like "1847") are never translated, so never required.
    if (!/^[-+]?\d+(?:[.,]\d+)?$/.test(value.trim())) out.add(value.trim());
  }
  return out;
}

/** A run of >=6 consecutive ASCII-alphabetic words reads as untranslated English. */
function longestLatinWordRun(text) {
  let run = 0;
  let longest = 0;
  for (const token of String(text).split(/\s+/)) {
    if (/^[A-Za-z][A-Za-z'’.,;:()\-]*$/.test(token)) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }
  return longest;
}

/**
 * Every `_en` string of the records must exist in all ten translation maps —
 * and the values must be real translations: not the English source echoed
 * back (identity), and, for non-Latin-script locales, not carrying long runs
 * of untranslated English words.
 */
function assertTranslatedStrings(label, records) {
  const englishStrings = collectEnglishStrings(records, "", new Set());
  for (const [lang, map] of translationsByLangMap()) {
    const missing = [];
    const leaked = [];
    for (const text of englishStrings) {
      const value = map[text];
      if (!value) {
        missing.push(text);
        continue;
      }
      const identity = text.length >= 40 && String(value).trim() === text;
      const englishRun = nonLatinTranslationLangs.has(lang) && longestLatinWordRun(value) >= 6;
      if (identity || englishRun) leaked.push(text);
    }
    if (missing.length > 0) {
      throw new Error(
        `${label}: ${missing.length} strings missing ${lang} translations (run scripts/translate/generate_de_translations.mjs ${lang}); first: ${JSON.stringify(
          missing[0]
        )}`
      );
    }
    if (leaked.length > 0) {
      throw new Error(
        `${label}: ${leaked.length} ${lang} translations look untranslated (identity/English fragments); first: ${JSON.stringify(
          leaked[0]
        )}`
      );
    }
  }
  return englishStrings.size;
}

function assertLandmarkEnglishSummaryIntegrity(landmarks) {
  const cyrillic = /[\u0400-\u04ff]/u;
  for (const landmark of landmarks) {
    const summary = String(landmark.summary_en ?? "").trim();
    if (!summary) throw new Error(`landmarks: ${landmark.id} is missing summary_en`);
    if (cyrillic.test(summary)) {
      throw new Error(`landmarks: ${landmark.id} summary_en must be English, not Cyrillic source text`);
    }
    for (const [lang, map] of translationsByLangMap()) {
      if (!map[summary]) {
        throw new Error(`landmarks: ${landmark.id} summary_en is missing a ${lang} translation`);
      }
    }
  }
}

function assertWalkingRoutes(loaded) {
  const routes = loaded.get("walking routes");
  const placesById = new Map(loaded.get("knowledge places").map((record) => [record.id, record]));
  const storyIds = new Set(loaded.get("knowledge story longreads").map((record) => record.id));
  const educationIds = new Set(loaded.get("knowledge education resources").map((record) => record.id));

  const bandRange = {
    short: [20, 75],
    "half-day": [76, 240],
    "full-day": [241, 600]
  };

  for (const route of routes) {
    const label = `walking routes: ${route.id}`;

    const requirePlace = (placeId, role) => {
      const place = placesById.get(placeId);
      if (!place) throw new Error(`${label} references missing ${role} place ${placeId}`);
      if (!place.coordinates) {
        throw new Error(`${label} ${role} place ${placeId} has no published coordinates`);
      }
      return place;
    };

    for (const stop of route.stops) requirePlace(stop.place_id, "stop");
    for (const detour of route.detours ?? []) requirePlace(detour.place_id, "detour");
    const stopIds = route.stops.map((stop) => stop.place_id);
    if (new Set(stopIds).size !== stopIds.length) {
      throw new Error(`${label} repeats a place as more than one stop`);
    }

    if (route.story_id && !storyIds.has(route.story_id)) {
      throw new Error(`${label} references missing story ${route.story_id}`);
    }
    if (route.education_id && !educationIds.has(route.education_id)) {
      throw new Error(`${label} references missing education resource ${route.education_id}`);
    }

    const geometryPath = `data/curated/route-geometry/${route.id}.json`;
    if (!fs.existsSync(path.join(root, geometryPath))) {
      throw new Error(`${label} has no committed walking geometry (${geometryPath}); run scripts/ingest/fetch_route_geometry.mjs`);
    }
    const geometry = readJson(geometryPath);
    if (geometry.route_id !== route.id) {
      throw new Error(`${label} geometry file carries route_id ${geometry.route_id}`);
    }
    if (!Array.isArray(geometry.geometry?.coordinates) || geometry.geometry.coordinates.length < 2) {
      throw new Error(`${label} geometry has no usable line`);
    }
    if (geometry.legs.length !== route.stops.length - 1) {
      throw new Error(
        `${label} geometry has ${geometry.legs.length} legs for ${route.stops.length} stops; refetch geometry`
      );
    }
    for (const snap of geometry.stops) {
      if (snap.snap_distance_m > 150) {
        throw new Error(
          `${label} stop ${snap.place_id} snaps ${snap.snap_distance_m} m from the walking network — check its coordinates`
        );
      }
    }

    const walkMinutes = geometry.walk_duration_s / 60;
    const dwellMinutes = route.stops.reduce((sum, stop) => sum + stop.minutes, 0);
    const expected = walkMinutes + dwellMinutes;
    const ratio = route.duration_minutes / expected;
    if (ratio < 0.8 || ratio > 1.3) {
      throw new Error(
        `${label} duration ${route.duration_minutes} min is out of step with walking ${Math.round(
          walkMinutes
        )} min + stops ${dwellMinutes} min`
      );
    }
    const [bandMin, bandMax] = bandRange[route.duration_band];
    if (route.duration_minutes < bandMin || route.duration_minutes > bandMax) {
      throw new Error(
        `${label} duration ${route.duration_minutes} min does not fit band ${route.duration_band}`
      );
    }
  }

  const translatedCount = assertTranslatedStrings("walking routes", routes);

  console.log(`walking routes checks passed: ${routes.length} routes, ${translatedCount} translated strings`);
}

/**
 * Neighbourhood histories are a connective layer over the knowledge base:
 * every linked place/story/route id must resolve, timelines must be ordered,
 * each record needs at least two independent sources, and every English
 * string must be genuinely translated in all ten locales.
 */
function assertNeighbourhoodHistories(loaded) {
  const neighbourhoods = loaded.get("neighbourhood histories");
  const placeIds = new Set(loaded.get("knowledge places").map((record) => record.id));
  const storyIds = new Set(loaded.get("knowledge story longreads").map((record) => record.id));
  const routeIds = new Set(loaded.get("walking routes").map((record) => record.id));
  const projectDistricts = new Set(loaded.get("projects").map((record) => record.district).filter(Boolean));

  const ids = new Set();
  for (const neighbourhood of neighbourhoods) {
    const label = `neighbourhood histories: ${neighbourhood.id}`;
    if (ids.has(neighbourhood.id)) throw new Error(`${label} duplicates a slug`);
    ids.add(neighbourhood.id);

    for (const placeId of neighbourhood.place_ids) {
      if (!placeIds.has(placeId)) throw new Error(`${label} references missing place ${placeId}`);
    }
    if (neighbourhood.anchor_place_id && !placeIds.has(neighbourhood.anchor_place_id)) {
      throw new Error(`${label} references missing anchor place ${neighbourhood.anchor_place_id}`);
    }
    for (const storyId of neighbourhood.story_ids) {
      if (!storyIds.has(storyId)) throw new Error(`${label} references missing story ${storyId}`);
    }
    for (const routeId of neighbourhood.route_ids) {
      if (!routeIds.has(routeId)) throw new Error(`${label} references missing route ${routeId}`);
    }
    if (!projectDistricts.has(neighbourhood.district_bg)) {
      throw new Error(
        `${label} district ${neighbourhood.district_bg} matches no project district — civic links would be dead`
      );
    }

    const years = neighbourhood.timeline.map((entry) => entry.year);
    for (let i = 1; i < years.length; i += 1) {
      if (years[i] < years[i - 1]) {
        throw new Error(`${label} timeline is not in chronological order (${years[i - 1]} → ${years[i]})`);
      }
    }

    if (neighbourhood.sources.length < 2) {
      throw new Error(`${label} needs at least two sources (has ${neighbourhood.sources.length})`);
    }

    if (!Array.isArray(neighbourhood.fabric) || neighbourhood.fabric.length < 1) {
      throw new Error(`${label} needs at least one fabric entry (people/community/industry/institution/faith)`);
    }
    for (const entry of neighbourhood.fabric) {
      if (entry.place_id && !placeIds.has(entry.place_id)) {
        throw new Error(`${label} fabric entry "${entry.name_en}" references missing place ${entry.place_id}`);
      }
    }
    const sourceUrls = new Set(neighbourhood.sources.map((source) => source.url));
    if (sourceUrls.size !== neighbourhood.sources.length) {
      throw new Error(`${label} repeats a source URL`);
    }
  }

  const translatedCount = assertTranslatedStrings("neighbourhood histories", neighbourhoods);

  // Tourist-completeness report (non-fatal): a quarter without mapped places
  // or without any route is legitimate (honest context treatment), but each
  // one should be a conscious choice — keep them visible at validation time.
  const routesByPlace = new Map();
  for (const route of loaded.get("walking routes")) {
    for (const stop of route.stops) {
      const list = routesByPlace.get(stop.place_id) ?? [];
      list.push(route.id);
      routesByPlace.set(stop.place_id, list);
    }
  }
  const zeroPlaces = [];
  const zeroRoutes = [];
  for (const neighbourhood of neighbourhoods) {
    if (neighbourhood.place_ids.length === 0) zeroPlaces.push(neighbourhood.id);
    const derivedRoutes = new Set(neighbourhood.route_ids);
    for (const placeId of neighbourhood.place_ids) {
      for (const routeId of routesByPlace.get(placeId) ?? []) derivedRoutes.add(routeId);
    }
    if (derivedRoutes.size === 0) zeroRoutes.push(neighbourhood.id);
  }
  if (zeroPlaces.length > 0) {
    console.warn(`neighbourhood histories: context-only (no mapped places): ${zeroPlaces.join(", ")}`);
  }
  if (zeroRoutes.length > 0) {
    console.warn(`neighbourhood histories: no walking route reaches: ${zeroRoutes.join(", ")}`);
  }

  console.log(
    `neighbourhood histories checks passed: ${neighbourhoods.length} quarters, ${translatedCount} translated strings`
  );
}

assertNoPrivateFixFields(loaded.get("fix reports"));
assertProjectBudgetLinks(loaded.get("projects"), loaded.get("budget items"));
assertCommunityProjectLinks(loaded.get("community initiatives"), loaded.get("projects"));
assertMayorArchiveCompleteness(loaded.get("city archive"));
assertReviewedTimelineFacts(loaded.get("history timeline"));
assertEnglishArchiveDateParity(loaded.get("city archive"));
assertLandmarkEnglishSummaryIntegrity(loaded.get("landmarks"));
assertKnowledgeLinks(loaded);
assertTimelineExactDateCoverage(loaded);
assertTimelineSourceRigor(loaded);
assertKnowledgePersonProfiles(loaded);
assertKnowledgePlaceCoverage(loaded);
assertPlaceMediaLicensing(loaded);
assertArchiveLayer(loaded);
assertEducationResources(loaded);
assertStoryLongreads(loaded);
assertEditorialReviewReport(loaded);
assertSourceCoverageReport();
assertWalkingRoutes(loaded);
assertNeighbourhoodHistories(loaded);

console.log("data validation passed");
