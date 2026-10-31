import { describe, expect, it } from "vitest";
import { historyKnowledgeEvents, storyLongreads } from "./data";
import { field, type Lang } from "../i18n/utils";

const languages: Lang[] = ["bg", "en", "de", "fr", "it", "tr", "es", "el", "ja", "tl", "uk", "ru", "pl", "pt"];

function translated(record: object, key: string) {
  const value = record as Record<string, unknown>;
  for (const lang of languages) {
    const result = field(value, key, lang);
    expect(result.trim(), `${key} in ${lang}`).toBeTruthy();
    if (lang !== "en") expect(result, `${key} in ${lang}`).not.toBe(value[`${key}_en`]);
  }
}

describe("refreshed history content", () => {
  it("keeps the museum's prehistoric dating and recent milestones localized and geographically relevant", () => {
    const earliest = historyKnowledgeEvents.find((event) => event.id === "event-prehistory-nebet-tepe")!;
    const reopening = historyKnowledgeEvents.find((event) => event.id === "event-modern-nebet-tepe-reopens")!;
    const cycling = historyKnowledgeEvents.find((event) => event.id === "event-modern-giro-2026")!;
    expect(earliest.date.year).toBe(-4200);
    expect(earliest.source_ids).toContain("source-regional-archaeological-museum-plovdiv-the-fortress-of-nebet-tepe");
    expect(earliest.organization_ids).not.toContain("org-regional-history-museum-plovdiv");
    expect(reopening.date).toMatchObject({ year: 2025, month: 3, day: 20 });
    expect(reopening.place_ids).toContain("place-nebet-tepe");
    expect(cycling.date).toMatchObject({ year: 2026, month: 5, day: 10 });
    expect(cycling.place_ids).toContain("place-plovdiv-city");
    expect(cycling.place_ids).not.toContain("place-old-town");
    for (const event of [earliest, reopening, cycling]) translated(event, "summary");
    for (const event of [reopening, cycling]) translated(event, "title");
  });

  it("credits and localizes the prehistoric object and modern story views", () => {
    const prehistoric = storyLongreads.find((story) => story.id === "story-deep-time-seven-hills")!;
    const roman = storyLongreads.find((story) => story.id === "story-roman-philippopolis")!;
    const ottoman = storyLongreads.find((story) => story.id === "story-ottoman-filibe-city")!;
    const object = prehistoric.sections[1].media!;
    expect(prehistoric.sections[1].body_en).toContain("does not establish a direct migration");
    expect(object.page_url).toContain("commons.wikimedia.org/wiki/File:");
    expect(object.credit).toContain("Kritzolina · CC BY-SA 4.0");
    expect(object.caption_en).toContain("not found at Yasa Tepe");
    translated(object, "caption");
    translated(prehistoric.sections[2], "body");
    for (const story of [prehistoric, roman, ottoman]) translated(story.hero, "caption");
    const imaret = ottoman.sections.find((section) => section.heading_en === "Imaret: Worship and Hospitality by the River")!;
    expect(imaret.source_ids).toContain("source-u-s-commission-muslim-historic-sites-in-bulgaria");
    expect(imaret.linked_place_ids).toContain("place-sahabettin-imaret-mosque-q3409168");
    expect(imaret.media?.credit).toBe("Jojowrner · CC BY-SA 4.0");
    translated(imaret, "heading");
    translated(imaret, "body");
    translated(imaret.media!, "caption");
  });
});
