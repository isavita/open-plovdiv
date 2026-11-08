import { describe, expect, it } from "vitest";
import { contextualEntitySeoTitle, mayorTermSeoTitle, placeSeoDescription } from "./detailSeo";

describe("place search descriptions", () => {
  it("identifies repeated generic descriptions by the actual place name", () => {
    const summary = "A building from Plovdiv's National Revival period.";
    expect(placeSeoDescription("Andrey Georgiadi House", summary, true, "en")).toBe(`Andrey Georgiadi House — ${summary}`);
    expect(placeSeoDescription("Къща Андрея Георгиади", "Сграда от епохата на Българското възраждане в Пловдив.", true, "bg")).toBe("Къща Андрея Георгиади — Сграда от епохата на Българското възраждане в Пловдив.");
    expect(placeSeoDescription("A different place", summary, false, "en")).toBe(summary);
    expect(placeSeoDescription("Name", "Name is a building.", true, "en")).toBe("Name is a building.");
    expect(placeSeoDescription("Name", summary, true, "zh")).toBe(summary);
  });
});

describe("mayoral term titles", () => {
  it("distinguishes terms and does not invent an end date for open terms", () => {
    expect(mayorTermSeoTitle("Nikola Chalakov", 1894, 1894, false, "en")).toBe("Nikola Chalakov — Mayor of Plovdiv (1894)");
    expect(mayorTermSeoTitle("Nikola Chalakov", 1899, 1901, false, "en")).toBe("Nikola Chalakov — Mayor of Plovdiv (1899–1901)");
    expect(mayorTermSeoTitle("Никола Чалъков", 1894, 1894, true, "bg")).toBe("Никола Чалъков — и.д. кмет на Пловдив (1894)");
    expect(mayorTermSeoTitle("Kostadin Dimitrov", 2023, null, false, "en")).toBe("Kostadin Dimitrov — Mayor of Plovdiv");
    expect(mayorTermSeoTitle("Name", 1894, 1894, false, "ja")).toBe("Name");
  });
});

describe("place and neighbourhood or project titles", () => {
  it("adds record type only when English or Bulgarian titles collide", () => {
    expect(contextualEntitySeoTitle("Kapana", "neighbourhood", true, "en")).toBe("Kapana — Plovdiv neighbourhood");
    expect(contextualEntitySeoTitle("Капана", "neighbourhood", true, "bg")).toBe("Капана — квартал в Пловдив");
    expect(contextualEntitySeoTitle("Hristo Botev Stadium", "project", true, "en")).toBe("Hristo Botev Stadium — Plovdiv project");
    expect(contextualEntitySeoTitle("Kapana", "neighbourhood", false, "en")).toBe("Kapana");
    expect(contextualEntitySeoTitle("カパナ", "neighbourhood", true, "ja")).toBe("カパナ");
  });
});
