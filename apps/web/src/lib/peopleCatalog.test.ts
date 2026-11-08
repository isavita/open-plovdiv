import { brotliCompressSync, constants } from "node:zlib";
import { describe, expect, it } from "vitest";
import { localeCodes } from "../i18n/utils";
import { buildPeopleCatalog } from "./peopleCatalog";
import { historyKnowledgePeople, historyKnowledgeSources, historyKnowledgeEvents, historyKnowledgePersonRelationships } from "./data";
import { GET, getStaticPaths } from "../pages/api/history/people-catalog/v1/[lang].json";

describe("compact localized people catalogue", () => {
  it.each(localeCodes)("preserves the catalogue, graph and referenced sources for %s", (lang) => {
    const result = buildPeopleCatalog(lang);
    expect(result.people).toHaveLength(historyKnowledgePeople.length);
    expect(result.person_relationships).toHaveLength(historyKnowledgePersonRelationships.length);
    const people = new Map(result.people.map((person) => [person.id, person]));
    const sources = new Map(result.sources.map((source) => [source.id, source]));
    const events = new Map(result.events.map((event) => [event.id, event]));
    const sourceIds = new Set(historyKnowledgeSources.map((source) => source.id));
    const eventIds = new Set(historyKnowledgeEvents.map((event) => event.id));

    for (const original of historyKnowledgePeople) {
      const card = people.get(original.id)!;
      const raw = original as Record<string, any>;
      const expectedName = lang === "zh" ? (raw.name_zh || raw.name_en || "") : (raw[`name_${lang}`] ?? raw.name_en ?? raw.name_bg ?? "");
      const expectedSummary = lang === "zh" ? (raw.summary_zh || raw.summary_en || "") : (raw[`summary_${lang}`] ?? raw.summary_en ?? raw.summary_bg ?? "");
      expect(card.name, original.id).toBe(expectedName);
      expect(card.summary, original.id).toBe(expectedSummary);
      expect(card.relationships, original.id).toEqual(original.relationships);
      expect(card.roles, original.id).toEqual(original.roles);
      expect(card.image, original.id).toBe(original.image);
      for (const id of [original.source_ids[0], ...original.relationships.map((relation) => relation.source_id)]) {
        if (id && sourceIds.has(id)) expect(sources.has(id), id).toBe(true);
      }
      for (const id of original.term_events) if (eventIds.has(id)) expect(events.has(id), id).toBe(true);
    }
    for (const original of historyKnowledgePersonRelationships) {
      const relation = result.person_relationships.find((item) => item.id === original.id);
      expect(relation).toMatchObject({
        id: original.id,
        from_person_id: original.from_person_id,
        to_person_id: original.to_person_id,
        relationship_type: original.relationship_type,
        event_id: original.event_id,
        source_ids: original.source_ids
      });
      for (const id of (original.source_ids ?? []) as string[]) if (sourceIds.has(id)) expect(sources.has(id), id).toBe(true);
      if (typeof original.event_id === "string" && eventIds.has(original.event_id)) expect(events.has(original.event_id)).toBe(true);
    }
    for (const source of result.sources) {
      const original = historyKnowledgeSources.find((item) => item.id === source.id)! as Record<string, any>;
      const expected = lang === "zh" ? (original.title_zh || original.title_en || "") : (original[`title_${lang}`] ?? original.title_en ?? original.title_bg ?? "");
      expect(source.title, source.id).toBe(expected);
      expect(source.url, source.id).toBe(original.url);
    }
    for (const event of result.events) {
      const original = historyKnowledgeEvents.find((item) => item.id === event.id)! as Record<string, any>;
      const title = lang === "zh" ? (original.title_zh || original.title_en || "") : (original[`title_${lang}`] ?? original.title_en ?? original.title_bg ?? "");
      const date = original.date as Record<string, any>;
      const display = lang === "zh" ? (date.display_zh || date.display_en || "") : (date[`display_${lang}`] ?? date.display_en ?? date.display_bg ?? "");
      expect(event.title, event.id).toBe(title);
      expect(event.date).toEqual({ year: original.date.year, display });
    }
  });

  it("uses substantially less bandwidth than the full multilingual people and source APIs", () => {
    const compress = (value: unknown) => brotliCompressSync(JSON.stringify(value), { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } }).length;
    const before = compress(historyKnowledgePeople) + compress(historyKnowledgeSources);
    const after = compress(buildPeopleCatalog("en"));
    expect(after).toBeLessThan(before / 2);
  });

  it("publishes a ten-minute public response for each supported locale", async () => {
    expect(getStaticPaths().map(({ params }) => params.lang)).toEqual(localeCodes);
    const response = await GET({ props: { lang: "en" } } as any);
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=600");
    expect(response.headers.get("Content-Type")).toContain("application/json");
    const body = await response.json();
    expect(body.people).toHaveLength(historyKnowledgePeople.length);
  });
});
