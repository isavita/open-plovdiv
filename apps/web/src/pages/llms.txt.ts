import type { APIRoute } from "astro";
import { languages, localeCodes, localizePath } from "@i18n/utils";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://openplovdiv.example");
  const markdownUrl = (path: string) => new URL(`${path.replace(/\/+$/, "")}/index.md`, base).href;
  const link = (label: string, path: string, description: string) =>
    `- [${label}](${markdownUrl(path)}): ${description}`;
  const shortLink = (label: string, path: string, description: string) =>
    `- [${label}](${new URL(`${path}.md`, base).href}): ${description}`;

  const sections = [
    shortLink("City overview", "/en/overview", "An overview of the city and its public data."),
    shortLink("History", "/en/history", "The city's eras, events and historical sources."),
    shortLink("Places", "/en/places", "Places and landmarks, with links to individual records."),
    shortLink("People", "/en/people", "People connected to Plovdiv and their source-backed records."),
    shortLink("Stories", "/en/stories", "Editorial stories about the city and its history."),
    shortLink("Walking routes", "/en/routes", "Routes and stops for exploring Plovdiv."),
    shortLink("Neighbourhoods", "/en/neighbourhoods", "Neighbourhood profiles and local history."),
    shortLink("Governance", "/en/governance", "Information on local governance and public records."),
    shortLink("Mayors", "/en/mayors", "Mayoral terms and associated historical records."),
    shortLink("Projects", "/en/projects", "Public project records, sources and status."),
    shortLink("Community", "/en/community", "A directory of existing community initiatives."),
    shortLink("Archive", "/en/archive", "Historical archive material and its sources."),
    shortLink("Data and sources", "/en/data-sources", "Sources, methods and data limitations.")
  ];

  const chineseSections = [
    shortLink("城市概览", "/zh/overview", "城市与公共数据概览。"),
    shortLink("历史", "/zh/history", "城市年代、事件与历史来源。"),
    shortLink("景点", "/zh/places", "景点和地标及其详细记录。"),
    shortLink("人物", "/zh/people", "与普罗夫迪夫相关的人物及来源。"),
    shortLink("故事", "/zh/stories", "关于城市及其历史的故事。"),
    shortLink("步行路线", "/zh/routes", "步行路线和沿途站点。"),
    shortLink("街区", "/zh/neighbourhoods", "街区概览和地方历史。"),
    shortLink("市政", "/zh/governance", "地方治理和公共记录。"),
    shortLink("历任市长", "/zh/mayors", "历任市长及其历史记录。"),
    shortLink("项目", "/zh/projects", "公共项目、来源和状态。"),
    shortLink("社区", "/zh/community", "现有社区倡议。"),
    shortLink("档案", "/zh/archive", "历史档案资料及其来源。"),
    shortLink("数据与来源", "/zh/data-sources", "数据来源、方法与局限。")
  ];

  const body = [
    "# Open Plovdiv",
    "",
    "> Open Plovdiv is a source-backed guide to Plovdiv, Bulgaria: its history, places, people, neighbourhoods and public life.",
    "",
    `The site is read-only. Follow the source links and check dates and editorial context when using its information. Content is available in ${localeCodes.length} languages, including Simplified Chinese (简体中文, zh); some fields may fall back to another language where translations are unavailable.`,
    "",
    "Each public page has a Markdown alternative: append `/index.md` to its canonical URL (use `/index.md` for the root page). Short `.md` alternatives are also available for non-root pages, for example `/en/places.md` and `/en/routes.md`. HTML pages link to their Markdown alternative. These documents are derived from rendered page content; interactive or client-loaded features may be incomplete. Consult the HTML and cited sources for the authoritative presentation. The sitemap lists the public HTML pages and language variants.",
    "",
    "## Explore in English",
    "",
    ...sections,
    "",
    "## Explore in Simplified Chinese (简体中文)",
    "",
    ...chineseSections,
    "",
    "## Languages",
    "",
    ...localeCodes.map((lang) => link(languages[lang], localizePath("/", lang), `Home page (${lang}).`)),
    "",
    "## Optional",
    "",
    `- [Sitemap](${new URL("/sitemap.xml", base).href}): Complete list of public HTML pages and language variants.`,
    shortLink("History editorial review", "/en/history/editorial-review", "Notes on the review status of historical material."),
    shortLink("Privacy", "/en/privacy", "The site's privacy information."),
    ""
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
