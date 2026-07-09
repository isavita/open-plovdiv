import { describe, expect, it } from "vitest";
import { historyKnowledgePlaces } from "./data";
import { sortPlacesForDiscovery } from "./placeDiscovery";

describe("visitor-first place discovery", () => {
  it("puts recognizable visitor landmarks ahead of the alphabetical civic catalogue", () => {
    const places = sortPlacesForDiscovery(historyKnowledgePlaces, (place) => place.name_en, "en-GB");
    const firstEight = places.slice(0, 8).map((place) => place.id);

    expect(firstEight).toContain("place-old-town");
    expect(firstEight).toContain("place-ancient-theatre");
    expect(firstEight).toContain("place-nebet-tepe");
    expect(firstEight).toContain("place-kapana-q12282547");
    expect(places[0].id).not.toBe("place-11th-of-may-square-plovdiv-q101081340");
  });
});
