import type { APIRoute } from "astro";
import { commonsImageUrl } from "@lib/commons";
import { knownHistoryLabel, sourceTitle } from "@lib/format";
import { json } from "@lib/server/http";
import { thenNowCountByPlace } from "@lib/thenNow";
import {
  historicalArchiveItems,
  historyKnowledgeEvents,
  historyKnowledgePlaces,
  historyKnowledgeSources,
  thenNowPairs,
  type KnowledgePlace
} from "@lib/data";
import { localeForLang, type Lang } from "@i18n/utils";

export const prerender = true;

const categoryLabels: Record<string, Record<Lang, string>> = {
  civic: { bg: "Градска среда", en: "Civic", de: "Stadtraum", fr: "Espace urbain", it: "Spazio urbano", tr: "Kentsel alan", es: "Espacio urbano", el: "Αστικός χώρος", ja: "都市空間" },
  hill: { bg: "Хълм", en: "Hill", de: "Hügel", fr: "Colline", it: "Colle", tr: "Tepe", es: "Colina", el: "Λόφος", ja: "丘" },
  medieval: { bg: "Средновековие", en: "Medieval", de: "Mittelalterlich", fr: "Médiéval", it: "Medievale", tr: "Orta Çağ", es: "Medieval", el: "Μεσαιωνικό", ja: "中世" },
  monument: { bg: "Паметник", en: "Monument", de: "Denkmal", fr: "Monument", it: "Monumento", tr: "Anıt", es: "Monumento", el: "Μνημείο", ja: "記念碑" },
  ottoman: { bg: "Османски пласт", en: "Ottoman", de: "Osmanisch", fr: "Ottoman", it: "Ottomano", tr: "Osmanlı", es: "Otomano", el: "Οθωμανικό", ja: "オスマン層" },
  religious: { bg: "Религиозен обект", en: "Religious", de: "Religiöser Ort", fr: "Site religieux", it: "Sito religioso", tr: "Dinî yapı", es: "Sitio religioso", el: "Θρησκευτικός χώρος", ja: "宗教施設" },
  revival: { bg: "Възраждане", en: "Revival", de: "Wiedergeburtszeit", fr: "Renaissance nationale", it: "Rinascita nazionale", tr: "Ulusal Uyanış", es: "Renacimiento Nacional", el: "Εθνική Αναγέννηση", ja: "民族復興期" },
  roman: { bg: "Римски пласт", en: "Roman", de: "Römisch", fr: "Romain", it: "Romano", tr: "Roma", es: "Romano", el: "Ρωμαϊκό", ja: "ローマ層" },
  thracian: { bg: "Тракийски пласт", en: "Thracian", de: "Thrakisch", fr: "Thrace", it: "Tracio", tr: "Trak", es: "Tracio", el: "Θρακικό", ja: "トラキア層" }
};

const labels: Record<Lang, Record<string, string>> = {
  bg: {
    built: "Дата/строеж",
    architect: "Архитект",
    builder: "Строител",
    creator: "Архитект/строител"
  },
  en: {
    built: "Built/date",
    architect: "Architect",
    builder: "Builder",
    creator: "Architect/builder"
  },
  de: {
    built: "Bauzeit/Datum",
    architect: "Architekt",
    builder: "Bauherr",
    creator: "Architekt/Bauherr"
  },
  fr: {
    built: "Construction/date",
    architect: "Architecte",
    builder: "Constructeur",
    creator: "Architecte/constructeur"
  },
  it: {
    built: "Costruzione/data",
    architect: "Architetto",
    builder: "Costruttore",
    creator: "Architetto/costruttore"
  },
  tr: {
    built: "Yapım/tarih",
    architect: "Mimar",
    builder: "Yapımcı",
    creator: "Mimar/yapımcı"
  },
  es: {
    built: "Construcción/fecha",
    architect: "Arquitecto",
    builder: "Constructor",
    creator: "Arquitecto/constructor"
  },
  el: {
    built: "Κατασκευή/ημερομηνία",
    architect: "Αρχιτέκτονας",
    builder: "Κατασκευαστής",
    creator: "Αρχιτέκτονας/κατασκευαστής"
  },
  ja: {
    built: "建設・年代",
    architect: "建築家",
    builder: "施工者",
    creator: "建築家・施工者"
  }
};

function localized(record: Record<string, any>, base: string, lang: Lang): string {
  return knownHistoryLabel(String(record[`${base}_${lang}`] ?? record[`${base}_en`] ?? record[`${base}_bg`] ?? ""), lang);
}

function categoryLabel(category: string, lang: Lang): string {
  return categoryLabels[category]?.[lang] ?? category.replaceAll("_", " ");
}

function placeFacts(place: KnowledgePlace, lang: Lang) {
  const hasNamedCreator = Boolean(localized(place, "architect", lang) || localized(place, "builder", lang));
  return [
    localized(place.date_context, "display", lang)
      ? { label: labels[lang].built, value: localized(place.date_context, "display", lang) }
      : null,
    localized(place, "architect", lang) ? { label: labels[lang].architect, value: localized(place, "architect", lang) } : null,
    localized(place, "builder", lang) ? { label: labels[lang].builder, value: localized(place, "builder", lang) } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;
}

const sourceById = new Map(historyKnowledgeSources.map((source) => [source.id, source]));
const archiveCountByPlace = new Map<string, number>();
const pairCountByPlace = thenNowCountByPlace(thenNowPairs);
const eventCountByPlace = new Map<string, number>();

for (const item of historicalArchiveItems) archiveCountByPlace.set(item.place_id, (archiveCountByPlace.get(item.place_id) ?? 0) + 1);
for (const event of historyKnowledgeEvents) {
  for (const placeId of event.place_ids) eventCountByPlace.set(placeId, (eventCountByPlace.get(placeId) ?? 0) + 1);
}

function placeCards(lang: Lang) {
  const locale = localeForLang(lang);
  return [...historyKnowledgePlaces]
    .sort((a, b) => localized(a, "name", lang).localeCompare(localized(b, "name", lang), locale))
    .map((place) => {
      const source = sourceById.get(place.source_ids[0]);
      const facts = placeFacts(place, lang);
      const archiveCount = archiveCountByPlace.get(place.id) ?? 0;
      const pairCount = pairCountByPlace.get(place.id) ?? 0;
      const eventCount = eventCountByPlace.get(place.id) ?? 0;
      const search = [
        localized(place, "name", lang),
        localized(place, "summary", lang),
        localized(place, "current_status", lang),
        localized(place, "era", lang),
        categoryLabel(place.category, lang),
        ...facts.map((fact) => fact.value)
      ].join(" ").toLocaleLowerCase(locale);

      return {
        id: place.id,
        href: lang === "bg" ? `/places/${place.id}` : `/${lang}/places/${place.id}`,
        className: `place-card landmark-${place.category}`,
        category: place.category,
        era: place.era,
        eraLabel: localized(place, "era", lang),
        categoryLabel: categoryLabel(place.category, lang),
        name: localized(place, "name", lang),
        summary: localized(place, "summary", lang),
        search,
        facts,
        eventCount,
        archiveCount,
        pairCount,
        media: place.media?.[0]
          ? {
              src: commonsImageUrl(place.media[0].url, 500),
              credit: `${place.media[0].credit} · ${place.media[0].license}`,
              licenseUrl: place.media[0].license_url
            }
          : null,
        source: source
          ? {
              url: source.url,
              title: sourceTitle(localized(source, "title", lang), lang)
            }
          : null
      };
    });
}

const cards = {
  bg: placeCards("bg"),
  en: placeCards("en"),
  de: placeCards("de"),
  fr: placeCards("fr"),
  it: placeCards("it"),
  tr: placeCards("tr"),
  es: placeCards("es"),
  el: placeCards("el"),
  ja: placeCards("ja")
};

export const GET: APIRoute = () =>
  json({ count: historyKnowledgePlaces.length, cards }, 200, { "Cache-Control": "public, max-age=300" });
