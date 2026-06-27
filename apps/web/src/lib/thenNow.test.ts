import { describe, expect, it } from "vitest";
import type { ThenNowPair } from "./data";
import { isPublicThenNowPair, publicThenNowPairs, thenNowCountByPlace } from "./thenNow";

function pair(id: string, placeId: string, thenUrl: string, nowUrl: string): ThenNowPair {
  return {
    id,
    place_id: placeId,
    historical_archive_item_id: `archive-${id}`,
    title_bg: id,
    title_en: id,
    caption_bg: id,
    caption_en: id,
    then_media: {
      type: "image",
      title: `${id} then`,
      url: thenUrl,
      page_url: thenUrl,
      credit: "Archive",
      license: "Public domain",
      license_url: thenUrl,
      accessed_at: "2026-06-27"
    },
    now_media: {
      type: "image",
      title: `${id} now`,
      url: nowUrl,
      page_url: nowUrl,
      credit: "Now",
      license: "CC BY",
      license_url: nowUrl,
      accessed_at: "2026-06-27"
    },
    source_ids: [],
    provenance: [],
    match_quality: "same_place_approximate_viewpoint",
    data_quality: "public_source",
    editorial: {
      status: "needs_editorial_signoff",
      reviewed_by: null,
      reviewed_at: null,
      notes_bg: "",
      notes_en: ""
    }
  };
}

describe("public then/now pairs", () => {
  it("hides records where the then and now image are the same file", () => {
    const item = pair(
      "same-file",
      "place-a",
      "https://upload.wikimedia.org/wikipedia/commons/a/a0/Image.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a0/Image.jpg"
    );

    expect(isPublicThenNowPair(item)).toBe(false);
    expect(publicThenNowPairs([item])).toEqual([]);
  });

  it("keeps one representative when several old images use the same current image", () => {
    const first = pair("postcard-1", "place-a", "https://example.com/then-1.jpg", "https://example.com/now.jpg");
    const second = pair("postcard-2", "place-a", "https://example.com/then-2.jpg", "https://example.com/now.jpg");
    const other = pair("other-place", "place-b", "https://example.com/then-3.jpg", "https://example.com/now.jpg");

    expect(publicThenNowPairs([first, second, other]).map((item) => item.id)).toEqual(["postcard-1", "other-place"]);
  });

  it("prefers an explicitly linked comparison inside a duplicate group", () => {
    const first = pair("postcard-1", "place-a", "https://example.com/then-1.jpg", "https://example.com/now.jpg");
    const second = pair("postcard-2", "place-a", "https://example.com/then-2.jpg", "https://example.com/now.jpg");

    expect(publicThenNowPairs([first, second], { preferredPairIds: new Set(["postcard-2"]) }).map((item) => item.id)).toEqual([
      "postcard-2"
    ]);
  });

  it("counts only public representative comparisons per place", () => {
    const first = pair("first", "place-a", "https://example.com/then-1.jpg", "https://example.com/now.jpg");
    const duplicate = pair("duplicate", "place-a", "https://example.com/then-2.jpg", "https://example.com/now.jpg");
    const sameFile = pair("same-file", "place-b", "https://example.com/same.jpg", "https://example.com/same.jpg");

    expect([...thenNowCountByPlace([first, duplicate, sameFile])]).toEqual([["place-a", 1]]);
  });
});
