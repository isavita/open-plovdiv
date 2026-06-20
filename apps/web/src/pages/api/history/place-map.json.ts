import type { APIRoute } from "astro";
import { json } from "@lib/server/http";
import {
  historicalArchiveItems,
  historyKnowledgePlaces,
  thenNowPairs
} from "@lib/data";
import type { Lang } from "@i18n/utils";

export const prerender = true;

const categoryLabels: Record<string, { bg: string; en: string }> = {
  civic: { bg: "Градска среда", en: "Civic" },
  hill: { bg: "Хълм", en: "Hill" },
  medieval: { bg: "Средновековие", en: "Medieval" },
  monument: { bg: "Паметник", en: "Monument" },
  ottoman: { bg: "Османски пласт", en: "Ottoman" },
  religious: { bg: "Религиозен обект", en: "Religious" },
  revival: { bg: "Възраждане", en: "Revival" },
  roman: { bg: "Римски пласт", en: "Roman" },
  thracian: { bg: "Тракийски пласт", en: "Thracian" }
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
  return String(record[`${base}_${lang}`] ?? record[`${base}_bg`] ?? "");
}

function categoryLabel(category: string, lang: Lang): string {
  return categoryLabels[category]?.[lang] ?? category.replaceAll("_", " ");
}

function placeMapItems(lang: Lang) {
  return [...historyKnowledgePlaces]
    .filter((place) => place.coordinates)
    .map((place) => ({
      lat: place.coordinates.lat,
      lng: place.coordinates.lng,
      name: localized(place, "name", lang),
      category: place.category,
      era: place.era,
      catLabel: categoryLabel(place.category, lang),
      href: lang === "bg" ? `/places/${place.id}` : `/en/places/${place.id}`,
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
        .toLocaleLowerCase(lang === "bg" ? "bg-BG" : "en-GB")
    }));
}

const places = {
  bg: placeMapItems("bg"),
  en: placeMapItems("en")
};

export const GET: APIRoute = () =>
  json({ count: historyKnowledgePlaces.filter((place) => place.coordinates).length, places }, 200, {
    "Cache-Control": "public, max-age=300"
  });
