import { describe, expect, it } from "vitest";
import { localeCodes } from "../i18n/utils";
import { matchesSearchText, normalizeSearchText, rankSiteSearch } from "./searchCore";
import { buildSiteSearchIndex } from "./siteSearch";

describe("universal site search", () => {
  it("indexes every public content surface", () => {
    const index = buildSiteSearchIndex("bg");
    expect(index.count).toBe(index.items.length);
    expect(index.items.length).toBeGreaterThan(850);
    expect(index.items.some((item) => item.id === "page:history")).toBe(true);
    expect(index.items.some((item) => item.id === "route:first-day-plovdiv")).toBe(true);
    expect(index.items.some((item) => item.id === "place:place-ancient-theatre")).toBe(true);
    expect(index.items.some((item) => item.id === "person:person-kostadin-dimitrov")).toBe(true);
    expect(index.items.some((item) => item.id === "story:story-roman-philippopolis")).toBe(true);
    expect(index.items.some((item) => item.id === "neighbourhood:kapana")).toBe(true);
    expect(index.items.some((item) => item.kind === "project")).toBe(true);
    expect(index.items.some((item) => item.kind === "initiative")).toBe(true);
    expect(index.items.filter((item) => item.kind === "event")).toHaveLength(362);
  });

  it("makes every suggested query productive in every locale", () => {
    for (const lang of localeCodes) {
      const index = buildSiteSearchIndex(lang);
      expect(index.suggestions.length, lang).toBeGreaterThanOrEqual(4);
      for (const suggestion of index.suggestions) {
        expect(rankSiteSearch(index.items, suggestion, 3).length, `${lang}: ${suggestion}`).toBeGreaterThan(0);
      }
    }
  });

  it("keeps every locale's index payload within the mobile budget", () => {
    // The browser downloads and parses this JSON when search first opens.
    // Long-form text must ship in one language per index; a jump past this
    // budget usually means another all-locale field leaked in.
    for (const lang of localeCodes) {
      const serialized = JSON.stringify(buildSiteSearchIndex(lang));
      expect(serialized.length, `${lang} index bytes`).toBeLessThan(1_200_000);
    }
  });

  it("matches words in any order and tolerates a modest typo", () => {
    const index = buildSiteSearchIndex("en");
    const reordered = rankSiteSearch(index.items, "theatre ancient", 5);
    const typo = rankSiteSearch(index.items, "ancint theatre", 5);
    expect(reordered.map((item) => item.id)).toContain("place:place-ancient-theatre");
    expect(typo.map((item) => item.id)).toContain("place:place-ancient-theatre");
  });

  it("keeps Bulgarian records discoverable from common Latin spellings", () => {
    const index = buildSiteSearchIndex("bg");
    expect(rankSiteSearch(index.items, "Kapana", 8).some((item) => item.id === "place:place-kapana-q12282547")).toBe(true);
    expect(rankSiteSearch(index.items, "ancint theatre", 8)[0]?.id).toBe("place:place-ancient-theatre");
  });

  it("normalizes accents, punctuation and catalogue word order", () => {
    expect(normalizeSearchText("  Théâtre—ANTIQUE ")).toBe("theatre antique");
    expect(matchesSearchText("Ancient Roman Theatre", "theatre ancient")).toBe(true);
    expect(matchesSearchText("Ancient Roman Theatre", "theatre medieval")).toBe(false);
  });
});
