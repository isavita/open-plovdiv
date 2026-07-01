import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const CYRILLIC = /[Ѐ-ӿ]/;
const GREEK = /[Ͱ-Ͽἀ-῿]/;
const JAPANESE = /[\u3040-\u30ff\u3400-\u9fff]/;
// Non-Bulgarian locales whose UI must not leak Bulgarian Cyrillic. Greek (`el`) is
// included: it uses its own (Greek) script, which the CYRILLIC range does not match,
// so the same no-Cyrillic-leak assertion is Greek-aware (allows Greek, catches Cyrillic).
const NON_BG_SCRIPT_LOCALES: Lang[] = ["en", "de", "fr", "it", "tr", "es", "el", "ja"];
// Locales written in the Latin script (used for assertions that are Latin-only).
const LATIN_LOCALES: Lang[] = ["en", "de", "fr", "it", "tr", "es"];

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
  it("registers every shipped locale", () => {
    expect(locales).toEqual(["bg", "en", "de", "fr", "it", "tr", "es", "el", "ja"]);
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

  it("non-Bulgarian-script UI never leaks untranslated Bulgarian (Cyrillic)", () => {
    for (const loc of NON_BG_SCRIPT_LOCALES) {
      for (const [path, value] of collectStrings(ui[loc])) {
        expect(CYRILLIC.test(value), `${loc}.${path} contains Cyrillic: "${value}"`).toBe(false);
      }
    }
  });

  it("Greek UI is actually translated into Greek script (not left in English)", () => {
    // A handful of brand/loanword strings legitimately stay Latin (site.name,
    // facebook, the BG/EN admin field labels). Most strings must contain Greek.
    const greekStrings = collectStrings(ui.el).filter(([, value]) => GREEK.test(value));
    expect(greekStrings.length).toBeGreaterThan(200);
  });

  it("Japanese UI is actually translated into Japanese script (not left in English)", () => {
    const japaneseStrings = collectStrings(ui.ja).filter(([, value]) => JAPANESE.test(value));
    expect(japaneseStrings.length).toBeGreaterThan(200);
  });
});

describe("generated translation JSON", () => {
  it("Japanese translations have exact key parity with the other generated locales and no blanks", () => {
    const langs = ["de", "fr", "it", "tr", "es", "el", "ja"];
    const translations = Object.fromEntries(
      langs.map((lang) => [
        lang,
        JSON.parse(fs.readFileSync(path.join(repoRoot, `data/translations/${lang}.json`), "utf8")) as Record<string, string>
      ])
    );
    const jaKeys = Object.keys(translations.ja).sort();
    expect(jaKeys.length).toBeGreaterThan(0);
    for (const lang of langs.filter((item) => item !== "ja")) {
      expect(Object.keys(translations[lang]).sort(), `data/translations/${lang}.json`).toEqual(jaKeys);
    }
    for (const [key, value] of Object.entries(translations.ja)) {
      expect(value.trim().length, `data/translations/ja.json:${key}`).toBeGreaterThan(0);
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

  it("non-Bulgarian-script data labels contain no leaked Cyrillic", () => {
    for (const [name, map] of symmetricMaps) {
      for (const loc of NON_BG_SCRIPT_LOCALES) {
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
      for (const loc of NON_BG_SCRIPT_LOCALES) {
        expect(CYRILLIC.test(byLocale[loc]), `roleLabels.${role}.${loc}: "${byLocale[loc]}"`).toBe(
          false
        );
      }
    }
  });

  it("source-title translations keep matching keys across translated locales", () => {
    // bg intentionally keeps the original titles (empty map); translated locales localize them.
    const enKeys = Object.keys(sourceTitleLabels.en).sort();
    const deKeys = Object.keys(sourceTitleLabels.de).sort();
    const frKeys = Object.keys(sourceTitleLabels.fr).sort();
    const itKeys = Object.keys(sourceTitleLabels.it).sort();
    const trKeys = Object.keys(sourceTitleLabels.tr).sort();
    const esKeys = Object.keys(sourceTitleLabels.es).sort();
    const elKeys = Object.keys(sourceTitleLabels.el).sort();
    const jaKeys = Object.keys(sourceTitleLabels.ja).sort();
    expect(deKeys, "de source titles drift from en").toEqual(enKeys);
    expect(frKeys, "fr source titles drift from en").toEqual(enKeys);
    expect(itKeys, "it source titles drift from en").toEqual(enKeys);
    expect(trKeys, "tr source titles drift from en").toEqual(enKeys);
    expect(esKeys, "es source titles drift from en").toEqual(enKeys);
    expect(elKeys, "el source titles drift from en").toEqual(enKeys);
    expect(jaKeys, "ja source titles drift from en").toEqual(enKeys);
    for (const loc of NON_BG_SCRIPT_LOCALES) {
      for (const [key, value] of Object.entries(sourceTitleLabels[loc])) {
        expect(value.trim().length, `sourceTitleLabels.${loc}.${key} empty`).toBeGreaterThan(0);
      }
    }
  });
});

describe("route parity", () => {
  function routeFiles(locale: "en" | "ja") {
    const base = path.join(repoRoot, "apps/web/src/pages", locale);
    const walk = (dir: string): string[] =>
      fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return walk(full);
        return entry.isFile() ? [path.relative(base, full)] : [];
      });
    return walk(base).sort();
  }

  it("/ja has exact source route parity with /en", () => {
    expect(routeFiles("ja")).toEqual(routeFiles("en"));
  });
});

describe("localised routing", () => {
  it("builds the correct prefix for every locale and never an empty slug", () => {
    for (const path of ["/", "/projects", "/history/contribute"]) {
      expect(localizePath(path, "bg")).toBe(path);
      for (const loc of locales.filter((l) => l !== "bg")) {
        const expected = path === "/" ? `/${loc}` : `/${loc}${path}`;
        expect(localizePath(path, loc)).toBe(expected);
      }
    }
  });

  it("detects the locale from a URL and round-trips back to the logical path", () => {
    expect(getLangFromUrl("/de/projects")).toBe("de");
    expect(getLangFromUrl("/fr/history")).toBe("fr");
    expect(getLangFromUrl("/it/mayors")).toBe("it");
    expect(getLangFromUrl("/tr/places")).toBe("tr");
    expect(getLangFromUrl("/es/projects")).toBe("es");
    expect(getLangFromUrl("/el/history")).toBe("el");
    expect(getLangFromUrl("/ja/history")).toBe("ja");
    expect(getLangFromUrl("/en/history")).toBe("en");
    expect(getLangFromUrl("/projects")).toBe("bg");
    expect(delocalizePath("/ja/projects")).toBe("/projects");
    expect(delocalizePath("/el/projects")).toBe("/projects");
    expect(delocalizePath("/de/projects")).toBe("/projects");
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
    expect(field(record, "summary", "ja")).toBe("English");
    expect(field({ summary_ja: "日本語", ...record }, "summary", "ja")).toBe("日本語");
  });

  it("maps every supported language to an Intl locale", () => {
    expect(localeForLang("bg")).toBe("bg-BG");
    expect(localeForLang("en")).toBe("en-GB");
    expect(localeForLang("de")).toBe("de-DE");
    expect(localeForLang("fr")).toBe("fr-FR");
    expect(localeForLang("it")).toBe("it-IT");
    expect(localeForLang("tr")).toBe("tr-TR");
    expect(localeForLang("es")).toBe("es-ES");
    expect(localeForLang("el")).toBe("el-GR");
    expect(localeForLang("ja")).toBe("ja-JP");
  });
});
