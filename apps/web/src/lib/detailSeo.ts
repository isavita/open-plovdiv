import type { Lang } from "@i18n/ui";

/** Distinguish repeated generic summaries using the record's own name. */
export function placeSeoDescription(name: string, summary: string, duplicated: boolean, lang: Lang): string {
  if ((lang !== "bg" && lang !== "en") || !duplicated || !name.trim() || !summary.trim()) return summary;
  if (summary.toLocaleLowerCase().includes(name.trim().toLocaleLowerCase())) return summary;
  return `${name.trim()} — ${summary.trim()}`;
}

/** Clarify a separate neighbourhood or project when it shares a place title. */
export function contextualEntitySeoTitle(name: string, kind: "neighbourhood" | "project", duplicated: boolean, lang: Lang): string {
  if (!duplicated || (lang !== "bg" && lang !== "en")) return name;
  const context = kind === "neighbourhood"
    ? lang === "bg" ? "квартал в Пловдив" : "Plovdiv neighbourhood"
    : lang === "bg" ? "проект в Пловдив" : "Plovdiv project";
  return `${name} — ${context}`;
}

/** The archive contains separate records for separate terms, not duplicate people. */
export function mayorTermSeoTitle(
  name: string,
  yearStart: number,
  yearEnd: number | null | undefined,
  acting: boolean,
  lang: Lang
): string {
  if (lang !== "bg" && lang !== "en") return name;
  const role = lang === "bg"
    ? acting ? "и.д. кмет на Пловдив" : "кмет на Пловдив"
    : acting ? "Acting Mayor of Plovdiv" : "Mayor of Plovdiv";
  // An absent end year is open-ended; do not claim a current end date.
  const years = yearEnd == null ? "" : yearEnd === yearStart ? ` (${yearStart})` : ` (${yearStart}–${yearEnd})`;
  return `${name} — ${role}${years}`;
}
