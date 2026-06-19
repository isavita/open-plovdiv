import type { APIRoute } from "astro";
import people from "../../../../../../data/generated/history-knowledge/people.json";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json({ count: people.length, people }, 200, { "Cache-Control": "public, max-age=300" });
