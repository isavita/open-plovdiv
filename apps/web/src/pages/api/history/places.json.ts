import type { APIRoute } from "astro";
import places from "../../../../../../data/generated/history-knowledge/places.json";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json({ count: places.length, places }, 200, { "Cache-Control": "public, max-age=300" });
