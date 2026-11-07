import { describe, expect, it } from "vitest";
import { buildPageStructuredData, serializeJsonLd, type StructuredDataOptions } from "./seo";

const options: StructuredDataOptions = {
  site: new URL("https://openplovdiv.com"),
  lang: "en",
  locale: "en",
  siteName: "Open Plovdiv",
  logicalPath: "/routes/roman-plovdiv-90",
  canonical: "https://openplovdiv.com/en/routes/roman-plovdiv-90",
  title: "Roman Plovdiv in 90 minutes",
  description: "A walking route through ancient Philippopolis."
};

describe("page structured data", () => {
  it("omits a breadcrumb on the homepage and keeps a real trail on interior pages", () => {
    const home = buildPageStructuredData({ ...options, logicalPath: "/", canonical: "https://openplovdiv.com/en" });
    expect(home.find((node) => node["@type"] === "BreadcrumbList")).toBeUndefined();
    expect(home.find((node) => node["@type"] === "WebPage")?.breadcrumb).toBeUndefined();
    const route = buildPageStructuredData(options);
    const breadcrumb = route.find((node) => node["@type"] === "BreadcrumbList");
    expect(breadcrumb?.itemListElement).toHaveLength(3);
    expect(route.find((node) => node["@type"] === "WebPage")?.breadcrumb).toEqual({
      "@id": `${options.canonical}#breadcrumb`
    });
  });

  it("provides a schema.org context for each additional entity in the serialized array", () => {
    const trip = { "@type": "TouristTrip", name: options.title };
    const nodes = buildPageStructuredData({ ...options, additional: trip });
    const serialized = JSON.parse(serializeJsonLd(nodes));
    expect(serialized.find((node: Record<string, unknown>) => node["@type"] === "TouristTrip"))
      .toMatchObject({ "@context": "https://schema.org", name: options.title });
    expect(trip).not.toHaveProperty("@context");
  });

  it("preserves an explicitly supplied context and handles multiple entities", () => {
    const nodes = buildPageStructuredData({
      ...options,
      additional: [
        { "@type": "Place", name: "Old Town" },
        { "@context": "https://example.org/vocabulary", "@type": "Example", name: "Example" }
      ]
    });
    expect(nodes.find((node) => node["@type"] === "Place")?.["@context"]).toBe("https://schema.org");
    expect(nodes.find((node) => node["@type"] === "Example")?.["@context"]).toBe("https://example.org/vocabulary");
  });
});
