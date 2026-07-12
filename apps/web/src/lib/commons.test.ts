import { describe, expect, it } from "vitest";
import { commonsImageUrl, isCommonsUploadImageUrl } from "./commons";

describe("commons image URLs", () => {
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
