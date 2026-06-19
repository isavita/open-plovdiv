import type { APIRoute } from "astro";
import sourceCoverage from "../../../../../../data/generated/history-knowledge/source-coverage.json";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(sourceCoverage, 200, { "Cache-Control": "public, max-age=300" });
