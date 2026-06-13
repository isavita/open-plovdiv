import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import type { CommunityReport, ReportPhoto } from "./moderation";

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const MAX_PHOTOS_PER_REPORT = 3;

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const PRIVATE_ROOT =
  process.env.REPORT_IMAGE_PRIVATE_DIR ??
  fileURLToPath(new URL("../../../.data/report-images/", import.meta.url));
const PUBLIC_ROOT =
  process.env.REPORT_IMAGE_PUBLIC_DIR ??
  fileURLToPath(new URL("../../../public/uploads/reports/", import.meta.url));
const PUBLIC_BASE_URL = (process.env.REPORT_IMAGE_PUBLIC_BASE_URL ?? "/uploads/reports").replace(
  /\/$/,
  ""
);
const S3_BUCKET = process.env.REPORT_IMAGE_S3_BUCKET;
const S3_ENDPOINT = process.env.REPORT_IMAGE_S3_ENDPOINT;
const S3_REGION = process.env.REPORT_IMAGE_S3_REGION ?? "auto";
const S3_ACCESS_KEY_ID = process.env.REPORT_IMAGE_S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.REPORT_IMAGE_S3_SECRET_ACCESS_KEY;

function s3Enabled(): boolean {
  return Boolean(S3_BUCKET && S3_ENDPOINT && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY);
}

const s3 = s3Enabled()
  ? new S3Client({
      region: S3_REGION,
      endpoint: S3_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: S3_ACCESS_KEY_ID as string,
        secretAccessKey: S3_SECRET_ACCESS_KEY as string
      }
    })
  : null;

async function publishFile(sourcePath: string, key: string): Promise<string> {
  const body = await fs.readFile(sourcePath);

  if (s3 && S3_BUCKET) {
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable"
      })
    );
    return `${PUBLIC_BASE_URL}/${key}`;
  }

  const target = path.join(PUBLIC_ROOT, key);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, body);
  return `${PUBLIC_BASE_URL}/${key}`;
}

export type ImageValidationResult =
  | { ok: true; files: File[] }
  | { ok: false; error: "too_many_photos" | "photo_too_large" | "invalid_photo_type" };

export function extractImageFiles(input: FormData): File[] {
  return input
    .getAll("photos")
    .concat(input.getAll("photo"))
    .filter((value): value is File => value instanceof File && value.size > 0);
}

export function validateImageFiles(files: File[]): ImageValidationResult {
  if (files.length > MAX_PHOTOS_PER_REPORT) {
    return { ok: false, error: "too_many_photos" };
  }

  for (const file of files) {
    if (file.size > MAX_PHOTO_BYTES) {
      return { ok: false, error: "photo_too_large" };
    }
    if (!ACCEPTED_TYPES.has(file.type)) {
      return { ok: false, error: "invalid_photo_type" };
    }
  }

  return { ok: true, files };
}

export async function processPendingPhotos(
  reportId: string,
  files: File[]
): Promise<ReportPhoto[]> {
  const safeReportId = reportId.replace(/[^a-z0-9-]/gi, "");
  const dir = path.join(PRIVATE_ROOT, safeReportId);
  await fs.mkdir(dir, { recursive: true });

  const photos: ReportPhoto[] = [];
  for (const file of files) {
    const id = randomUUID();
    const image = sharp(Buffer.from(await file.arrayBuffer()), {
      failOn: "truncated"
    }).rotate();

    const fullPath = path.join(dir, `${id}.webp`);
    const thumbPath = path.join(dir, `${id}-thumb.webp`);

    const fullBuffer = await image
      .clone()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    const thumbBuffer = await image
      .clone()
      .resize({ width: 480, height: 480, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 76 })
      .toBuffer();

    await fs.writeFile(fullPath, fullBuffer);
    await fs.writeFile(thumbPath, thumbBuffer);

    photos.push({
      id,
      original_name: file.name || undefined,
      mime_type: "image/webp",
      bytes: fullBuffer.byteLength,
      private_path: fullPath,
      thumbnail_private_path: thumbPath,
      created_at: new Date().toISOString()
    });
  }

  return photos;
}

export async function publishReportPhotos(report: CommunityReport): Promise<ReportPhoto[]> {
  const now = new Date().toISOString();

  const published: ReportPhoto[] = [];
  for (const photo of report.photos ?? []) {
    if (photo.hidden) {
      published.push(photo);
      continue;
    }

    const fileName = `${photo.id}.webp`;
    const thumbName = `${photo.id}-thumb.webp`;
    const key = `${report.id}/${fileName}`;
    const thumbKey = `${report.id}/${thumbName}`;
    const publicUrl = await publishFile(photo.private_path, key);
    const thumbnailUrl = await publishFile(photo.thumbnail_private_path, thumbKey);

    published.push({
      ...photo,
      public_url: publicUrl,
      thumbnail_url: thumbnailUrl,
      published_at: now
    });
  }

  return published;
}

export async function adminPhotoPreviews(report: CommunityReport) {
  return Promise.all(
    (report.photos ?? []).map(async (photo) => {
      if (photo.hidden) {
        return { id: photo.id, hidden: true };
      }

      try {
        const bytes = await fs.readFile(photo.thumbnail_private_path);
        return {
          id: photo.id,
          hidden: false,
          preview_data_url: `data:image/webp;base64,${bytes.toString("base64")}`
        };
      } catch {
        return { id: photo.id, hidden: false };
      }
    })
  );
}

export function publicPhotoUrls(photos: ReportPhoto[]) {
  const visible = photos.filter((photo) => !photo.hidden);
  return {
    photo_urls: visible.flatMap((photo) => (photo.public_url ? [photo.public_url] : [])),
    photo_thumbnail_urls: visible.flatMap((photo) =>
      photo.thumbnail_url ? [photo.thumbnail_url] : []
    )
  };
}
