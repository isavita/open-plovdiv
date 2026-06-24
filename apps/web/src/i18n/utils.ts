import { defaultLang, languages, ui, type Lang } from "./ui";

export { ui, languages, defaultLang };
export type { Lang };

/** All locale codes, e.g. ["bg", "en", "de"]. */
export const localeCodes = Object.keys(languages) as Lang[];

/** Locales served under a URL prefix (everything except the root default). */
export const prefixedLocales = localeCodes.filter((code) => code !== defaultLang);

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
 * Turn a logical (default-locale) path such as "/budget" into the real href
 * for a given locale. The default locale lives at the root; every other locale
 * lives under its own prefix (e.g. "/en/budget", "/de/budget").
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
 * translation fall back to English, then to the Bulgarian source value, so a
 * German page never shows an empty label and prefers EN over BG when both exist.
 */
export function field(
  record: Record<string, unknown>,
  base: string,
  lang: Lang
): string {
  const localized = record[`${base}_${lang}`];
  if (typeof localized === "string" && localized.length > 0) return localized;
  const english = record[`${base}_en`];
  if (typeof english === "string" && english.length > 0) return english;
  const fallback = record[`${base}_bg`];
  return typeof fallback === "string" ? fallback : "";
}
