import type { APIRoute } from "astro";
import { adminReportPayload } from "@lib/server/adminPayload";
import { isAdmin, unauthorized } from "@lib/server/auth";
import { json } from "@lib/server/http";
import { hideReportPhoto } from "@lib/server/reportStore";

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
  if (!isAdmin(request)) return unauthorized();
  if (!params.id) return json({ error: "missing_id" }, 400);

  let body: { photo_id?: string } = {};
  try {
    body = (await request.json()) as { photo_id?: string };
  } catch {
    return json({ error: "invalid_body" }, 400);
  }

  if (!body.photo_id) return json({ error: "missing_photo_id" }, 400);

  const report = await hideReportPhoto(params.id, body.photo_id);
  if (!report) return json({ error: "not_found" }, 404);
  return json({ report: await adminReportPayload(report) });
};
