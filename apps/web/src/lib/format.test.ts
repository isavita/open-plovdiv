import { describe, expect, it } from "vitest";
import { categoryLabel, distanceKm, formatMoneyBGN, projectStatusLabel } from "./format";

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
});
