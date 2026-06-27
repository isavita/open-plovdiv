import { describe, expect, it } from "vitest";
import type { HistoricalArchiveItem } from "./data";
import { publicArchiveItems } from "./archive";

function item(id: string, placeId: string, year: number, title: string): HistoricalArchiveItem {
  return {
    id,
    place_id: placeId,
    date_year: year,
    title_en: title,
    title_bg: title,
    media: { title }
  } as HistoricalArchiveItem;
}

describe("public archive items", () => {
  it("keeps only one representative from the same place and year series", () => {
    const first = item("archive-postcard-square-1", "place-square", 1900, "Square on an old postcard");
    const second = item("archive-postcard-square-2", "place-square", 1900, "Square - postcard 2");
    const otherYear = item("archive-postcard-square-1930", "place-square", 1930, "Square in the 1930s");
    const otherPlace = item("archive-postcard-other-1", "place-other", 1900, "Other place");

    expect(publicArchiveItems([first, second, otherYear, otherPlace]).map((archiveItem) => archiveItem.id)).toEqual([
      "archive-postcard-square-1",
      "archive-postcard-square-1930",
      "archive-postcard-other-1"
    ]);
  });
});
