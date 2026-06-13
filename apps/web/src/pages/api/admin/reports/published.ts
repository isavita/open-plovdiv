import type { APIRoute } from "astro";
import { isAdmin, unauthorized } from "@lib/server/auth";
import { json } from "@lib/server/http";
import { adminReportPayload } from "@lib/server/adminPayload";
import { listPublished } from "@lib/server/reportStore";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  if (!isAdmin(request)) return unauthorized();
  const reports = await listPublished();
  return json({ count: reports.length, reports: await Promise.all(reports.map(adminReportPayload)) });
};
