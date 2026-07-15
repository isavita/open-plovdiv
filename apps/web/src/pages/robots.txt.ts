import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://openplovdiv.example");
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api",
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
