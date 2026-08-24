import { describe, expect, it } from "vitest";
import { field, localeCodes } from "../i18n/utils";
import { historyKnowledgePlaces } from "./data";
import {
  formatKm,
  googleMapsDirectionsUrls,
  routeGeometry,
  routeGeometryById,
  routesThroughPlace,
  routeStopPlaceIds,
  walkingMinutes,
  walkingRoutes
} from "./routes";

const placesById = new Map(historyKnowledgePlaces.map((place) => [place.id, place]));

describe("walking route registry", () => {
  it("keeps unique route ids usable as URL slugs", () => {
    const ids = walkingRoutes.map((route) => route.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9][a-z0-9-]+$/);
    expect(walkingRoutes.length).toBeGreaterThanOrEqual(12);
  });

  it("resolves every stop and detour to a published place with coordinates", () => {
    for (const route of walkingRoutes) {
      for (const placeId of routeStopPlaceIds(route)) {
        const place = placesById.get(placeId);
        expect(place, `${route.id} stop ${placeId}`).toBeDefined();
        expect(place?.coordinates, `${route.id} stop ${placeId} coordinates`).toBeTruthy();
      }
      for (const detour of route.detours ?? []) {
        expect(placesById.get(detour.place_id), `${route.id} detour ${detour.place_id}`).toBeDefined();
      }
    }
  });

  it("ships committed walking geometry for every route", () => {
    expect(routeGeometryById.size).toBe(walkingRoutes.length);
    for (const route of walkingRoutes) {
      const geometry = routeGeometry(route.id);
      expect(geometry, route.id).toBeTruthy();
      expect(geometry!.geometry.coordinates.length).toBeGreaterThan(10);
      expect(geometry!.legs.length).toBe(route.stops.length - 1);
      expect(geometry!.distance_m).toBeGreaterThan(500);
      expect(walkingMinutes(geometry!)).toBeGreaterThan(5);
      for (const snap of geometry!.stops) {
        expect(snap.snap_distance_m, `${route.id} ${snap.place_id}`).toBeLessThanOrEqual(150);
      }
    }
  });

  it("cross-links places back to the routes that pass through them", () => {
    const first = walkingRoutes[0];
    const hits = routesThroughPlace(first.stops[1].place_id);
    const entry = hits.find(({ route }) => route.id === first.id);
    expect(entry?.stopIndex).toBe(1);
    expect(routesThroughPlace("place-does-not-exist")).toHaveLength(0);
  });

  it("serves localized titles and stop notes for every locale", () => {
    for (const route of walkingRoutes) {
      for (const lang of localeCodes) {
        const record = route as unknown as Record<string, unknown>;
        expect(field(record, "title", lang), `${route.id} title ${lang}`).not.toBe("");
        expect(field(record, "summary", lang), `${route.id} summary ${lang}`).not.toBe("");
        const stop = route.stops[0] as unknown as Record<string, unknown>;
        expect(field(stop, "note", lang), `${route.id} stop note ${lang}`).not.toBe("");
      }
      // Non-English locales must not silently fall back to the English text.
      const record = route as unknown as Record<string, unknown>;
      expect(field(record, "title", "de")).not.toBe(field(record, "title", "en"));
    }
  });

  it("formats kilometre values for display", () => {
    expect(formatKm(2712, "en-GB")).toBe("2.7");
    expect(formatKm(2712, "bg-BG")).toBe("2,7");
  });

  it("splits Google Maps directions at the mobile waypoint limit without losing stops", () => {
    const coordinates = Array.from({ length: 8 }, (_, index) => `${index + 1},${index + 1}`);
    const urls = googleMapsDirectionsUrls(coordinates);

    expect(urls).toHaveLength(2);
    expect(urls[0]).toContain("origin=1,1&destination=5,5");
    expect(urls[0]).toContain("waypoints=2,2%7C3,3%7C4,4");
    expect(urls[1]).toContain("origin=5,5&destination=8,8");
    expect(urls[1]).toContain("waypoints=6,6%7C7,7");
    expect(googleMapsDirectionsUrls([])).toEqual([]);
    expect(googleMapsDirectionsUrls(["1,1"])).toEqual([]);
  });
});
