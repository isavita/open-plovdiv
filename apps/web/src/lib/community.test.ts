import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { field } from "../i18n/utils";
import { communityInitiatives } from "./data";

describe("community source titles", () => {
  it("renders an English title while retaining the original Bulgarian source", () => {
    for (const initiative of communityInitiatives) {
      for (const source of initiative.sources) {
        expect(source.title_en, source.url).toBeTruthy();
        expect(field(source, "title", "en"), source.url).toBe(source.title_en);
        expect(field(source, "title", "en"), source.url).not.toMatch(/[\u0400-\u04ff]/);
        expect(field(source, "title", "bg"), source.url).toBe(source.title);
      }
    }
  });

  it("preserves existing localized source titles when the English display title changes", () => {
    const sources = communityInitiatives.flatMap((initiative) => initiative.sources);
    for (const locale of ["de", "el", "es", "fr", "it", "ja", "pl", "pt", "ru", "tl", "tr", "uk"]) {
      const file = new URL(`../../../../data/translations/${locale}.json`, import.meta.url);
      const translations = JSON.parse(readFileSync(file, "utf8")) as Record<string, string>;
      let checked = 0;
      for (const source of sources) {
        if (!translations[source.title]) continue;
        expect(translations[source.title_en!], `${locale}: ${source.title}`).toBe(translations[source.title]);
        checked++;
      }
      expect(checked, `${locale} source translations`).toBeGreaterThan(0);
    }
  });
});
