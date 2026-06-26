import { describe, expect, it } from "vitest";
import { categoryLabel, distanceKm, formatMoneyBGN, knownHistoryLabel, projectStatusLabel } from "./format";

describe("format utilities", () => {
  it("formats BGN without cents", () => {
    expect(formatMoneyBGN(125000)).toContain("125");
    expect(formatMoneyBGN(125000)).toContain("лв");
  });

  it("returns Bulgarian labels", () => {
    expect(categoryLabel("public_transport")).toBe("Транспорт");
    expect(projectStatusLabel("in_progress")).toBe("В процес");
  });

  it("calculates nearby distances in kilometers", () => {
    const distance = distanceKm(
      { lat: 42.1415, lng: 24.7488 },
      { lat: 42.1428, lng: 24.7467 }
    );
    expect(distance).toBeGreaterThan(0.1);
    expect(distance).toBeLessThan(0.3);
  });

  it("localizes generated history labels for German pages", () => {
    expect(knownHistoryLabel("wikidata_coordinate", "de")).toBe("Wikidata-Koordinaten");
    expect(knownHistoryLabel("Modern period, 1984", "de")).toBe("Moderne Zeit, 1984");
    expect(knownHistoryLabel("not identified in the current public source", "de")).toContain("öffentlichen Quelle");
  });

  it("localizes generated history labels for Japanese pages", () => {
    expect(knownHistoryLabel("wikidata_coordinate", "ja")).toBe("Wikidata座標");
    expect(knownHistoryLabel("Modern period, 1984", "ja")).toBe("現代、1984");
    expect(knownHistoryLabel("not identified in the current public source", "ja")).toContain("現在の公開情報源");
  });
});
