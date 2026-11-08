import type { Lang } from "@i18n/ui";

// These labels distinguish records that share a title; they describe the record
// type, rather than adding facts to the underlying content.
const context: Record<Lang, { neighbourhood: string; project: string; mayor: string; actingMayor: string }> = {
  bg: { neighbourhood: "квартал в Пловдив", project: "проект в Пловдив", mayor: "кмет на Пловдив", actingMayor: "и.д. кмет на Пловдив" },
  en: { neighbourhood: "Plovdiv neighbourhood", project: "Plovdiv project", mayor: "Mayor of Plovdiv", actingMayor: "Acting Mayor of Plovdiv" },
  de: { neighbourhood: "Stadtviertel in Plowdiw", project: "Projekt in Plowdiw", mayor: "Bürgermeister von Plowdiw", actingMayor: "kommissarischer Bürgermeister von Plowdiw" },
  fr: { neighbourhood: "quartier de Plovdiv", project: "projet à Plovdiv", mayor: "maire de Plovdiv", actingMayor: "maire par intérim de Plovdiv" },
  it: { neighbourhood: "quartiere di Plovdiv", project: "progetto a Plovdiv", mayor: "sindaco di Plovdiv", actingMayor: "sindaco facente funzione di Plovdiv" },
  tr: { neighbourhood: "Filibe semti", project: "Filibe projesi", mayor: "Filibe belediye başkanı", actingMayor: "Filibe belediye başkan vekili" },
  es: { neighbourhood: "barrio de Plovdiv", project: "proyecto en Plovdiv", mayor: "alcalde de Plovdiv", actingMayor: "alcalde interino de Plovdiv" },
  el: { neighbourhood: "συνοικία της Φιλιππούπολης", project: "έργο στη Φιλιππούπολη", mayor: "δήμαρχος Φιλιππούπολης", actingMayor: "ασκών καθήκοντα δημάρχου Φιλιππούπολης" },
  ja: { neighbourhood: "プロヴディフの地区", project: "プロヴディフの事業", mayor: "プロヴディフ市長", actingMayor: "プロヴディフ市長代理" },
  zh: { neighbourhood: "普罗夫迪夫街区", project: "普罗夫迪夫项目", mayor: "普罗夫迪夫市长", actingMayor: "普罗夫迪夫代理市长" },
  tl: { neighbourhood: "kapitbahayan sa Plovdiv", project: "proyekto sa Plovdiv", mayor: "alkalde ng Plovdiv", actingMayor: "pansamantalang alkalde ng Plovdiv" },
  uk: { neighbourhood: "район Пловдива", project: "проєкт у Пловдиві", mayor: "мер Пловдива", actingMayor: "виконувач обов’язків мера Пловдива" },
  ru: { neighbourhood: "район Пловдива", project: "проект в Пловдиве", mayor: "мэр Пловдива", actingMayor: "исполняющий обязанности мэра Пловдива" },
  pl: { neighbourhood: "dzielnica Płowdiwu", project: "projekt w Płowdiwie", mayor: "burmistrz Płowdiwu", actingMayor: "pełniący obowiązki burmistrza Płowdiwu" },
  pt: { neighbourhood: "bairro de Plovdiv", project: "projeto em Plovdiv", mayor: "presidente da Câmara Municipal de Plovdiv", actingMayor: "presidente interino da Câmara Municipal de Plovdiv" }
};

/** Distinguish repeated generic summaries using the record's own name. */
export function placeSeoDescription(name: string, summary: string, duplicated: boolean, lang: Lang): string {
  if (!duplicated || !name.trim() || !summary.trim()) return summary;
  if (summary.toLocaleLowerCase(lang).includes(name.trim().toLocaleLowerCase(lang))) return summary;
  return `${name.trim()} — ${summary.trim()}`;
}

/** Clarify a separate neighbourhood or project when it shares a place title. */
export function contextualEntitySeoTitle(name: string, kind: "neighbourhood" | "project", duplicated: boolean, lang: Lang): string {
  if (!duplicated) return name;
  return `${name} — ${context[lang][kind]}`;
}

/** The archive contains separate records for separate terms, not duplicate people. */
export function mayorTermSeoTitle(name: string, yearStart: number, yearEnd: number | null | undefined, acting: boolean, lang: Lang): string {
  const role = context[lang][acting ? "actingMayor" : "mayor"];
  // An absent end year is open-ended; do not claim a current end date.
  const years = yearEnd == null ? "" : yearEnd === yearStart ? ` (${yearStart})` : ` (${yearStart}–${yearEnd})`;
  return `${name} — ${role}${years}`;
}
