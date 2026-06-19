import type { APIRoute } from "astro";
import organizations from "../../../../../../data/generated/history-knowledge/organizations.json";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(
    { count: organizations.length, organizations },
    200,
    { "Cache-Control": "public, max-age=300" }
  );
