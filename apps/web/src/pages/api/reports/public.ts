import type { APIRoute } from "astro";
import { json } from "@lib/server/http";
import { toPublicReport } from "@lib/server/moderation";
import { listPublished } from "@lib/server/reportStore";

export const prerender = false;

export const GET: APIRoute = async () => {
  const published = await listPublished();
  const reports = published.map(toPublicReport);
  const updated_at = published.reduce((max, r) => (r.updated_at > max ? r.updated_at : max), "");
  return json({ updated_at, count: reports.length, reports });
};
