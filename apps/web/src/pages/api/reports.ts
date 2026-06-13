import type { APIRoute } from "astro";
import { json } from "@lib/server/http";
import { validateSubmission, type SubmissionInput } from "@lib/server/moderation";
import { checkRateLimit, clientIp } from "@lib/server/rateLimit";
import {
  extractImageFiles,
  processPendingPhotos,
  validateImageFiles
} from "@lib/server/imageUpload";
import { attachPendingPhotos, createReport, rejectReport } from "@lib/server/reportStore";

export const prerender = false;

async function parseBody(request: Request): Promise<{ input: SubmissionInput; photos: File[] }> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return { input: (await request.json()) as SubmissionInput, photos: [] };
  }
  const form = await request.formData();
  const obj: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (value instanceof File) continue;
    obj[key] = value;
  }
  return { input: obj as SubmissionInput, photos: extractImageFiles(form) };
}

export const POST: APIRoute = async ({ request }) => {
  const { allowed } = await checkRateLimit(clientIp(request));
  if (!allowed) return json({ error: "rate_limited" }, 429);

  let parsed: { input: SubmissionInput; photos: File[] };
  try {
    parsed = await parseBody(request);
  } catch {
    return json({ error: "invalid_body" }, 400);
  }

  const result = validateSubmission(parsed.input);
  if (!result.ok) return json({ error: result.error }, 400);

  const imageResult = validateImageFiles(parsed.photos);
  if (!imageResult.ok) return json({ error: imageResult.error }, 400);

  const report = await createReport(result.value);
  if (imageResult.files.length > 0) {
    try {
      const photos = await processPendingPhotos(report.id, imageResult.files);
      await attachPendingPhotos(report.id, photos);
    } catch {
      await rejectReport(report.id, "invalid_photo");
      return json({ error: "invalid_photo" }, 400);
    }
  }

  return json({ id: report.id, moderation_status: report.moderation_status }, 201);
};
