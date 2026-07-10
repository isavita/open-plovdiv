/**
 * Category colours for place pins and legends — one palette shared by the
 * place-map API payload and the places-page legend so they can never drift.
 */
export const placeColors: Record<string, string> = {
  thracian: "#875510",
  roman: "#8e3043",
  medieval: "#4d477a",
  ottoman: "#1e6a62",
  revival: "#a95524",
  religious: "#6a3f72",
  hill: "#52705f",
  civic: "#205f7d",
  monument: "#6d5345"
};

export const fallbackPlaceColor = "#586a6e";
