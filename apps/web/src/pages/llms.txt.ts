import type { APIRoute } from "astro";
import { languages, localeCodes, localizePath } from "@i18n/utils";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://openplovdiv.example");
  const markdownUrl = (path: string) => new URL(`${path.replace(/\/+$/, "")}/index.md`, base).href;
  const link = (label: string, path: string, description: string) =>
    `- [${label}](${markdownUrl(path)}): ${description}`;

  const sections = [
    link("History", "/en/history", "The city's eras, events and historical sources."),
    link("Places", "/en/places", "Places and landmarks, with links to individual records."),
    link("People", "/en/people", "People connected to Plovdiv and their source-backed records."),
    link("Stories", "/en/stories", "Editorial stories about the city and its history."),
    link("Walking routes", "/en/routes", "Routes and stops for exploring Plovdiv."),
    link("Neighbourhoods", "/en/neighbourhoods", "Neighbourhood profiles and local history."),
    link("Archive", "/en/archive", "Historical archive material and its sources."),
    link("Data and sources", "/en/data-sources", "Sources, methods and data limitations.")
  ];

  const body = [
    "# Open Plovdiv",
    "",
    "> Open Plovdiv is a source-backed guide to Plovdiv, Bulgaria: its history, places, people, neighbourhoods and public life.",
    "",
    "The site is read-only. Follow the source links and check dates and editorial context when using its information. Content is available in 14 languages; some fields may fall back to another language where translations are unavailable.",
    "",
    "Each public page has a Markdown alternative: append `/index.md` to its canonical URL (use `/index.md` for the root page). HTML pages also link to their Markdown alternative. These documents are derived from rendered page content; interactive or client-loaded features may be incomplete. Consult the HTML and cited sources for the authoritative presentation. The sitemap lists the public HTML pages and language variants.",
    "",
    "## Explore in English",
    "",
    ...sections,
    "",
    "## Languages",
    "",
    ...localeCodes.map((lang) => link(languages[lang], localizePath("/", lang), `Home page (${lang}).`)),
    "",
    "## Optional",
    "",
    `- [Sitemap](${new URL("/sitemap.xml", base).href}): Complete list of public HTML pages and language variants.`,
    link("Privacy", "/en/privacy", "The site's privacy information."),
    ""
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
