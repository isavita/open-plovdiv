import { describe, expect, it } from "vitest";
import { languages, type Lang } from "../i18n/ui";
import { contextualEntitySeoTitle, mayorTermSeoTitle, placeSeoDescription } from "./detailSeo";

describe("place search descriptions", () => {
  it("identifies repeated generic descriptions by the actual place name", () => {
    const summary = "A building from Plovdiv's National Revival period.";
    expect(placeSeoDescription("Andrey Georgiadi House", summary, true, "en")).toBe(`Andrey Georgiadi House — ${summary}`);
    expect(placeSeoDescription("Къща Андрея Георгиади", "Сграда от епохата на Българското възраждане в Пловдив.", true, "bg")).toBe("Къща Андрея Георгиади — Сграда от епохата на Българското възраждане в Пловдив.");
    expect(placeSeoDescription("A different place", summary, false, "en")).toBe(summary);
    expect(placeSeoDescription("Name", "Name is a building.", true, "en")).toBe("Name is a building.");
    expect(placeSeoDescription("Name", summary, true, "zh")).toBe(`Name — ${summary}`);
  });
});

describe("mayoral term titles", () => {
  it("distinguishes terms and does not invent an end date for open terms", () => {
    expect(mayorTermSeoTitle("Nikola Chalakov", 1894, 1894, false, "en")).toBe("Nikola Chalakov — Mayor of Plovdiv (1894)");
    expect(mayorTermSeoTitle("Nikola Chalakov", 1899, 1901, false, "en")).toBe("Nikola Chalakov — Mayor of Plovdiv (1899–1901)");
    expect(mayorTermSeoTitle("Никола Чалъков", 1894, 1894, true, "bg")).toBe("Никола Чалъков — и.д. кмет на Пловдив (1894)");
    expect(mayorTermSeoTitle("Kostadin Dimitrov", 2023, null, false, "en")).toBe("Kostadin Dimitrov — Mayor of Plovdiv");
    expect(mayorTermSeoTitle("Name", 1894, 1894, false, "ja")).toBe("Name — プロヴディフ市長 (1894)");
    expect(mayorTermSeoTitle("姓名", 1894, 1896, true, "zh")).toBe("姓名 — 普罗夫迪夫代理市长 (1894–1896)");
  });
});

describe("place and neighbourhood or project titles", () => {
  it("adds the localized record type only when titles collide", () => {
    expect(contextualEntitySeoTitle("Kapana", "neighbourhood", true, "en")).toBe("Kapana — Plovdiv neighbourhood");
    expect(contextualEntitySeoTitle("Капана", "neighbourhood", true, "bg")).toBe("Капана — квартал в Пловдив");
    expect(contextualEntitySeoTitle("Hristo Botev Stadium", "project", true, "en")).toBe("Hristo Botev Stadium — Plovdiv project");
    expect(contextualEntitySeoTitle("Kapana", "neighbourhood", false, "en")).toBe("Kapana");
    expect(contextualEntitySeoTitle("カパナ", "neighbourhood", true, "ja")).toBe("カパナ — プロヴディフの地区");
    expect(contextualEntitySeoTitle("名称", "project", true, "zh")).toBe("名称 — 普罗夫迪夫项目");
  });
});

describe("all supported locales", () => {
  it.each(Object.keys(languages) as Lang[])("distinguishes records and preserves term dates in %s", (lang) => {
    expect(placeSeoDescription("Example", "A shared summary.", true, lang)).toBe("Example — A shared summary.");
    expect(placeSeoDescription("Example", "Example is a place.", true, lang)).toBe("Example is a place.");
    expect(contextualEntitySeoTitle("Example", "neighbourhood", true, lang)).toMatch(/^Example — .+/);
    expect(contextualEntitySeoTitle("Example", "project", true, lang)).toMatch(/^Example — .+/);
    expect(mayorTermSeoTitle("Example", 1900, 1902, false, lang)).toMatch(/^Example — .+ \(1900–1902\)$/);
    expect(mayorTermSeoTitle("Example", 1900, null, true, lang)).not.toMatch(/1900/);
    expect(mayorTermSeoTitle("Example", 1900, null, true, lang)).not.toBe(mayorTermSeoTitle("Example", 1900, null, false, lang));
  });
});
