/**
 * Category colours for place pins and legends — one palette shared by the
 * place-map API payload and the places-page legend so they can never drift.
 */
export const placeColors: Record<string, string> = {
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

export const fallbackPlaceColor = "#6b7280";
