import type { APIRoute } from "astro";
import { historyKnowledgePeople } from "@lib/data";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(
    { count: historyKnowledgePeople.length, people: historyKnowledgePeople },
    200,
    { "Cache-Control": "public, max-age=300" }
  );
