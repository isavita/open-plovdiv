import type { APIRoute } from "astro";
import { knownHistoryLabel } from "@lib/format";
import { json } from "@lib/server/http";
import { thenNowCountByPlace } from "@lib/thenNow";
import {
  historicalArchiveItems,
  historyKnowledgePlaces,
  thenNowPairs
} from "@lib/data";
import { localeForLang, type Lang } from "@i18n/utils";
import { fallbackPlaceColor, placeColors } from "@lib/placeCategories";

export const prerender = true;

const categoryLabels: Record<string, Record<Lang, string>> = {
  civic: { bg: "Градска среда", en: "Civic", de: "Stadtraum", fr: "Espace urbain", it: "Spazio urbano", tr: "Kentsel alan", es: "Espacio urbano", el: "Αστικός χώρος", ja: "都市空間", tl: "Pampublikong espasyo", uk: "Міське середовище", ru: "Городская среда", pl: "Przestrzeń miejska" },
  hill: { bg: "Хълм", en: "Hill", de: "Hügel", fr: "Colline", it: "Colle", tr: "Tepe", es: "Colina", el: "Λόφος", ja: "丘", tl: "Burol", uk: "Пагорб", ru: "Холм", pl: "Wzgórze" },
  medieval: { bg: "Средновековие", en: "Medieval", de: "Mittelalterlich", fr: "Médiéval", it: "Medievale", tr: "Orta Çağ", es: "Medieval", el: "Μεσαιωνικό", ja: "中世", tl: "Medyebal", uk: "Середньовіччя", ru: "Средневековье", pl: "Średniowiecze" },
  monument: { bg: "Паметник", en: "Monument", de: "Denkmal", fr: "Monument", it: "Monumento", tr: "Anıt", es: "Monumento", el: "Μνημείο", ja: "記念碑", tl: "Monumento", uk: "Пам'ятник", ru: "Памятник", pl: "Pomnik" },
  ottoman: { bg: "Османски пласт", en: "Ottoman", de: "Osmanisch", fr: "Ottoman", it: "Ottomano", tr: "Osmanlı", es: "Otomano", el: "Οθωμανικό", ja: "オスマン層", tl: "Ottoman", uk: "Османський пласт", ru: "Османский пласт", pl: "Warstwa osmańska" },
  religious: { bg: "Религиозен обект", en: "Religious", de: "Religiöser Ort", fr: "Site religieux", it: "Sito religioso", tr: "Dinî yapı", es: "Sitio religioso", el: "Θρησκευτικός χώρος", ja: "宗教施設", tl: "Relihiyoso", uk: "Релігійний об'єкт", ru: "Религиозный объект", pl: "Obiekt religijny" },
  revival: { bg: "Възраждане", en: "Revival", de: "Wiedergeburtszeit", fr: "Renaissance nationale", it: "Rinascita nazionale", tr: "Ulusal Uyanış", es: "Renacimiento Nacional", el: "Εθνική Αναγέννηση", ja: "民族復興期", tl: "Pambansang Muling Pagsilang", uk: "Відродження", ru: "Возрождение", pl: "Odrodzenie narodowe" },
  roman: { bg: "Римски пласт", en: "Roman", de: "Römisch", fr: "Romain", it: "Romano", tr: "Roma", es: "Romano", el: "Ρωμαϊκό", ja: "ローマ層", tl: "Romano", uk: "Римський пласт", ru: "Римский пласт", pl: "Warstwa rzymska" },
  thracian: { bg: "Тракийски пласт", en: "Thracian", de: "Thrakisch", fr: "Thrace", it: "Tracio", tr: "Trak", es: "Tracio", el: "Θρακικό", ja: "トラキア層", tl: "Trakiano", uk: "Фракійський пласт", ru: "Фракийский пласт", pl: "Warstwa tracka" }
};

const archiveCountByPlace = new Map<string, number>();
const pairCountByPlace = thenNowCountByPlace(thenNowPairs);

for (const item of historicalArchiveItems) {
  archiveCountByPlace.set(item.place_id, (archiveCountByPlace.get(item.place_id) ?? 0) + 1);
}

function localized(record: Record<string, any>, base: string, lang: Lang): string {
  return knownHistoryLabel(String(record[`${base}_${lang}`] ?? record[`${base}_en`] ?? record[`${base}_bg`] ?? ""), lang);
}

function categoryLabel(category: string, lang: Lang): string {
  return categoryLabels[category]?.[lang] ?? category.replaceAll("_", " ");
}

type HistoryPlace = (typeof historyKnowledgePlaces)[number];
type MappedHistoryPlace = HistoryPlace & {
  coordinates: NonNullable<HistoryPlace["coordinates"]>;
};

function hasCoordinates(place: HistoryPlace): place is MappedHistoryPlace {
  return place.coordinates != null;
}

function placeMapItems(lang: Lang) {
  const locale = localeForLang(lang);
  return [...historyKnowledgePlaces]
    .filter(hasCoordinates)
    .map((place) => ({
      lat: place.coordinates.lat,
      lng: place.coordinates.lng,
      name: localized(place, "name", lang),
      category: place.category,
      era: place.era,
      catLabel: categoryLabel(place.category, lang),
      href: lang === "bg" ? `/places/${place.id}` : `/${lang}/places/${place.id}`,
      color: placeColors[place.category] ?? fallbackPlaceColor,
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

const places: Record<Lang, ReturnType<typeof placeMapItems>> = {
  bg: placeMapItems("bg"),
  en: placeMapItems("en"),
  de: placeMapItems("de"),
  fr: placeMapItems("fr"),
  it: placeMapItems("it"),
  tr: placeMapItems("tr"),
  es: placeMapItems("es"),
  el: placeMapItems("el"),
  ja: placeMapItems("ja"),
  tl: placeMapItems("tl"),
  uk: placeMapItems("uk"),
  ru: placeMapItems("ru"),
  pl: placeMapItems("pl")
};

export const GET: APIRoute = () =>
  json({ count: historyKnowledgePlaces.filter((place) => place.coordinates).length, places }, 200, {
    "Cache-Control": "public, max-age=300"
  });
