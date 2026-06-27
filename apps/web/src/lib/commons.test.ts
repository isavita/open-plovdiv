import { describe, expect, it } from "vitest";
import { commonsImageUrl } from "./commons";

describe("commons image URLs", () => {
  it("uses Wikimedia redirect thumbnails for original Commons upload URLs", () => {
    expect(
      commonsImageUrl(
        "https://upload.wikimedia.org/wikipedia/commons/7/72/View_from_Nebet_hill%2C_Plovdiv%2C_Bulgaria.jpg",
        640
      )
    ).toBe(
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/View_from_Nebet_hill%2C_Plovdiv%2C_Bulgaria.jpg?width=640"
    );
  });

  it("extracts the original file from an existing Commons thumb URL", () => {
    expect(
      commonsImageUrl(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Dzhumayata.jpg/640px-Dzhumayata.jpg",
        360
      )
    ).toBe("https://commons.wikimedia.org/wiki/Special:Redirect/file/Dzhumayata.jpg?width=360");
  });

  it("leaves non-Commons URLs unchanged", () => {
    expect(commonsImageUrl("https://example.com/image.jpg", 640)).toBe("https://example.com/image.jpg");
  });
});
