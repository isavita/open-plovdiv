// Storage abstraction for citizen reports. Uses Upstash Redis when configured,
// otherwise a local JSON file (dev / no-infra). Keep this the only module that
// knows where reports physically live.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildReport,
  formatReportId,
  type CommunityReport,
  type CleanSubmission,
  type CleanReportUpdate,
  type ModerationStatus,
  type PublicStatus,
  type ReportPhoto
} from "./moderation";
import { redis, redisEnabled } from "./redis";

const KEY_REPORT = (id: string) => `report:${id}`;
const KEY_SEQ = "reports:seq";
const KEY_PENDING = "reports:pending";
const KEY_PUBLISHED = "reports:published";
const KEY_CATEGORY = (category: string) => `reports:by-category:${category}`;
const KEY_STATUS = (status: string) => `reports:by-status:${status}`;
const KEY_EVENTS = "reports:events";

// ---- Local file backend ----------------------------------------------------

const DATA_DIR =
  process.env.REPORTS_DATA_DIR ?? fileURLToPath(new URL("../../../.data/", import.meta.url));
const DATA_FILE = path.join(DATA_DIR, "community-reports.json");

type FileShape = { seq: number; reports: Record<string, CommunityReport> };

function normalizeReport(report: CommunityReport): CommunityReport {
  report.photo_urls ??= [];
  report.photo_thumbnail_urls ??= [];
  report.photos ??= [];
  report.audit ??= [];
  return report;
}

async function readFileStore(): Promise<FileShape> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as FileShape;
    const reports = Object.fromEntries(
      Object.entries(parsed.reports ?? {}).map(([id, report]) => [
        id,
        normalizeReport(report as CommunityReport)
      ])
    );
    return { seq: parsed.seq ?? 0, reports };
  } catch {
    return { seq: 0, reports: {} };
  }
}

async function writeFileStore(data: FileShape): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`);
}

// ---- Public store API ------------------------------------------------------

function sortNewest(reports: CommunityReport[]): CommunityReport[] {
  return reports.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function createReport(value: CleanSubmission): Promise<CommunityReport> {
  const year = new Date().getUTCFullYear();

  if (redisEnabled()) {
    const seq = Number(await redis("INCR", KEY_SEQ));
    const report = buildReport(value, formatReportId(year, seq));
    await redis("SET", KEY_REPORT(report.id), JSON.stringify(report));
    await redis("SADD", KEY_PENDING, report.id);
    await redis("SADD", KEY_CATEGORY(report.category), report.id);
    await redis("SADD", KEY_STATUS(report.public_status), report.id);
    return report;
  }

  const store = await readFileStore();
  store.seq += 1;
  const report = buildReport(value, formatReportId(year, store.seq));
  store.reports[report.id] = report;
  await writeFileStore(store);
  return report;
}

export async function getReport(id: string): Promise<CommunityReport | null> {
  if (redisEnabled()) {
    const raw = (await redis("GET", KEY_REPORT(id))) as string | null;
    return raw ? normalizeReport(JSON.parse(raw) as CommunityReport) : null;
  }
  const store = await readFileStore();
  return store.reports[id] ? normalizeReport(store.reports[id]) : null;
}

async function listByModeration(status: ModerationStatus): Promise<CommunityReport[]> {
  if (redisEnabled()) {
    const key = status === "needs_review" ? KEY_PENDING : KEY_PUBLISHED;
    const ids = ((await redis("SMEMBERS", key)) as string[]) ?? [];
    if (ids.length === 0) return [];
    const raws = (await redis("MGET", ...ids.map(KEY_REPORT))) as (string | null)[];
    const reports = raws
      .filter((r): r is string => Boolean(r))
      .map((r) => normalizeReport(JSON.parse(r) as CommunityReport))
      .filter((r) => r.moderation_status === status);
    return sortNewest(reports);
  }
  const store = await readFileStore();
  return sortNewest(
    Object.values(store.reports).filter((r) => r.moderation_status === status)
  );
}

export function listPending(): Promise<CommunityReport[]> {
  return listByModeration("needs_review");
}

export function listPublished(): Promise<CommunityReport[]> {
  return listByModeration("published");
}

async function persist(report: CommunityReport): Promise<void> {
  normalizeReport(report);
  if (redisEnabled()) {
    await redis("SET", KEY_REPORT(report.id), JSON.stringify(report));
    return;
  }
  const store = await readFileStore();
  store.reports[report.id] = report;
  await writeFileStore(store);
}

async function moveIndex(id: string, from: string, to: string): Promise<void> {
  if (!redisEnabled()) return; // file backend filters on the fly
  await redis("SREM", from, id);
  await redis("SADD", to, id);
}

async function moveStatusIndex(
  id: string,
  fromStatus: PublicStatus,
  toStatus: PublicStatus
): Promise<void> {
  if (!redisEnabled() || fromStatus === toStatus) return;
  await redis("SREM", KEY_STATUS(fromStatus), id);
  await redis("SADD", KEY_STATUS(toStatus), id);
}

async function publishEvent(report: CommunityReport): Promise<void> {
  if (!redisEnabled()) return;
  await redis(
    "PUBLISH",
    KEY_EVENTS,
    JSON.stringify({ type: "report_published", id: report.id, updated_at: report.updated_at })
  );
}

export async function attachPendingPhotos(
  id: string,
  photos: ReportPhoto[]
): Promise<CommunityReport | null> {
  const report = await getReport(id);
  if (!report) return null;
  const now = new Date().toISOString();
  report.photos = report.photos.concat(photos);
  report.updated_at = now;
  report.audit.push({ at: now, action: "photos_uploaded", note: String(photos.length) });
  await persist(report);
  return report;
}

export async function setReportPhotos(
  id: string,
  photos: ReportPhoto[],
  photoUrls: { photo_urls: string[]; photo_thumbnail_urls: string[] }
): Promise<CommunityReport | null> {
  const report = await getReport(id);
  if (!report) return null;
  const now = new Date().toISOString();
  report.photos = photos;
  report.photo_urls = photoUrls.photo_urls;
  report.photo_thumbnail_urls = photoUrls.photo_thumbnail_urls;
  report.updated_at = now;
  report.audit.push({ at: now, action: "photos_published", note: String(photoUrls.photo_urls.length) });
  await persist(report);
  return report;
}

export async function hideReportPhoto(
  id: string,
  photoId: string
): Promise<CommunityReport | null> {
  const report = await getReport(id);
  if (!report) return null;
  const photo = report.photos.find((item) => item.id === photoId);
  if (!photo) return null;
  const now = new Date().toISOString();
  photo.hidden = true;
  report.photos = report.photos.map((item) => (item.id === photoId ? photo : item));
  report.photo_urls = report.photos
    .filter((item) => !item.hidden && item.public_url)
    .map((item) => item.public_url as string);
  report.photo_thumbnail_urls = report.photos
    .filter((item) => !item.hidden && item.thumbnail_url)
    .map((item) => item.thumbnail_url as string);
  report.updated_at = now;
  report.audit.push({ at: now, action: "photo_hidden", note: photoId });
  await persist(report);
  return report;
}

export async function approveReport(
  id: string,
  publicStatus?: PublicStatus
): Promise<CommunityReport | null> {
  const report = await getReport(id);
  if (!report) return null;
  const now = new Date().toISOString();
  const previousStatus = report.public_status;
  report.moderation_status = "published";
  if (publicStatus) report.public_status = publicStatus;
  report.updated_at = now;
  report.audit.push({ at: now, action: "approved", note: publicStatus });
  await persist(report);
  await moveIndex(id, KEY_PENDING, KEY_PUBLISHED);
  await moveStatusIndex(id, previousStatus, report.public_status);
  await publishEvent(report);
  return report;
}

export async function rejectReport(
  id: string,
  reason?: string
): Promise<CommunityReport | null> {
  const report = await getReport(id);
  if (!report) return null;
  const now = new Date().toISOString();
  report.moderation_status = "rejected";
  report.rejection_reason = reason;
  report.updated_at = now;
  report.audit.push({ at: now, action: "rejected", note: reason });
  await persist(report);
  if (redisEnabled()) {
    await redis("SREM", KEY_PENDING, id);
    await redis("SREM", KEY_PUBLISHED, id);
  }
  return report;
}

export async function updateReportStatus(
  id: string,
  publicStatus: PublicStatus
): Promise<CommunityReport | null> {
  const report = await getReport(id);
  if (!report) return null;
  const now = new Date().toISOString();
  const previousStatus = report.public_status;
  report.public_status = publicStatus;
  report.updated_at = now;
  report.audit.push({ at: now, action: "update_status", note: publicStatus });
  await persist(report);
  await moveStatusIndex(id, previousStatus, publicStatus);
  if (report.moderation_status === "published") await publishEvent(report);
  return report;
}

export async function updateReportDetails(
  id: string,
  value: CleanReportUpdate
): Promise<CommunityReport | null> {
  const report = await getReport(id);
  if (!report) return null;
  const now = new Date().toISOString();
  const previousCategory = report.category;
  report.category = value.category;
  report.title_bg = value.title_bg;
  report.title_en = value.title_en;
  report.description_bg = value.description_bg;
  report.description_en = value.description_en;
  report.location = value.location;
  report.updated_at = now;
  report.audit.push({ at: now, action: "update_details" });
  await persist(report);
  if (redisEnabled() && previousCategory !== report.category) {
    await redis("SREM", KEY_CATEGORY(previousCategory), id);
    await redis("SADD", KEY_CATEGORY(report.category), id);
  }
  if (report.moderation_status === "published") await publishEvent(report);
  return report;
}
