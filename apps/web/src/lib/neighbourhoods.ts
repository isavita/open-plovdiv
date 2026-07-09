import neighbourhoodHistoriesJson from "../../../../data/curated/neighbourhood-histories.json";
import { withTranslatedFields } from "../i18n/deTranslations";
import { walkingRoutes, type WalkingRoute } from "./routes";

/**
 * The neighbourhood-histories layer: quarter-level records that tie the
 * knowledge base together by place — each record links existing place,
 * story and route ids and carries its own sourced timeline and name-origin
 * notes. Boundaries are deliberately NOT drawn: `center` is an approximate
 * anchor and every consumer must say so.
 *
 * Source data lives in data/curated/neighbourhood-histories.json (BG+EN,
 * other locales baked by the shared translation maps).
 */

export type NeighbourhoodEraTag = "ottoman" | "revival" | "modern" | "socialist";
export type NeighbourhoodArea = "centre" | "north" | "east" | "south" | "west";

export type NeighbourhoodTimelineEntry = {
  year: number;
  display_bg: string;
  display_en: string;
  title_bg: string;
  title_en: string;
  body_bg: string;
  body_en: string;
};

export type NeighbourhoodAltName = {
  name_bg: string;
  name_en: string;
  note_bg?: string;
  note_en?: string;
};

export type NeighbourhoodFabricKind = "people" | "community" | "industry" | "institution" | "faith";

export type NeighbourhoodFabricEntry = {
  kind: NeighbourhoodFabricKind;
  name_bg: string;
  name_en: string;
  note_bg: string;
  note_en: string;
  place_id?: string;
};

export type NeighbourhoodVisit = {
  see_bg: string;
  see_en: string;
  time_bg: string;
  time_en: string;
  best_bg: string;
  best_en: string;
  food_bg: string;
  food_en: string;
  respect_bg?: string;
  respect_en?: string;
};

export type NeighbourhoodHistory = {
  id: string;
  name_bg: string;
  name_en: string;
  tagline_bg: string;
  tagline_en: string;
  summary_bg: string;
  summary_en: string;
  why_bg: string;
  why_en: string;
  alt_names?: NeighbourhoodAltName[];
  fabric?: NeighbourhoodFabricEntry[];
  visit: NeighbourhoodVisit;
  era_tags: NeighbourhoodEraTag[];
  area: NeighbourhoodArea;
  district_bg: string;
  center: { lat: number; lng: number };
  approximate: true;
  anchor_place_id?: string | null;
  name_origin_bg: string;
  name_origin_en: string;
  coverage_note_bg?: string;
  coverage_note_en?: string;
  timeline: NeighbourhoodTimelineEntry[];
  place_ids: string[];
  story_ids: string[];
  route_ids: string[];
  getting_there_bg: string;
  getting_there_en: string;
  sources: Array<{ title: string; url: string; accessed_at: string }>;
  data_quality: string;
  updated_at: string;
};

export const neighbourhoodHistories = withTranslatedFields(
  neighbourhoodHistoriesJson
) as NeighbourhoodHistory[];

export const neighbourhoodById: Map<string, NeighbourhoodHistory> = new Map(
  neighbourhoodHistories.map((neighbourhood) => [neighbourhood.id, neighbourhood])
);

/** Display order of the era filter chips (matches the city-growth map). */
export const neighbourhoodEraOrder: NeighbourhoodEraTag[] = [
  "ottoman",
  "revival",
  "modern",
  "socialist"
];

/** Era accent colours shared with the /history city-growth map. */
export const neighbourhoodEraColors: Record<NeighbourhoodEraTag, string> = {
  ottoman: "#2f7d6b",
  revival: "#b4632a",
  modern: "#15657f",
  socialist: "#8a6d3b"
};

/** Display order of the area filter chips. */
export const neighbourhoodAreaOrder: NeighbourhoodArea[] = [
  "centre",
  "north",
  "east",
  "south",
  "west"
];

/**
 * Walking routes connected to a neighbourhood: the explicitly curated
 * route_ids plus any route with a stop at one of the neighbourhood's places.
 */
export function neighbourhoodRoutes(neighbourhood: NeighbourhoodHistory): WalkingRoute[] {
  const placeIds = new Set(neighbourhood.place_ids);
  const ids = new Set(neighbourhood.route_ids);
  for (const route of walkingRoutes) {
    if (route.stops.some((stop) => placeIds.has(stop.place_id))) ids.add(route.id);
  }
  return walkingRoutes.filter((route) => ids.has(route.id));
}

/** Neighbourhoods that list a given place among their key places. */
export function neighbourhoodsOfPlace(placeId: string): NeighbourhoodHistory[] {
  return neighbourhoodHistories.filter(
    (neighbourhood) =>
      neighbourhood.place_ids.includes(placeId) || neighbourhood.anchor_place_id === placeId
  );
}
