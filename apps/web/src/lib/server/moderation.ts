// Pure domain logic for citizen reports: statuses, validation, IDs, sanitizing.
// No Redis / framework imports here so it can be unit-tested in isolation.

import type { Lang } from "@i18n/ui";

export type ModerationStatus =
  | "submitted"
  | "needs_review"
  | "approved"
  | "rejected"
  | "published";

export type PublicStatus =
  | "unverified"
  | "verified"
  | "sent_to_municipality"
  | "in_progress"
  | "fixed"
  | "closed";

export type ReportKind = "fix_report" | "history_contribution";

export const FIX_CATEGORIES = [
  "roads",
  "pavement",
  "street_lighting",
  "parks",
  "waste",
  "public_transport",
  "accessibility",
  "drainage",
  "other"
] as const;

export const HISTORY_CONTRIBUTION_CATEGORIES = [
  "historic_photo",
  "oral_memory",
  "source_tip",
  "history_correction"
] as const;

export const REPORT_CATEGORIES = [
  ...FIX_CATEGORIES,
  ...HISTORY_CONTRIBUTION_CATEGORIES
] as const;

export const PUBLIC_STATUSES: PublicStatus[] = [
  "unverified",
  "verified",
  "sent_to_municipality",
  "in_progress",
  "fixed",
  "closed"
];

// Plovdiv bounding box — mirrors the curated-data JSON schema.
export const PLOVDIV_BOUNDS = { latMin: 42, latMax: 42.25, lngMin: 24.6, lngMax: 24.9 };

export type AuditEntry = { at: string; action: string; note?: string };

export type ReportPhoto = {
  id: string;
  original_name?: string;
  mime_type: "image/webp";
  bytes: number;
  private_path: string;
  thumbnail_private_path: string;
  public_url?: string;
  thumbnail_url?: string;
  hidden?: boolean;
  created_at: string;
  published_at?: string;
};

export type CommunityReport = {
  id: string;
  kind: ReportKind;
  title_bg: string;
  title_en?: string;
  description_bg: string;
  description_en?: string;
  category: string;
  public_status: PublicStatus;
  moderation_status: ModerationStatus;
  location: { lat: number; lng: number; address_bg?: string; address_en?: string };
  photo_urls: string[];
  photo_thumbnail_urls: string[];
  photos: ReportPhoto[];
  source: "citizen_submission";
  source_url?: string;
  source_note?: string;
  lang: Lang;
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
  audit: AuditEntry[];
};

export type SubmissionInput = {
  kind?: unknown;
  category?: unknown;
  title?: unknown;
  description?: unknown;
  source_url?: unknown;
  source_note?: unknown;
  lat?: unknown;
  lng?: unknown;
  lang?: unknown;
  no_personal_data?: unknown;
  public_interest?: unknown;
};

export type ValidationResult =
  | { ok: true; value: CleanSubmission }
  | { ok: false; error: string };

export type CleanSubmission = {
  kind: ReportKind;
  category: string;
  title: string;
  description: string;
  source_url?: string;
  source_note?: string;
  lat: number;
  lng: number;
  lang: Lang;
};

export type ReportUpdateInput = {
  category?: unknown;
  title_bg?: unknown;
  title_en?: unknown;
  description_bg?: unknown;
  description_en?: unknown;
  lat?: unknown;
  lng?: unknown;
  address_bg?: unknown;
  address_en?: unknown;
};

export type CleanReportUpdate = {
  category: string;
  title_bg: string;
  title_en?: string;
  description_bg: string;
  description_en?: string;
  location: { lat: number; lng: number; address_bg?: string; address_en?: string };
};

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
// Seven or more digits in a row reads like a phone number — reject as PII.
const PHONE_RE = /\d[\d\s().-]{6,}\d/;

function clean(text: string): string {
  return text.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
}

function optionalClean(value: unknown): string | undefined {
  const text = clean(String(value ?? ""));
  return text ? text : undefined;
}

function optionalHttpUrl(value: unknown): string | undefined | null {
  const text = clean(String(value ?? ""));
  if (!text) return undefined;
  try {
    const url = new URL(text);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

function isBool(value: unknown): boolean {
  return value === true || value === "true" || value === "on" || value === "1";
}

export function validateSubmission(input: SubmissionInput): ValidationResult {
  const kind: ReportKind = input.kind === "history_contribution" ? "history_contribution" : "fix_report";
  const category = String(input.category ?? "");
  const allowedCategories =
    kind === "history_contribution" ? HISTORY_CONTRIBUTION_CATEGORIES : FIX_CATEGORIES;
  if (!(allowedCategories as readonly string[]).includes(category)) {
    return { ok: false, error: "invalid_category" };
  }

  const title = clean(String(input.title ?? ""));
  if (title.length < 3 || title.length > 120) {
    return { ok: false, error: "invalid_title" };
  }

  const description = clean(String(input.description ?? ""));
  if (description.length < 10 || description.length > 1000) {
    return { ok: false, error: "invalid_description" };
  }

  const sourceUrl = optionalHttpUrl(input.source_url);
  if (sourceUrl === null) return { ok: false, error: "invalid_source" };
  const sourceNote = optionalClean(input.source_note);
  if (sourceNote && sourceNote.length > 500) return { ok: false, error: "invalid_source" };

  const combined = `${title} ${description} ${sourceNote ?? ""}`;
  if (EMAIL_RE.test(combined) || PHONE_RE.test(combined)) {
    return { ok: false, error: "contains_personal_data" };
  }

  const lat = Number(input.lat);
  const lng = Number(input.lng);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < PLOVDIV_BOUNDS.latMin ||
    lat > PLOVDIV_BOUNDS.latMax ||
    lng < PLOVDIV_BOUNDS.lngMin ||
    lng > PLOVDIV_BOUNDS.lngMax
  ) {
    return { ok: false, error: "invalid_location" };
  }

  const lang: Lang =
    input.lang === "en" || input.lang === "de" || input.lang === "fr" || input.lang === "it"
      ? input.lang
      : "bg";

  if (!isBool(input.no_personal_data) || !isBool(input.public_interest)) {
    return { ok: false, error: "missing_confirmation" };
  }

  return { ok: true, value: { kind, category, title, description, source_url: sourceUrl, source_note: sourceNote, lat, lng, lang } };
}

export function validateReportUpdate(
  input: ReportUpdateInput
): { ok: true; value: CleanReportUpdate } | { ok: false; error: string } {
  const category = String(input.category ?? "");
  if (!REPORT_CATEGORIES.includes(category as (typeof REPORT_CATEGORIES)[number])) {
    return { ok: false, error: "invalid_category" };
  }

  const title_bg = clean(String(input.title_bg ?? ""));
  if (title_bg.length < 3 || title_bg.length > 120) {
    return { ok: false, error: "invalid_title" };
  }

  const title_en = optionalClean(input.title_en);
  if (title_en && (title_en.length < 3 || title_en.length > 120)) {
    return { ok: false, error: "invalid_title" };
  }

  const description_bg = clean(String(input.description_bg ?? ""));
  if (description_bg.length < 10 || description_bg.length > 1000) {
    return { ok: false, error: "invalid_description" };
  }

  const description_en = optionalClean(input.description_en);
  if (description_en && (description_en.length < 10 || description_en.length > 1000)) {
    return { ok: false, error: "invalid_description" };
  }

  const combined = [title_bg, title_en, description_bg, description_en].filter(Boolean).join(" ");
  if (EMAIL_RE.test(combined) || PHONE_RE.test(combined)) {
    return { ok: false, error: "contains_personal_data" };
  }

  const lat = Number(input.lat);
  const lng = Number(input.lng);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < PLOVDIV_BOUNDS.latMin ||
    lat > PLOVDIV_BOUNDS.latMax ||
    lng < PLOVDIV_BOUNDS.lngMin ||
    lng > PLOVDIV_BOUNDS.lngMax
  ) {
    return { ok: false, error: "invalid_location" };
  }

  const address_bg = optionalClean(input.address_bg);
  const address_en = optionalClean(input.address_en);
  if ((address_bg && address_bg.length > 160) || (address_en && address_en.length > 160)) {
    return { ok: false, error: "invalid_location" };
  }

  return {
    ok: true,
    value: {
      category,
      title_bg,
      title_en,
      description_bg,
      description_en,
      location: { lat, lng, address_bg, address_en }
    }
  };
}

export function formatReportId(year: number, seq: number, kind: ReportKind = "fix_report"): string {
  const prefix = kind === "history_contribution" ? "history-plovdiv" : "fix-plovdiv";
  return `${prefix}-${year}-${String(seq).padStart(6, "0")}`;
}

/** Build a fresh pending report from a validated submission. */
export function buildReport(value: CleanSubmission, id: string): CommunityReport {
  const now = new Date().toISOString();
  const report: CommunityReport = {
    id,
    kind: value.kind,
    title_bg: value.title,
    description_bg: value.description,
    category: value.category,
    public_status: "unverified",
    moderation_status: "needs_review",
    location: { lat: value.lat, lng: value.lng },
    photo_urls: [],
    photo_thumbnail_urls: [],
    photos: [],
    source: "citizen_submission",
    source_url: value.source_url,
    source_note: value.source_note,
    lang: value.lang,
    created_at: now,
    updated_at: now,
    audit: [{ at: now, action: "submitted" }]
  };
  // Mirror the submitted text into the matching language field so the report
  // displays in the language it was written in (we do not auto-translate).
  if (value.lang !== "bg") {
    report.title_en = value.title;
    report.description_en = value.description;
  }
  return report;
}

/** Shape an approved report for the public Fix Map (status = public_status). */
export function toPublicReport(report: CommunityReport) {
  return {
    id: report.id,
    title_bg: report.title_bg,
    title_en: report.title_en,
    description_bg: report.description_bg,
    description_en: report.description_en,
    category: report.category,
    status: report.public_status,
    location: report.location,
    photo_urls: report.photo_urls,
    photo_thumbnail_urls: report.photo_thumbnail_urls,
    source: report.source,
    created_at: report.created_at,
    updated_at: report.updated_at
  };
}
