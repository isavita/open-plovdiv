import type { APIRoute } from "astro";
import sources from "../../../../../../data/generated/history-knowledge/sources.json";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json({ count: sources.length, sources }, 200, { "Cache-Control": "public, max-age=300" });
