import type { APIRoute } from "astro";
import { historySourceCoverage } from "@lib/data";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(historySourceCoverage, 200, { "Cache-Control": "public, max-age=300" });
