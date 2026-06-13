import { adminPhotoPreviews } from "./imageUpload";
import type { CommunityReport } from "./moderation";

export async function adminReportPayload(report: CommunityReport) {
  return {
    ...report,
    photos: report.photos.map((photo) => ({
      id: photo.id,
      original_name: photo.original_name,
      mime_type: photo.mime_type,
      bytes: photo.bytes,
      hidden: Boolean(photo.hidden),
      public_url: photo.public_url,
      thumbnail_url: photo.thumbnail_url,
      created_at: photo.created_at,
      published_at: photo.published_at
    })),
    admin_photo_previews: await adminPhotoPreviews(report)
  };
}
