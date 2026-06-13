import type { APIRoute } from "astro";
import { adminReportPayload } from "@lib/server/adminPayload";
import { isAdmin, unauthorized } from "@lib/server/auth";
import { json } from "@lib/server/http";
import { rejectReport } from "@lib/server/reportStore";

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
  if (!isAdmin(request)) return unauthorized();
  if (!params.id) return json({ error: "missing_id" }, 400);

  let body: { reason?: string } = {};
  try {
    body = (await request.json()) as { reason?: string };
  } catch {
    body = {};
  }

  const report = await rejectReport(params.id, body.reason?.slice(0, 300));
  if (!report) return json({ error: "not_found" }, 404);
  return json({ report: await adminReportPayload(report) });
};
