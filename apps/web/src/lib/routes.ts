import walkingRoutesJson from "../../../../data/curated/walking-routes.json";
import { withTranslatedFields } from "../i18n/deTranslations";

/**
 * The curated walking-route library shared across the site: the routes index
 * and the per-route pages render from it, while the places catalogue and
 * place detail pages use it to cross-link places to the routes that pass
 * through them. Stops reference existing `historyKnowledgePlaces` ids —
 * routes never introduce places or historical claims of their own; their own
 * text is visitor orientation (start/end guidance, terrain, caveats).
 *
 * Source data lives in data/curated/walking-routes.json (BG+EN, other locales
 * baked by the shared translation maps) and the committed walking geometry in
 * data/curated/route-geometry/<id>.json (OSRM foot profile + elevation).
 */

export type RouteCategory = "first-visit" | "history-layers" | "sacred" | "creative" | "nature";
export type RouteDurationBand = "short" | "half-day" | "full-day";
export type RouteDifficulty = "easy" | "moderate" | "steep";
export type RouteWheelchair = "good" | "partial" | "hard";
export type RoutePracticalKind =
  | "food"
  | "water"
  | "terrain"
  | "transit"
  | "luggage"
  | "toilets"
  | "shade"
  | "safety";

export type WalkingRouteStop = {
  place_id: string;
  minutes: number;
  note_bg: string;
  note_en: string;
  optional?: boolean;
};

export type WalkingRouteDetour = {
  place_id: string;
  note_bg: string;
  note_en: string;
};

export type WalkingRoute = {
  id: string;
  title_bg: string;
  title_en: string;
  short_title_bg: string;
  short_title_en: string;
  tagline_bg: string;
  tagline_en: string;
  summary_bg: string;
  summary_en: string;
  category: RouteCategory;
  duration_minutes: number;
  duration_band: RouteDurationBand;
  difficulty: RouteDifficulty;
  wheelchair: RouteWheelchair;
  wheelchair_note_bg?: string;
  wheelchair_note_en?: string;
  family_friendly: boolean;
  rainy_day_ok: boolean;
  transit_required: boolean;
  transit_note_bg?: string;
  transit_note_en?: string;
  best_time_bg?: string;
  best_time_en?: string;
  accent: string;
  story_id?: string;
  education_id?: string;
  stops: WalkingRouteStop[];
  detours?: WalkingRouteDetour[];
  start_guidance_bg: string;
  start_guidance_en: string;
  end_guidance_bg: string;
  end_guidance_en: string;
  practical: Array<{ kind: RoutePracticalKind; text_bg: string; text_en: string }>;
  caveats: Array<{ text_bg: string; text_en: string }>;
  data_quality: string;
  updated_at: string;
};

export type RouteGeometry = {
  route_id: string;
  provider: string;
  fetched_at: string;
  distance_m: number;
  walk_duration_s: number;
  elevation: {
    sample_count: number;
    min_elevation_m: number;
    max_elevation_m: number;
    ascent_m: number;
    descent_m: number;
  };
  stops: Array<{ place_id: string; snapped: [number, number]; snap_distance_m: number }>;
  legs: Array<{
    from_place_id: string;
    to_place_id: string;
    distance_m: number;
    duration_s: number;
    straight_m: number;
  }>;
  geometry: { type: "LineString"; coordinates: Array<[number, number]> };
};

export const walkingRoutes = withTranslatedFields(walkingRoutesJson) as WalkingRoute[];

const geometryModules = import.meta.glob("../../../../data/curated/route-geometry/*.json", {
  eager: true,
  import: "default"
}) as Record<string, RouteGeometry>;

export const routeGeometryById: Map<string, RouteGeometry> = new Map(
  Object.values(geometryModules).map((geometry) => [geometry.route_id, geometry])
);

/** Committed walking geometry for a route, or null when not yet generated. */
export function routeGeometry(routeId: string): RouteGeometry | null {
  return routeGeometryById.get(routeId) ?? null;
}

export const walkingRouteById: Map<string, WalkingRoute> = new Map(
  walkingRoutes.map((route) => [route.id, route])
);

/** Display order of route categories on the routes index and its filter. */
export const routeCategoryOrder: RouteCategory[] = [
  "first-visit",
  "history-layers",
  "sacred",
  "creative",
  "nature"
];

/** Routes that include a given place as a numbered stop (0-based position). */
export function routesThroughPlace(placeId: string): Array<{ route: WalkingRoute; stopIndex: number }> {
  return walkingRoutes
    .map((route) => ({ route, stopIndex: route.stops.findIndex((stop) => stop.place_id === placeId) }))
    .filter((entry) => entry.stopIndex >= 0);
}

/** Ordered stop place ids of a route (detours excluded). */
export function routeStopPlaceIds(route: WalkingRoute): string[] {
  return route.stops.map((stop) => stop.place_id);
}

/** "2.7" style km display value for a metre distance. */
export function formatKm(distanceMeters: number, locale: string): string {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
    distanceMeters / 1000
  );
}

/** Rounded pure-walking minutes for a route's committed geometry. */
export function walkingMinutes(geometry: RouteGeometry): number {
  return Math.round(geometry.walk_duration_s / 60);
}
