import type { APIRoute } from "astro";
import { historyKnowledgeIndex } from "@lib/data";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(historyKnowledgeIndex, 200, { "Cache-Control": "public, max-age=300" });
