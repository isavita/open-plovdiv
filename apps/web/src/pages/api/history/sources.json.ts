import type { APIRoute } from "astro";
import { historyKnowledgeSources } from "@lib/data";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(
    { count: historyKnowledgeSources.length, sources: historyKnowledgeSources },
    200,
    { "Cache-Control": "public, max-age=300" }
  );
