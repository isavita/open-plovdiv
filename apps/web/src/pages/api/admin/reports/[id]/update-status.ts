import type { APIRoute } from "astro";
import { adminReportPayload } from "@lib/server/adminPayload";
import { isAdmin, unauthorized } from "@lib/server/auth";
import { json } from "@lib/server/http";
import { PUBLIC_STATUSES, type PublicStatus } from "@lib/server/moderation";
import { updateReportStatus } from "@lib/server/reportStore";

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
  if (!isAdmin(request)) return unauthorized();
  if (!params.id) return json({ error: "missing_id" }, 400);

  let body: { public_status?: string } = {};
  try {
    body = (await request.json()) as { public_status?: string };
  } catch {
    return json({ error: "invalid_body" }, 400);
  }

  if (!PUBLIC_STATUSES.includes(body.public_status as PublicStatus)) {
    return json({ error: "invalid_status" }, 400);
  }

  const report = await updateReportStatus(params.id, body.public_status as PublicStatus);
  if (!report) return json({ error: "not_found" }, 404);
  return json({ report: await adminReportPayload(report) });
};
