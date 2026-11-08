import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import landmarks from "../../../../data/curated/plovdiv-landmarks.json";

describe("source-backed place descriptions", () => {
  it("does not describe the modern football complex as a Revival house", () => {
    const complex = landmarks.find((place) => place.wikidata_id === "Q30644373");
    expect(complex).toBeDefined();
    expect(complex?.history).toBeUndefined();
    expect(complex?.id).toBe("landmark-botev-1912-football-complex-q30644373");
    expect(complex?.name_en).toBe("Nikola Shterev–Starika Sports Complex");
    expect(complex?.name_bg).toBe("Спортен комплекс „Никола Щерев – Старика“");
    expect(complex?.summary_en).toContain("formerly Botev 1912 Football Complex");
    expect(complex?.summary_bg).toContain("известен преди като футболен комплекс „Ботев 1912“");
    expect(complex?.source?.url).toContain("plovdiv.bg/obs/");
    expect(complex?.coordinates).toMatchObject({ lat: 42.1075, lng: 24.708 });
    // 18 September 2013 is reported as an opening date, not a construction date.
    expect(complex?.built_date).toBeUndefined();
    expect(complex?.built_year).toBeUndefined();
    expect(complex?.era_en).toMatch(/modern/i);
  });

  it("keeps the current venue and its historical name in every supported language", () => {
    const complex = landmarks.find((place) => place.wikidata_id === "Q30644373");
    const name = "Nikola Shterev–Starika Sports Complex";
    const summary = "Nikola Shterev–Starika Sports Complex in Plovdiv, formerly Botev 1912 Football Complex.";
    expect(complex?.name_en).toBe(name);
    expect(complex?.summary_en).toBe(summary);
    expect(complex?.summary_bg).toContain("Ботев 1912");
    for (const locale of ["de", "fr", "it", "tr", "es", "el", "ja", "zh", "tl", "uk", "ru", "pl", "pt"]) {
      const dictionary = JSON.parse(readFileSync(new URL(`../../../../data/translations/${locale}.json`, import.meta.url), "utf8"));
      expect(dictionary[name], locale).toContain("Nikola Shterev–Starika");
      expect(dictionary[name], locale).not.toBe(name);
      expect(dictionary[summary], locale).toContain("Botev 1912");
      expect(dictionary[summary], locale).toContain("Nikola Shterev–Starika");
      expect(Object.keys(dictionary).filter((key) => key.startsWith("Botev 1912 Football Complex ") && /Revival|Old Plovdiv/.test(key)), locale).toEqual([]);
    }
  });

  it("describes the Jewish cemetery as a cemetery in both base languages", () => {
    const cemetery = landmarks.find((place) => place.wikidata_id === "Q64578596");
    expect(cemetery?.name_bg).toContain("гробищен парк");
    expect(cemetery?.summary_bg).toContain("гробищен парк");
    expect(cemetery?.summary_en).toMatch(/cemetery/i);
    expect(cemetery?.history?.sections?.[0]?.body_bg).not.toContain("храм");
    expect(cemetery?.history?.sections?.[0]?.source?.url).toContain("bntnews.bg");
  });

  it("uses source-backed Bulgarian names without leaving Latin fallback names in the Bulgarian narrative", () => {
    const expected: Record<string, string> = {
      Q113564786: "Къща на Ритора",
      Q117750038: "Къща „Бирдас“",
      Q113632624: "Музейна аптека „Хипократ“",
      Q105581474: "Къща на Георги Данчов – Зографина",
      Q105415800: "Къща „Георги Павлити“",
      Q117750307: "Бакалова къща",
      Q105622469: "Къща на Касандра Баятова"
    };
    for (const [id, name] of Object.entries(expected)) {
      const place = landmarks.find((item) => item.wikidata_id === id);
      expect(place?.name_bg).toBe(name);
      const bgNarrative = [place?.history?.lede_bg, ...(place?.history?.sections ?? []).map((section) => section.body_bg)].join(" ");
      expect(bgNarrative).not.toContain(place?.name_en);
    }
  });
});
