import deTranslationsJson from "../../../../data/translations/de.json";
import frTranslationsJson from "../../../../data/translations/fr.json";
import itTranslationsJson from "../../../../data/translations/it.json";
import trTranslationsJson from "../../../../data/translations/tr.json";
import esTranslationsJson from "../../../../data/translations/es.json";
import elTranslationsJson from "../../../../data/translations/el.json";
import jaTranslationsJson from "../../../../data/translations/ja.json";
import type { Lang } from "./ui";

type TranslationLang = Extract<Lang, "de" | "fr" | "it" | "tr" | "es" | "el" | "ja">;

const translationsByLang: Record<TranslationLang, Record<string, string>> = {
  de: deTranslationsJson as Record<string, string>,
  fr: frTranslationsJson as Record<string, string>,
  it: itTranslationsJson as Record<string, string>,
  tr: trTranslationsJson as Record<string, string>,
  es: esTranslationsJson as Record<string, string>,
  el: elTranslationsJson as Record<string, string>,
  ja: jaTranslationsJson as Record<string, string>
};
const translatedFieldLangs = Object.keys(translationsByLang) as TranslationLang[];
const protectedFieldBases = new Set(["actor", "architect", "birthplace", "builder"]);

function isPersonLikeRecord(record: Record<string, unknown>): boolean {
  return (
    record.type === "person" ||
    String(record.id ?? "").startsWith("person-") ||
    String(record.id ?? "").startsWith("notable-person-") ||
    Array.isArray(record.roles) ||
    "birth_year" in record ||
    "death_year" in record
  );
}

function shouldTranslateField(record: Record<string, unknown>, base: string): boolean {
  if (protectedFieldBases.has(base)) return false;
  if (base === "name" && isPersonLikeRecord(record)) return false;
  return true;
}

export function translateEnToDe(value: string | null | undefined): string | null {
  return translateEn(value, "de");
}

export function translateEn(value: string | null | undefined, lang: Lang): string | null {
  if (!value) return null;
  if (!(lang in translationsByLang)) return null;
  return translationsByLang[lang as TranslationLang][value.trim()] ?? null;
}

export function translateText(value: string, lang: Lang): string {
  return translateEn(value, lang) ?? value;
}

export function withTranslatedFields<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => withTranslatedFields(item)) as T;
  if (!value || typeof value !== "object") return value;

  const record = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(record)) out[key] = withTranslatedFields(child);

  for (const [key, child] of Object.entries(record)) {
    if (!key.endsWith("_en") || typeof child !== "string") continue;
    const base = key.slice(0, -3);
    if (!shouldTranslateField(record, base)) continue;
    for (const lang of translatedFieldLangs) {
      const translatedKey = `${base}_${lang}`;
      if (typeof out[translatedKey] === "string" && String(out[translatedKey]).trim()) continue;
      const translated = translateEn(child, lang);
      if (translated) out[translatedKey] = translated;
    }
  }

  for (const key of ["title", "label"]) {
    const child = record[key];
    if (typeof child !== "string") continue;
    for (const lang of translatedFieldLangs) {
      const translatedKey = `${key}_${lang}`;
      if (typeof out[translatedKey] === "string" && String(out[translatedKey]).trim()) continue;
      const translated = translateEn(child, lang);
      if (translated) out[translatedKey] = translated;
    }
  }

  return out as T;
}

export const withGermanFields = withTranslatedFields;
