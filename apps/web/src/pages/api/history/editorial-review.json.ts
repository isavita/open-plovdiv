import type { APIRoute } from "astro";
import editorialReview from "../../../../../../data/generated/history-knowledge/editorial-review.json";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(editorialReview, 200, { "Cache-Control": "public, max-age=300" });
