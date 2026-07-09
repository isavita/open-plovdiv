import type { KnowledgePlace } from "./data";
import { walkingRoutes } from "./routes";

/**
 * Visitor-facing order for the places catalogue. The full catalogue remains
 * searchable and filterable; this only makes the unfiltered first screen act
 * like a useful city guide instead of an alphabetical database dump.
 */
const featuredPlaceIds = [
  "place-old-town",
  "place-ancient-theatre",
  "place-nebet-tepe",
  "place-kapana-q12282547",
  "place-ancient-stadium",
  "place-dzhumaya-mosque",
  "place-tzar-simeon-garden-q12298697",
  "place-plovdiv-regional-ethnographic-museum-q876619"
];

const featuredRank = new Map(featuredPlaceIds.map((id, index) => [id, featuredPlaceIds.length - index]));
const routeAppearances = new Map<string, number>();
for (const route of walkingRoutes) {
  for (const stop of route.stops) {
    routeAppearances.set(stop.place_id, (routeAppearances.get(stop.place_id) ?? 0) + 1);
  }
}

export function placeDiscoveryScore(place: KnowledgePlace): number {
  const featured = (featuredRank.get(place.id) ?? 0) * 1_000;
  const routeRelevance = (routeAppearances.get(place.id) ?? 0) * 70;
  const media = place.media?.length ? 35 : 0;
  const sourced = Math.min(place.source_ids?.length ?? 0, 5) * 3;
  const visitorCategory = ["roman", "thracian", "medieval", "ottoman", "revival", "hill"].includes(place.category)
    ? 14
    : 0;
  return featured + routeRelevance + media + sourced + visitorCategory;
}

export function sortPlacesForDiscovery(
  places: KnowledgePlace[],
  localizedName: (place: KnowledgePlace) => string,
  locale: string
): KnowledgePlace[] {
  return [...places].sort((a, b) => {
    const score = placeDiscoveryScore(b) - placeDiscoveryScore(a);
    return score || localizedName(a).localeCompare(localizedName(b), locale);
  });
}
