import type { APIRoute } from "astro";
import { historyKnowledgeEvents } from "@lib/data";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(
    { count: historyKnowledgeEvents.length, events: historyKnowledgeEvents },
    200,
    { "Cache-Control": "public, max-age=300" }
  );
