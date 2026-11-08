import { describe, expect, it } from "vitest";
import { languages, type Lang } from "../i18n/ui";
import { peopleCatalogMessages } from "./peopleCatalogMessages";

describe("people catalog fallback messages", () => {
  it.each(Object.keys(languages) as Lang[])("provides both messages for %s", (lang) => {
    expect(peopleCatalogMessages[lang].noJavaScript).toContain("JavaScript");
    expect(peopleCatalogMessages[lang].unavailable.length).toBeGreaterThan(20);
    if (lang !== "en") expect(peopleCatalogMessages[lang].unavailable).not.toBe(peopleCatalogMessages.en.unavailable);
  });

  it("explains both states in Chinese", () => {
    expect(peopleCatalogMessages.zh.noJavaScript).toContain("搜索和筛选需要 JavaScript");
    expect(peopleCatalogMessages.zh.unavailable).toContain("搜索和筛选暂时不可用");
  });
});
