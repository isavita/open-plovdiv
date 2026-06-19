import type { APIRoute } from "astro";
import index from "../../../../../../data/generated/history-knowledge/index.json";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(index, 200, { "Cache-Control": "public, max-age=300" });
