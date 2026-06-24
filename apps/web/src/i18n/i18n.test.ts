import { describe, expect, it } from "vitest";
// Relative imports: vitest does not resolve the tsconfig path aliases.
import {
  categoryLabels,
  communityStatusLabels,
  fixStatusDescriptions,
  fixStatusLabels,
  fundingSourceLabels,
  languages,
  projectStatusLabels,
  roleLabels,
  sourceTitleLabels,
  ui,
  type Lang
} from "./ui";
import { delocalizePath, field, getLangFromUrl, localizePath, localeForLang } from "./utils";

const locales = Object.keys(languages) as Lang[];
const CYRILLIC = /[Ѐ-ӿ]/;
// Locales whose UI must read in their own script — i.e. no Bulgarian Cyrillic
// may leak through. (Greek would be added here with a Greek-range allowance.)
const LATIN_LOCALES: Lang[] = ["en", "de"];

/** Collect [dottedPath, value] for every *string* leaf; skip functions. */
function collectStrings(
  obj: Record<string, unknown>,
  prefix = "",
  out: Array<[string, string]> = []
): Array<[string, string]> {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") out.push([path, value]);
    else if (typeof value === "function") continue;
    else if (value && typeof value === "object" && !Array.isArray(value)) {
      collectStrings(value as Record<string, unknown>, path, out);
    }
  }
  return out;
}

describe("i18n locales", () => {
  it("registers Bulgarian, English and German (Greek is the next planned add)", () => {
    expect(locales).toEqual(expect.arrayContaining(["bg", "en", "de"]));
  });

  it("every locale exposes a non-empty display name", () => {
    for (const loc of locales) {
      expect(languages[loc]?.trim().length, `languages.${loc}`).toBeGreaterThan(0);
    }
  });
});

describe("ui dictionary parity", () => {
  const bgKeys = collectStrings(ui.bg)
    .map(([path]) => path)
    .sort();

  it("each locale has exactly the same string keys as the bg source of truth", () => {
    for (const loc of locales) {
      const keys = collectStrings(ui[loc])
        .map(([path]) => path)
        .sort();
      expect(keys, `${loc} keys drift from bg`).toEqual(bgKeys);
    }
  });

  it("no locale ships an empty or whitespace-only UI string", () => {
    for (const loc of locales) {
      for (const [path, value] of collectStrings(ui[loc])) {
        expect(value.trim().length, `${loc}.${path} is empty`).toBeGreaterThan(0);
      }
    }
  });

  it("English and German UI never leak untranslated Bulgarian (Cyrillic)", () => {
    for (const loc of LATIN_LOCALES) {
      for (const [path, value] of collectStrings(ui[loc])) {
        expect(CYRILLIC.test(value), `${loc}.${path} contains Cyrillic: "${value}"`).toBe(false);
      }
    }
  });
});

describe("data-label maps", () => {
  // Maps whose every locale must carry the same inner keys.
  const symmetricMaps: Array<[string, Record<Lang, Record<string, string>>]> = [
    ["categoryLabels", categoryLabels],
    ["projectStatusLabels", projectStatusLabels],
    ["communityStatusLabels", communityStatusLabels],
    ["fixStatusLabels", fixStatusLabels],
    ["fixStatusDescriptions", fixStatusDescriptions],
    ["fundingSourceLabels", fundingSourceLabels]
  ];

  it("every data-label map has all locales with matching keys and no empty values", () => {
    for (const [name, map] of symmetricMaps) {
      for (const loc of locales) {
        expect(map[loc], `${name}.${loc} missing`).toBeTruthy();
      }
      const refKeys = Object.keys(map.bg).sort();
      for (const loc of locales) {
        expect(Object.keys(map[loc]).sort(), `${name}.${loc} key drift`).toEqual(refKeys);
        for (const [key, value] of Object.entries(map[loc])) {
          expect(value.trim().length, `${name}.${loc}.${key} empty`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("Latin-locale data labels contain no leaked Cyrillic", () => {
    for (const [name, map] of symmetricMaps) {
      for (const loc of LATIN_LOCALES) {
        for (const [key, value] of Object.entries(map[loc])) {
          expect(CYRILLIC.test(value), `${name}.${loc}.${key}: "${value}"`).toBe(false);
        }
      }
    }
  });

  it("every shared role tag is translated into all locales with no Cyrillic leak", () => {
    for (const [role, byLocale] of Object.entries(roleLabels)) {
      for (const loc of locales) {
        const value = byLocale[loc];
        expect(typeof value === "string" && value.trim().length > 0, `roleLabels.${role}.${loc}`).toBe(
          true
        );
      }
      for (const loc of LATIN_LOCALES) {
        expect(CYRILLIC.test(byLocale[loc]), `roleLabels.${role}.${loc}: "${byLocale[loc]}"`).toBe(
          false
        );
      }
    }
  });

  it("source-title translations keep matching keys across Latin locales", () => {
    // bg intentionally keeps the original titles (empty map); en/de translate them.
    const enKeys = Object.keys(sourceTitleLabels.en).sort();
    const deKeys = Object.keys(sourceTitleLabels.de).sort();
    expect(deKeys, "de source titles drift from en").toEqual(enKeys);
    for (const loc of LATIN_LOCALES) {
      for (const [key, value] of Object.entries(sourceTitleLabels[loc])) {
        expect(value.trim().length, `sourceTitleLabels.${loc}.${key} empty`).toBeGreaterThan(0);
      }
    }
  });
});

describe("localised routing", () => {
  it("builds the correct prefix for every locale and never an empty slug", () => {
    for (const path of ["/", "/budget", "/history/contribute"]) {
      expect(localizePath(path, "bg")).toBe(path);
      for (const loc of locales.filter((l) => l !== "bg")) {
        const expected = path === "/" ? `/${loc}` : `/${loc}${path}`;
        expect(localizePath(path, loc)).toBe(expected);
      }
    }
  });

  it("detects the locale from a URL and round-trips back to the logical path", () => {
    expect(getLangFromUrl("/de/budget")).toBe("de");
    expect(getLangFromUrl("/en/history")).toBe("en");
    expect(getLangFromUrl("/budget")).toBe("bg");
    expect(delocalizePath("/de/budget")).toBe("/budget");
    expect(delocalizePath("/de")).toBe("/");
    expect(delocalizePath("/projects")).toBe("/projects");
  });

  it("field() falls back de → en → bg so a label is never blank", () => {
    const record = { summary_en: "English", summary_bg: "Български" };
    expect(field(record, "summary", "de")).toBe("English");
    expect(field({ summary_de: "Deutsch", ...record }, "summary", "de")).toBe("Deutsch");
    expect(field({ summary_bg: "само BG" }, "summary", "de")).toBe("само BG");
    expect(field({ summary: "legacy BG" }, "summary", "de")).toBe("legacy BG");
    expect(field(undefined, "summary", "de")).toBe("");
    expect(field(record, "summary", "bg")).toBe("Български");
  });

  it("maps every supported language to an Intl locale", () => {
    expect(localeForLang("bg")).toBe("bg-BG");
    expect(localeForLang("en")).toBe("en-GB");
    expect(localeForLang("de")).toBe("de-DE");
  });
});
