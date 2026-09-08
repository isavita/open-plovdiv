import { describe, expect, it } from "vitest";
import { commonsImageUrl, isCommonsUploadImageUrl, placeImageUrl } from "./commons";
import { existsSync } from "node:fs";

describe("commons image URLs", () => {
  it("serves the featured city photographs from existing local derivatives, including thumb inputs", () => {
    const original = "https://upload.wikimedia.org/wikipedia/commons/7/72/View_from_Nebet_hill%2C_Plovdiv%2C_Bulgaria.jpg";
    for (const width of [320, 480, 640, 960, 1500]) {
      const src = placeImageUrl(original, width);
      expect(src).toMatch(/^\/images\/plovdiv\/.+\.webp$/);
      expect(existsSync(new URL(`../../public${src}`, import.meta.url))).toBe(true);
      expect(placeImageUrl(commonsImageUrl(original, 640), width)).toBe(src);
    }
  });

  it("keeps unbundled archive media and other hosts on their original image pipeline", () => {
    const archive = "https://upload.wikimedia.org/wikipedia/commons/d/d6/Dzhumayata.jpg";
    expect(placeImageUrl(archive, 640)).toBe(commonsImageUrl(archive, 640));
    expect(placeImageUrl("https://example.com/Antique-theater-plovdiv.jpg", 640)).toBe("https://example.com/Antique-theater-plovdiv.jpg");
  });
  it("rounds non-standard requests up to a supported Commons thumbnail width", () => {
    expect(
      commonsImageUrl(
        "https://upload.wikimedia.org/wikipedia/commons/7/72/View_from_Nebet_hill%2C_Plovdiv%2C_Bulgaria.jpg",
        640
      )
    ).toBe(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/View_from_Nebet_hill%2C_Plovdiv%2C_Bulgaria.jpg/960px-View_from_Nebet_hill%2C_Plovdiv%2C_Bulgaria.jpg"
    );
  });

  it("keeps supported Commons thumbnail widths exact", () => {
    const url = "https://upload.wikimedia.org/wikipedia/commons/7/72/View_from_Nebet_hill%2C_Plovdiv%2C_Bulgaria.jpg";

    expect(commonsImageUrl(url, 500)).toContain("/500px-View_from_Nebet_hill%2C_Plovdiv%2C_Bulgaria.jpg");
    expect(commonsImageUrl(url, 960)).toContain("/960px-View_from_Nebet_hill%2C_Plovdiv%2C_Bulgaria.jpg");
  });

  it("extracts the original file from an existing Commons thumb URL", () => {
    expect(
      commonsImageUrl(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Dzhumayata.jpg/640px-Dzhumayata.jpg",
        360
      )
    ).toBe("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Dzhumayata.jpg/500px-Dzhumayata.jpg");
  });

  it("leaves non-Commons URLs unchanged", () => {
    expect(commonsImageUrl("https://example.com/image.jpg", 640)).toBe("https://example.com/image.jpg");
  });

  it("only marks direct Commons uploads as privacy-safe anonymous image requests", () => {
    expect(
      isCommonsUploadImageUrl(
        "https://upload.wikimedia.org/wikipedia/commons/7/72/View_from_Nebet_hill%2C_Plovdiv%2C_Bulgaria.jpg"
      )
    ).toBe(true);
    expect(isCommonsUploadImageUrl("https://commons.wikimedia.org/wiki/File:View_from_Nebet_hill.jpg")).toBe(false);
  });
});
