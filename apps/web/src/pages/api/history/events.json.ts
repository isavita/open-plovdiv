import type { APIRoute } from "astro";
import events from "../../../../../../data/generated/history-knowledge/events.json";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json({ count: events.length, events }, 200, { "Cache-Control": "public, max-age=300" });
