import type { APIRoute } from "astro";
import { adminReportPayload } from "@lib/server/adminPayload";
import { isAdmin, unauthorized } from "@lib/server/auth";
import { json } from "@lib/server/http";
import { publicPhotoUrls, publishReportPhotos } from "@lib/server/imageUpload";
import { PUBLIC_STATUSES, type PublicStatus } from "@lib/server/moderation";
import { approveReport, getReport, setReportPhotos } from "@lib/server/reportStore";

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
  if (!isAdmin(request)) return unauthorized();
  if (!params.id) return json({ error: "missing_id" }, 400);

  let body: { public_status?: string } = {};
  try {
    body = (await request.json()) as { public_status?: string };
  } catch {
    body = {};
  }

  const publicStatus = PUBLIC_STATUSES.includes(body.public_status as PublicStatus)
    ? (body.public_status as PublicStatus)
    : undefined;

  const pending = await getReport(params.id);
  if (!pending) return json({ error: "not_found" }, 404);

  if (pending.photos.length > 0) {
    try {
      const photos = await publishReportPhotos(pending);
      await setReportPhotos(pending.id, photos, publicPhotoUrls(photos));
    } catch {
      return json({ error: "photo_publish_failed" }, 500);
    }
  }

  const report = await approveReport(params.id, publicStatus);
  if (!report) return json({ error: "not_found" }, 404);
  return json({ report: await adminReportPayload(report) });
};
