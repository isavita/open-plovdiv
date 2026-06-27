import type { APIRoute } from "astro";
import { localeCodes, localizePath } from "@i18n/utils";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://openplovdiv.example");
  const disallowedPaths = Array.from(
    new Set([
      "/admin",
      "/api",
      ...localeCodes.map((lang) => localizePath("/admin", lang))
    ])
  ).sort();

  const body = [
    "User-agent: *",
    "Allow: /",
    ...disallowedPaths.map((path) => `Disallow: ${path}`),
    "",
    `Sitemap: ${new URL("/sitemap.xml", base).href}`,
    ""
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
};
