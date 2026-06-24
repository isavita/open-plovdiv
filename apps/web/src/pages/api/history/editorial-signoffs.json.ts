import type { APIRoute } from "astro";
import { historyEditorialSignoffs } from "@lib/data";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(
    { count: historyEditorialSignoffs.length, editorial_signoffs: historyEditorialSignoffs },
    200,
    { "Cache-Control": "public, max-age=300" }
  );
