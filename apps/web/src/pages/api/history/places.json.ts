import type { APIRoute } from "astro";
import { historyKnowledgePlaces } from "@lib/data";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(
    { count: historyKnowledgePlaces.length, places: historyKnowledgePlaces },
    200,
    { "Cache-Control": "public, max-age=300" }
  );
