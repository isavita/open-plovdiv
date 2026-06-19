import type { APIRoute } from "astro";
import editorialSignoffs from "../../../../../../data/generated/history-knowledge/editorial-signoffs.json";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json({ count: editorialSignoffs.length, editorial_signoffs: editorialSignoffs }, 200, {
    "Cache-Control": "public, max-age=300"
  });
