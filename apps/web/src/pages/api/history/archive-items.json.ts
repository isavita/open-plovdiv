import type { APIRoute } from "astro";
import archiveItems from "../../../../../../data/generated/history-knowledge/archive-items.json";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(
    {
      count: archiveItems.length,
      archive_items: archiveItems
    },
    200,
    { "Cache-Control": "public, max-age=300" }
  );
