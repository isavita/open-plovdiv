import type { Lang } from "../i18n/ui";
import {
  historyKnowledgeEvents,
  historyKnowledgePeople,
  historyKnowledgePersonRelationships,
  historyKnowledgeSources
} from "./data";

// Match the catalogue's existing locale fallback, including the Chinese rule
// that avoids falling back to Bulgarian when there is no English text.
function localized(record: Record<string, any>, base: string, lang: Lang): string {
  return String(lang === "zh"
    ? (record[`${base}_zh`] || record[`${base}_en`] || "")
    : (record[`${base}_${lang}`] ?? record[`${base}_en`] ?? record[`${base}_bg`] ?? ""));
}

/** Compact, locale-specific data for the people catalogue, ledger and graph. */
export function buildPeopleCatalog(lang: Lang) {
  const sourceIds = new Set<string>();
  const eventIds = new Set<string>();
  const people = historyKnowledgePeople.map((person) => {
    if (person.source_ids[0]) sourceIds.add(person.source_ids[0]);
    for (const relation of person.relationships) if (relation.source_id) sourceIds.add(relation.source_id);
    for (const id of person.term_events) eventIds.add(id);
    return {
      id: person.id,
      name: localized(person, "name", lang),
      summary: localized(person, "summary", lang),
      roles: person.roles,
      birth_year: person.birth_year,
      death_year: person.death_year,
      image: person.image,
      term_events: person.term_events,
      source_ids: person.source_ids.slice(0, 1),
      relationships: person.relationships
    };
  });
  const relationships = historyKnowledgePersonRelationships.map((item) => {
    const relation = item as Record<string, any>;
    for (const id of relation.source_ids ?? []) sourceIds.add(id);
    if (relation.event_id) eventIds.add(relation.event_id);
    return {
      id: relation.id,
      relationship_type: relation.relationship_type,
      from_person_id: relation.from_person_id,
      to_person_id: relation.to_person_id,
      event_id: relation.event_id,
      evidence_property: relation.evidence_property,
      source_ids: relation.source_ids
    };
  });
  const sources = historyKnowledgeSources.filter((source) => sourceIds.has(source.id)).map((source) => ({
    id: source.id,
    title: localized(source, "title", lang),
    url: source.url
  }));
  const events = historyKnowledgeEvents.filter((event) => eventIds.has(event.id)).map((event) => ({
    id: event.id,
    title: localized(event, "title", lang),
    date: { year: event.date.year, display: localized(event.date, "display", lang) }
  }));
  return { people, sources, person_relationships: relationships, events };
}
