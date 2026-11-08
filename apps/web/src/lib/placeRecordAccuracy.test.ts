import { describe, expect, it } from "vitest";
import landmarks from "../../../../data/curated/plovdiv-landmarks.json";

describe("source-backed place descriptions", () => {
  it("does not describe the modern football complex as a Revival house", () => {
    const complex = landmarks.find((place) => place.wikidata_id === "Q30644373");
    expect(complex).toBeDefined();
    expect(complex?.history).toBeUndefined();
    expect(complex?.summary_en).toMatch(/football complex/i);
    expect(complex?.era_en).toMatch(/modern/i);
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
