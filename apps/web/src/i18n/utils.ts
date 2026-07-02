import { defaultLang, languages, ui, type Lang } from "./ui";
import { translateEn } from "./deTranslations";

export { ui, languages, defaultLang };
export type { Lang };

/** All locale codes, e.g. ["bg", "en", "de"]. */
export const localeCodes = Object.keys(languages) as Lang[];

/** Locales served under a URL prefix (everything except the root default). */
export const prefixedLocales = localeCodes.filter((code) => code !== defaultLang);

const intlLocaleByLang: Record<Lang, string> = {
  bg: "bg-BG",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  tr: "tr-TR",
  es: "es-ES",
  el: "el-GR",
  ja: "ja-JP"
};
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

/** Browser/Intl locale for sorting, case folding and number/date formatting. */
export function localeForLang(lang: Lang): string {
  return intlLocaleByLang[lang];
}

/** Detect the active locale from a real pathname / URL. */
export function getLangFromUrl(url: URL | string): Lang {
  const pathname = typeof url === "string" ? url : url.pathname;
  const first = pathname.split("/").filter(Boolean)[0] ?? "";
  return (prefixedLocales as string[]).includes(first) ? (first as Lang) : defaultLang;
}

/** Convenience accessor for a locale's string table. */
export function useTranslations(lang: Lang) {
  return ui[lang];
}

/**
 * Turn a logical (default-locale) path such as "/projects" into the real href
 * for a given locale. The default locale lives at the root; every other locale
 * lives under its own prefix (e.g. "/en/projects", "/de/projects").
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

/** Remove any locale prefix from a real pathname to recover the logical path. */
export function delocalizePath(pathname: string): string {
  for (const lang of prefixedLocales) {
    if (pathname === `/${lang}` || pathname === `/${lang}/`) return "/";
    if (pathname.startsWith(`/${lang}/`)) return pathname.slice(lang.length + 1);
  }
  return pathname || "/";
}

/**
 * Read a localized field from a data record, e.g. field(project, "summary", lang)
 * returns summary_<lang> when present. Non-default locales without their own
 * translation fall back to English, then to the Bulgarian source value or older
 * unsuffixed source fields, so a German page prefers EN over BG when both exist.
 */
export function field(
  record: Record<string, unknown> | null | undefined,
  base: string,
  lang: Lang
): string {
  if (!record) return "";
  const localized = record[`${base}_${lang}`];
  if (typeof localized === "string" && localized.length > 0) return localized;
  // The unsuffixed field is the Bulgarian source value — on the default locale
  // it beats the English translation (e.g. sources.json `used_for`/`used_for_en`).
  if (lang === defaultLang) {
    const bulgarianSource = record[base];
    if (typeof bulgarianSource === "string" && bulgarianSource.length > 0) return bulgarianSource;
  }
  const english = record[`${base}_en`];
  if (typeof english === "string" && english.length > 0) {
    return shouldTranslateField(record, base) ? translateEn(english, lang) ?? english : english;
  }
  const fallback = record[`${base}_bg`];
  if (typeof fallback === "string" && fallback.length > 0) return fallback;
  const legacy = record[base];
  return typeof legacy === "string" ? legacy : "";
}
