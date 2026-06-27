import type { APIRoute } from "astro";
import { localeCodes, localizePath, type Lang } from "@i18n/utils";
import { cityArchive, historyKnowledgePeople, historyKnowledgePlaces, projects, storyLongreads } from "@lib/data";

export const prerender = true;

const PUBLIC_STATIC_PATHS = [
  "/",
  "/overview",
  "/routes",
  "/governance",
  "/budget",
  "/projects",
  "/places",
  "/people",
  "/mayors",
  "/history",
  "/history/editorial-review",
  "/history/contribute",
  "/stories",
  "/archive",
  "/data-sources",
  "/fix-map",
  "/fix-map/report",
  "/community",
  "/privacy",
  "/moderation"
] as const;

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://openplovdiv.example");
  const logicalPaths = getPublicLogicalPaths();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...logicalPaths.flatMap((path) => localeCodes.map((lang) => buildUrlEntry(path, lang, base))),
    "</urlset>"
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
};

function getPublicLogicalPaths(): string[] {
  const paths = new Set<string>(PUBLIC_STATIC_PATHS);

  projects.forEach((project) => paths.add(`/projects/${encodePathSegment(project.id)}`));
  historyKnowledgePlaces.forEach((place) => paths.add(`/places/${encodePathSegment(place.id)}`));
  historyKnowledgePeople.forEach((person) => paths.add(`/people/${encodePathSegment(person.id)}`));
  storyLongreads.forEach((story) => paths.add(`/stories/${encodePathSegment(story.id)}`));
  cityArchive
    .filter((record) => record.kind === "mayor_term")
    .forEach((mayor) => paths.add(`/mayors/${encodePathSegment(mayor.id)}`));

  return Array.from(paths).sort(sortLogicalPaths);
}

function buildUrlEntry(logicalPath: string, lang: Lang, site: URL): string {
  const loc = routeUrl(logicalPath, lang, site);
  const alternates = localeCodes
    .map(
      (code) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(code)}" href="${escapeXml(
          routeUrl(logicalPath, code, site)
        )}" />`
    )
    .join("\n");
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
    routeUrl(logicalPath, "bg", site)
  )}" />`;

  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    alternates,
    xDefault,
    `    <changefreq>${changeFrequency(logicalPath)}</changefreq>`,
    `    <priority>${priority(logicalPath)}</priority>`,
    "  </url>"
  ].join("\n");
}

function routeUrl(logicalPath: string, lang: Lang, site: URL): string {
  return new URL(localizePath(logicalPath, lang), site).href;
}

function sortLogicalPaths(a: string, b: string): number {
  if (a === "/") return -1;
  if (b === "/") return 1;
  const depth = a.split("/").length - b.split("/").length;
  return depth || a.localeCompare(b, "en");
}

function changeFrequency(path: string): "daily" | "weekly" | "monthly" {
  if (path === "/" || path === "/fix-map" || path === "/community") return "daily";
  if (path.startsWith("/projects/") || path.startsWith("/stories/")) return "weekly";
  return "monthly";
}

function priority(path: string): string {
  if (path === "/") return "1.0";
  if (["/history", "/mayors", "/places", "/people", "/stories"].includes(path)) return "0.9";
  if (path.split("/").length > 2) return "0.7";
  return "0.8";
}

function encodePathSegment(segment: string): string {
  return encodeURIComponent(segment);
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return char;
    }
  });
}
