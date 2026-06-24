import type { APIRoute } from "astro";
import { historicalArchiveItems } from "@lib/data";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(
    {
      count: historicalArchiveItems.length,
      archive_items: historicalArchiveItems
    },
    200,
    { "Cache-Control": "public, max-age=300" }
  );
