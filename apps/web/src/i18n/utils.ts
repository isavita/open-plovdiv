import { defaultLang, languages, ui, type Lang } from "./ui";

export { ui, languages, defaultLang };
export type { Lang };

/** Detect the active locale from a real pathname / URL. */
export function getLangFromUrl(url: URL | string): Lang {
  const pathname = typeof url === "string" ? url : url.pathname;
  const first = pathname.split("/").filter(Boolean)[0];
  return first === "en" ? "en" : "bg";
}

/** Convenience accessor for a locale's string table. */
export function useTranslations(lang: Lang) {
  return ui[lang];
}

/**
 * Turn a logical (default-locale) path such as "/budget" into the real href
 * for a given locale. The default locale lives at the root, English under /en.
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === "/" ? "/en" : `/en${clean}`;
}

/** Remove the locale prefix from a real pathname to recover the logical path. */
export function delocalizePath(pathname: string): string {
  if (pathname === "/en" || pathname === "/en/") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname || "/";
}

/**
 * Read a localized field from a data record, e.g. field(project, "summary", lang)
 * returns summary_en when present, otherwise falls back to the Bulgarian value.
 */
export function field(
  record: Record<string, unknown>,
  base: string,
  lang: Lang
): string {
  const localized = record[`${base}_${lang}`];
  if (typeof localized === "string" && localized.length > 0) return localized;
  const fallback = record[`${base}_bg`];
  return typeof fallback === "string" ? fallback : "";
}
