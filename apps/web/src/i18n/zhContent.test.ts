import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Keys are English source text. Japanese includes aliases of older source
// texts; retaining those keys avoids losing Chinese fallbacks in older data.
const root = resolve(process.cwd(), "../..");
const read = (file: string): Record<string, string> =>
  JSON.parse(readFileSync(resolve(root, `data/translations/${file}`), "utf8"));
const chinese = read("zh.json");
const japanese = read("ja.json");
const reviewed = read("zh-reviewed.json");

describe("Simplified Chinese content fidelity", () => {
  it("covers the Japanese source keys and retains reviewed historical corrections", () => {
    expect(Object.keys(japanese).filter((source) => !(source in chinese))).toEqual([]);
    expect(Object.keys(reviewed).length).toBeGreaterThan(0);
    for (const [source, translation] of Object.entries(reviewed)) expect(chinese[source], source).toBe(translation);
  });
  it("preserves written years and BCE markers in source-backed entries", () => {
    for (const [source, translation] of Object.entries(chinese)) {
      const years = source.match(/(?<![0-9])(?:1[0-9]{3}|20[0-9]{2}|[3-9][0-9]{3})(?![0-9])/g) ?? [];
      for (const year of years) {
        // Chinese commonly renders 1930s as "20世纪30年代"; that is a
        // decade, not a missing year. Require the century as well as decade.
        const century = Math.floor(Number(year) / 100) + 1;
        const decade = Number(year) % 100;
        const zhDecade = new RegExp(`${century}\\s*世纪[\\s\\S]{0,25}${decade}\\s*(?:(?:至|[-–—])\\s*\\d{2}\\s*)?年代`);
        const hasChineseDecade = source.includes(`${year}s`) && zhDecade.test(translation);
        expect(translation.includes(year) || hasChineseDecade, `${source}: ${year}`).toBe(true);
      }
      if (/\b(?:BC|BCE)\b/i.test(source)) expect(translation, source).toMatch(/前|\bBCE?\b/i);
      if (/millenn(?:ium|ia)|millennia/i.test(source) && !/centur(?:y|ies)/i.test(source)) {
        expect(translation, source).not.toContain("世纪");
      }
    }
  });
  it("keeps negation, Roma identity and mayoral succession direction clear", () => {
    for (const [source, translation] of Object.entries(chinese)) {
      if (/\bRoma\b/.test(source) && !/\bRoman\b/.test(source)) expect(translation, source).not.toContain("罗马");
      if (/\b(?:cannot|can not|could not)\b[\s\S]{0,160}\bonly\b/i.test(source)) expect(translation, source).not.toContain("只能");
      const m = source.match(/^(?:Person relationship: )?(.+?) — (succeeded by|succeeds) — (.+?)(?:\.)?$/u);
      if (m) expect(translation, source).toContain(m[2] === "succeeds" ? "继任" : "接任");
    }
  });
  it("does not turn neighborhood walks into financial quarters or quarter-hour distances", () => {
    for (const [source, translation] of Object.entries(chinese)) {
      if (/\bquarters?\b/i.test(source) && !/\bquarter of a kilometre\b/i.test(source)) {
        expect(translation, source).not.toMatch(/季度|四分之一/);
      }
      if (/\b(?:bathhouses?|double bath)\b/i.test(source) && !/\bprivate bath\b/i.test(source)) {
        expect(translation, source).not.toContain("双人浴室");
      }
    }
  });
  it("does not invent hotels in route guidance or the Eirene archaeological site", () => {
    for (const source of [
      "Eirene Residence",
      "Finish at Dzhumaya: the stadium, the mosque, Kapana and the Old Town are all a minute away.",
      "You end inside Kapana: dinner and the evening are already around you. The main street is 3 minutes away."
    ]) {
      expect(chinese[source], source).not.toMatch(/酒店|宾馆|旅馆/);
    }
  });
  it("preserves the drainage purpose, theatre hills and historical period", () => {
    const library = Object.keys(chinese).find((source) => source.startsWith("The rectangular brick building was about 20 by 15 m,"));
    const theatre = Object.keys(chinese).find((source) => source.startsWith("In the late first century, the theatre was built in the saddle between Dzhambaz and Taksim Tepe."));
    expect(library).toBeDefined();
    expect(theatre).toBeDefined();
    expect(chinese[library!]).toContain("以防止会损坏纸莎草纸的潮气");
    expect(chinese[theatre!]).toContain("詹巴兹山与塔克西姆山");
    expect(chinese[theatre!]).toContain("公元90年代");
    for (const [source, translation] of Object.entries(chinese)) {
      if (/\b(?:antique|late-antique)\b/i.test(source) || source === "Site antique de Plovdiv") {
        expect(translation, source).not.toContain("古董");
      }
      if (/\btepe\b/i.test(source)) expect(translation, source).not.toMatch(/石阵|石圈/);
    }
  });
  it("retains exact source-image filenames for attribution", () => {
    for (const [source, translation] of Object.entries(chinese)) {
      const filename = source.match(/(?:^|[:—]\s*)([^:—]*?\.(?:jpe?g|png|webp|gif|tiff?|svg))(?=[.\s)"']*$)/iu)?.[1];
      if (filename) expect(translation, source).toContain(filename);
    }
  });
  it("preserves church history and practical route guidance in reviewed translations", () => {
    const sourceStartingWith = (prefix: string) => {
      const matches = Object.keys(chinese).filter((source) => source.startsWith(prefix));
      expect(matches, prefix).toHaveLength(1);
      return chinese[matches[0]];
    };
    expect(sourceStartingWith("A church stood here as early as the 9th century")).toContain("教堂和修道院都在1371年");
    expect(sourceStartingWith("A fire in 1931 destroyed the carved ceiling")).toContain("壁画由克拉斯特约·斯塔马托夫");
    expect(sourceStartingWith("In the early 20th century the hill was destroyed")).toContain("采出的石料用于铺设");
    expect(sourceStartingWith("At Christmas 1859 and on 10 January 1860")).toContain("自治教会");
    expect(sourceStartingWith("The re-establishment of the Bulgarian Church (the Exarchate) in 1870")).not.toContain("总督");
    expect(sourceStartingWith('"Step-free" describes the terrain')).toContain("并不代表经过正式无障碍认证");
    expect(sourceStartingWith("Stroller- and toddler-proof")).toContain("全程没有台阶");
    expect(sourceStartingWith("The tepe's trails are rocky")).toContain("下坡时容易打滑");
    expect(sourceStartingWith("Long exposed stretches")).toContain("夏天务必带水和帽子");
    expect(sourceStartingWith("A west-city quarter walk: from the Medical University campus")).toContain("小径上山");
    expect(sourceStartingWith("Follow the community on Facebook to join rides")).toContain("参加骑行");
    expect(sourceStartingWith("The icons of Zahari Zograf")).toContain("绘制的圣像");
    expect(sourceStartingWith("A decade before Mrkvichka painted the market, art and civic life were already connected")).toContain("圣像画家");
    expect(sourceStartingWith("Atanas Samokovliev, also known as Atanas Samokovets (1832-1905), was a merchant")).toContain("圣像画家");
    expect(sourceStartingWith("In 1850 modern secular education began in the city")).toContain("圣西里尔和圣美多德学校");
    expect(sourceStartingWith("In 1204 the Latin Empire took Philippopolis")).toContain("这座城市成为菲利波波利斯公国的首都");
    expect(sourceStartingWith("On 10 March 1943 Metropolitan Kiril of Plovdiv intervened")).toContain("为已被集结准备驱逐的当地犹太人出面干预");
    expect(sourceStartingWith("In spring 1885 Zahari Stoyanov founded the Secret Bulgarian Central Revolutionary Committee")).toContain("宣布实现统一");
  });
});
