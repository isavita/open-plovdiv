import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { jaUiTranslations } from "./jaUiTranslations";

const japanese: Record<string, string> = JSON.parse(
  readFileSync(resolve(process.cwd(), "../../data/translations/ja.json"), "utf8")
);

describe("Japanese translation fidelity", () => {
  it("distinguishes political power and urban neighbourhoods from electricity and financial quarters", () => {
    expect(japanese["Municipal power transfer after 9 September 1944"]).not.toContain("電力");
    for (const [source, translation] of Object.entries(japanese)) {
      if (/\b(?:quarter|quarters|neighbourhood|neighborhood)s?\b/i.test(source)) {
        expect(translation, source).not.toMatch(/四半期|四分の一/);
      }
    }
  });

  it("retains the founding dates of educational institutions", () => {
    for (const year of ["1945", "1964", "1976"]) {
      const source = Object.keys(japanese).find((text) => text.includes(`It was founded in ${year}.`));
      expect(source, year).toBeDefined();
      expect(japanese[source!], year).toContain(year);
    }
  });

  it("preserves the exchange rate in the Japanese budget explanation", () => {
    const source = Object.keys(jaUiTranslations).find((text) => text.includes("at 1.95583"));
    expect(source).toBeDefined();
    expect(jaUiTranslations[source!]).toContain("1.95583");
  });
});
