import type { APIRoute } from "astro";
import { historyEditorialReview } from "@lib/data";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(historyEditorialReview, 200, { "Cache-Control": "public, max-age=300" });
