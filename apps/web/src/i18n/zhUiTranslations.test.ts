import { describe, expect, it } from "vitest";
import { localizeChineseUi, withChineseUi, withZhLocale, zhText } from "./zhUiTranslations";

describe("Simplified Chinese interface translations", () => {
  it("translates known interface copy and falls back to English for unknown text", () => {
    expect(zhText("Search")).toBe("搜索");
    expect(zhText("An unlisted English sentence")).toBe("An unlisted English sentence");
  });

  it("uses the right sense for common navigation and mayoral labels", () => {
    expect(zhText("Current office")).toBe("现任期");
    expect(zhText("Records and curiosities")).toBe("历史记录与趣闻");
    expect(zhText("Approx. duration")).toBe("预计时长");
  });

  it("preserves travel, access and admission guidance in visitor copy", () => {
    expect(zhText("Check BDZ for your travel date. From the station, follow our walk into the centre.")).toContain("时刻表");
    expect(zhText("Wear comfortable shoes for the Old Town. For gentler terrain, read our step-free route and its access notes.")).toContain("无障碍说明");
    expect(zhText("Check opening hours and admission before you go. A museum walk is a good starting point for a rainy day.")).toContain("门票费用");
    expect(zhText("Exhibitions, concerts and festivals. Check the official calendar for the dates of your stay.")).toContain("逗留期间的活动");
  });

  it("translates Wikidata dates, protection, types and descriptions in context", () => {
    expect(zhText("Inception")).toBe("始建或成立时间");
    expect(zhText("Status/protection")).toBe("文物地位或保护状态");
    expect(zhText("church building")).toBe("教堂建筑");
    expect(zhText("archaeological site")).toBe("考古遗址");
    expect(zhText("Basilica in Plovdiv, Bulgaria")).toBe("保加利亚普罗夫迪夫的巴西利卡教堂");
    expect(zhText("Neighborhood in Plovdiv (Bulgaria)")).toBe("保加利亚普罗夫迪夫的街区");
  });

  it("preserves structural identifiers, links and callbacks while translating nested copy", () => {
    const action = () => "Search";
    const input = { id: "history", href: "/en/history", rel: "noopener noreferrer", value: "Search", title: "History", nested: [{ label: "Search", url: "https://example.com" }], action };
    const out = withChineseUi(input);
    expect(out).toMatchObject({ id: "history", href: "/en/history", rel: "noopener noreferrer", value: "Search", title: "历史", nested: [{ label: "搜索", url: "https://example.com" }] });
    expect(out.action).toBe(action);
    expect(input.title).toBe("History");
  });

  it("derives Chinese from the English branch and leaves other locales unchanged", () => {
    const original = { bg: { title: "История" }, en: { title: "History" }, ja: { title: "歴史" } };
    expect(withZhLocale(original)).toEqual({ ...original, zh: { title: "历史" } });
    expect(localizeChineseUi("zh", { title: "History" })).toEqual({ title: "历史" });
    expect(localizeChineseUi("en", original.en)).toBe(original.en);
  });
});
