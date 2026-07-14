import { describe, expect, it } from "vitest";
import { field, localeCodes } from "../i18n/utils";
import { historyKnowledgePlaces, projects, storyLongreads } from "./data";
import { walkingRouteById } from "./routes";
import {
  neighbourhoodAreaOrder,
  neighbourhoodEraColors,
  neighbourhoodHistories,
  neighbourhoodLeadPhoto,
  neighbourhoodRoutes,
  neighbourhoodsOfPlace
} from "./neighbourhoods";

const placeIds = new Set(historyKnowledgePlaces.map((place) => place.id));
const placesById = new Map(historyKnowledgePlaces.map((place) => [place.id, place]));
const storyIds = new Set(storyLongreads.map((story) => story.id));

describe("neighbourhood histories registry", () => {
  it("keeps unique slugs usable as URLs", () => {
    const ids = neighbourhoodHistories.map((neighbourhood) => neighbourhood.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9][a-z0-9-]+$/);
    expect(neighbourhoodHistories.length).toBeGreaterThanOrEqual(12);
  });

  it("resolves every linked place, story and route id", () => {
    for (const neighbourhood of neighbourhoodHistories) {
      for (const placeId of neighbourhood.place_ids) {
        expect(placeIds.has(placeId), `${neighbourhood.id} place ${placeId}`).toBe(true);
      }
      if (neighbourhood.anchor_place_id) {
        expect(placeIds.has(neighbourhood.anchor_place_id), `${neighbourhood.id} anchor`).toBe(true);
      }
      for (const storyId of neighbourhood.story_ids) {
        expect(storyIds.has(storyId), `${neighbourhood.id} story ${storyId}`).toBe(true);
      }
      for (const routeId of neighbourhood.route_ids) {
        expect(walkingRouteById.has(routeId), `${neighbourhood.id} route ${routeId}`).toBe(true);
      }
    }
  });

  it("keeps timelines chronological and sources at least two deep", () => {
    for (const neighbourhood of neighbourhoodHistories) {
      const years = neighbourhood.timeline.map((entry) => entry.year);
      expect([...years].sort((a, b) => a - b), neighbourhood.id).toEqual(years);
      expect(neighbourhood.sources.length, `${neighbourhood.id} sources`).toBeGreaterThanOrEqual(2);
      expect(neighbourhood.fabric?.length ?? 0, `${neighbourhood.id} fabric`).toBeGreaterThanOrEqual(1);
    }
  });

  it("maps every era tag to a colour and every area to the filter order", () => {
    for (const neighbourhood of neighbourhoodHistories) {
      for (const era of neighbourhood.era_tags) {
        expect(neighbourhoodEraColors[era], `${neighbourhood.id} era ${era}`).toMatch(/^#/);
      }
      expect(neighbourhoodAreaOrder).toContain(neighbourhood.area);
    }
  });

  it("provides a rights-cleared lead photo for every quarter", () => {
    for (const neighbourhood of neighbourhoodHistories) {
      const media = neighbourhoodLeadPhoto(neighbourhood, placesById);
      expect(media, `${neighbourhood.id} lead photo`).not.toBeNull();
      expect(media?.type, `${neighbourhood.id} media type`).toBe("image");
      expect(media?.url, `${neighbourhood.id} direct image`).toMatch(/^https:\/\//);
      expect(media?.page_url, `${neighbourhood.id} source page`).toMatch(/^https:\/\//);
      expect(media?.credit.trim(), `${neighbourhood.id} credit`).not.toBe("");
      expect(media?.license.trim(), `${neighbourhood.id} licence`).not.toBe("");
      expect(media?.license_url, `${neighbourhood.id} licence URL`).toMatch(/^https:\/\//);
    }
  });

  it("connects quarters to walking routes through shared places", () => {
    const kapana = neighbourhoodHistories.find((neighbourhood) => neighbourhood.id === "kapana");
    expect(kapana).toBeDefined();
    const routes = neighbourhoodRoutes(kapana!);
    expect(routes.length).toBeGreaterThanOrEqual(3);
    expect(neighbourhoodsOfPlace("place-kapana-q12282547").map((n) => n.id)).toContain("kapana");
  });

  it("links civic projects for every district value used", () => {
    const districts = new Set(projects.map((project) => project.district).filter(Boolean));
    for (const neighbourhood of neighbourhoodHistories) {
      expect(districts.has(neighbourhood.district_bg), `${neighbourhood.id} district`).toBe(true);
    }
  });

  it("serves localized names and summaries in every locale without English fallback", () => {
    for (const neighbourhood of neighbourhoodHistories) {
      const record = neighbourhood as unknown as Record<string, unknown>;
      for (const lang of localeCodes) {
        expect(field(record, "name", lang), `${neighbourhood.id} name ${lang}`).not.toBe("");
        expect(field(record, "summary", lang), `${neighbourhood.id} summary ${lang}`).not.toBe("");
        expect(field(record, "getting_there", lang), `${neighbourhood.id} getting_there ${lang}`).not.toBe("");
        expect(field(record, "why", lang), `${neighbourhood.id} why ${lang}`).not.toBe("");
        expect(
          field(neighbourhood.visit as unknown as Record<string, unknown>, "see", lang),
          `${neighbourhood.id} visit.see ${lang}`
        ).not.toBe("");
      }
      expect(field(record, "summary", "de")).not.toBe(field(record, "summary", "en"));
      expect(field(record, "summary", "ja")).not.toBe(field(record, "summary", "en"));
    }
  });
});
