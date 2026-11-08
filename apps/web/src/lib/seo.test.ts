import { describe, expect, it } from "vitest";
import { buildPageStructuredData, conciseDescription, serializeJsonLd, type StructuredDataOptions } from "./seo";

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

describe("search and social descriptions", () => {
  it("preserves concise descriptions and selects complete English and Bulgarian sentences", () => {
    const short = "Explore Plovdiv's Roman theatre and Old Town.";
    expect(conciseDescription(short, "en")).toBe(short);
    const en = "Probably the best-known ancient monument in Bulgaria, built in the 90s of the 1st century AD under Emperor Domitian. Set in the saddle between two of the three hills, it seated about 7,000 on two tiers of 14 rows each. Studied and restored between 1968 and 1984, it still hosts festivals.";
    expect(conciseDescription(en, "en")).toBe("Probably the best-known ancient monument in Bulgaria, built in the 90s of the 1st century AD under Emperor Domitian.");
    const bg = "Античният театър в Пловдив е една от най-добре запазените римски сгради в България. Разположен е в седловината между два от хълмовете на стария град и днес отново се използва за представления и културни събития.";
    expect(conciseDescription(bg, "bg")).toBe("Античният театър в Пловдив е една от най-добре запазените римски сгради в България.");
  });

  it("uses complete words and Unicode graphemes when a sentence exceeds the preview budget", () => {
    const longEn = "Discover " + "Plovdiv's ancient history, fascinating museums and cobbled streets ".repeat(5);
    const enPreview = conciseDescription(longEn, "en");
    expect([...enPreview].length).toBeLessThanOrEqual(160);
    expect(enPreview).toMatch(/(?:history|museums|streets|and|fascinating|ancient|Plovdiv's|cobbled)…$/);
    const zh = "普罗夫迪夫的古代剧院展示了城市的悠久历史与文化遗产。".repeat(10);
    const zhPreview = conciseDescription(zh, "zh");
    expect([...zhPreview].length).toBeLessThanOrEqual(160);
    expect(zhPreview.endsWith("。") || zhPreview.endsWith("…")).toBe(true);
    const token = "😀".repeat(200);
    const tokenPreview = conciseDescription(token, "en");
    expect([...tokenPreview].length).toBeLessThanOrEqual(160);
    expect(tokenPreview.endsWith("…")).toBe(true);
    const dangling = "South of the railway line, two quarter names keep the memory of the refugee wave after the First World War: Belomorski — for Aegean Thrace, and Vardarski — for the Vardar region and its communities.";
    expect(conciseDescription(dangling, "en")).not.toMatch(/\bfor…$/);
    expect(conciseDescription(dangling, "bg")).toMatch(/\bfor…$/);
    const bracket = "在卡什亚卡 (Karshiyaka) 北部边缘，前菲利波沃 (Filipovo) 村坐落在其铁路枢纽周围：普罗夫迪夫 - 布尔加斯线上的车站于 1915 年 5 月 25 日开通，汇集了前往Karlovo (Karlovo)、Panagyurishte (Panagyurishte) 和Saedinenie (Saedinenie) 的铁路线路与旅客。";
    expect(conciseDescription(bracket, "zh")).not.toMatch(/[(（\[「『]…$/u);
  });
});

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
