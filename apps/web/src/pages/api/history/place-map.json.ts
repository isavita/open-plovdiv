import type { APIRoute } from "astro";
import { knownHistoryLabel } from "@lib/format";
import { json } from "@lib/server/http";
import {
  historicalArchiveItems,
  historyKnowledgePlaces,
  thenNowPairs
} from "@lib/data";
import { localeForLang, type Lang } from "@i18n/utils";

export const prerender = true;

const categoryLabels: Record<string, Record<Lang, string>> = {
  civic: { bg: "Градска среда", en: "Civic", de: "Stadtraum", fr: "Espace urbain", it: "Spazio urbano", tr: "Kentsel alan", es: "Espacio urbano", el: "Αστικός χώρος" },
  hill: { bg: "Хълм", en: "Hill", de: "Hügel", fr: "Colline", it: "Colle", tr: "Tepe", es: "Colina", el: "Λόφος" },
  medieval: { bg: "Средновековие", en: "Medieval", de: "Mittelalterlich", fr: "Médiéval", it: "Medievale", tr: "Orta Çağ", es: "Medieval", el: "Μεσαιωνικό" },
  monument: { bg: "Паметник", en: "Monument", de: "Denkmal", fr: "Monument", it: "Monumento", tr: "Anıt", es: "Monumento", el: "Μνημείο" },
  ottoman: { bg: "Османски пласт", en: "Ottoman", de: "Osmanisch", fr: "Ottoman", it: "Ottomano", tr: "Osmanlı", es: "Otomano", el: "Οθωμανικό" },
  religious: { bg: "Религиозен обект", en: "Religious", de: "Religiöser Ort", fr: "Site religieux", it: "Sito religioso", tr: "Dinî yapı", es: "Sitio religioso", el: "Θρησκευτικός χώρος" },
  revival: { bg: "Възраждане", en: "Revival", de: "Wiedergeburtszeit", fr: "Renaissance nationale", it: "Rinascita nazionale", tr: "Ulusal Uyanış", es: "Renacimiento Nacional", el: "Εθνική Αναγέννηση" },
  roman: { bg: "Римски пласт", en: "Roman", de: "Römisch", fr: "Romain", it: "Romano", tr: "Roma", es: "Romano", el: "Ρωμαϊκό" },
  thracian: { bg: "Тракийски пласт", en: "Thracian", de: "Thrakisch", fr: "Thrace", it: "Tracio", tr: "Trak", es: "Tracio", el: "Θρακικό" }
};

const placeColors: Record<string, string> = {
  thracian: "#9c6b3f",
  roman: "#a23b2d",
  medieval: "#5d6b8a",
  ottoman: "#2f7d6b",
  revival: "#b4632a",
  religious: "#7d5a9c",
  hill: "#7d8471",
  civic: "#15657f",
  monument: "#8a6d3b"
};

const archiveCountByPlace = new Map<string, number>();
const pairCountByPlace = new Map<string, number>();

for (const item of historicalArchiveItems) {
  archiveCountByPlace.set(item.place_id, (archiveCountByPlace.get(item.place_id) ?? 0) + 1);
}
for (const pair of thenNowPairs) {
  pairCountByPlace.set(pair.place_id, (pairCountByPlace.get(pair.place_id) ?? 0) + 1);
}

function localized(record: Record<string, any>, base: string, lang: Lang): string {
  return knownHistoryLabel(String(record[`${base}_${lang}`] ?? record[`${base}_en`] ?? record[`${base}_bg`] ?? ""), lang);
}

function categoryLabel(category: string, lang: Lang): string {
  return categoryLabels[category]?.[lang] ?? category.replaceAll("_", " ");
}

function placeMapItems(lang: Lang) {
  const locale = localeForLang(lang);
  return [...historyKnowledgePlaces]
    .filter((place) => place.coordinates)
    .map((place) => ({
      lat: place.coordinates.lat,
      lng: place.coordinates.lng,
      name: localized(place, "name", lang),
      category: place.category,
      era: place.era,
      catLabel: categoryLabel(place.category, lang),
      href: lang === "bg" ? `/places/${place.id}` : `/${lang}/places/${place.id}`,
      color: placeColors[place.category] ?? "#6b7280",
      archive: (archiveCountByPlace.get(place.id) ?? 0) > 0,
      thenNow: (pairCountByPlace.get(place.id) ?? 0) > 0,
      search: [
        localized(place, "name", lang),
        localized(place, "summary", lang),
        localized(place, "current_status", lang),
        localized(place, "era", lang),
        categoryLabel(place.category, lang)
      ]
        .join(" ")
        .toLocaleLowerCase(locale)
    }));
}

const places = {
  bg: placeMapItems("bg"),
  en: placeMapItems("en"),
  de: placeMapItems("de"),
  fr: placeMapItems("fr"),
  it: placeMapItems("it"),
  tr: placeMapItems("tr"),
  es: placeMapItems("es"),
  el: placeMapItems("el")
};

export const GET: APIRoute = () =>
  json({ count: historyKnowledgePlaces.filter((place) => place.coordinates).length, places }, 200, {
    "Cache-Control": "public, max-age=300"
  });
