// Runtime store for volunteer / civic initiatives. Curated examples live in
// data/curated; admin-created records are stored in Redis on Railway or a local
// JSON file in development.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { communityInitiatives as curatedInitiatives, projects, type CommunityInitiative } from "@lib/data";
import { redis, redisEnabled } from "./redis";

const KEY_INITIATIVE = (id: string) => `community-initiative:${id}`;
const KEY_MANUAL = "community-initiatives:manual";
const KEY_SEQ = "community-initiatives:seq";

const DATA_DIR =
  process.env.COMMUNITY_DATA_DIR ??
  process.env.REPORTS_DATA_DIR ??
  fileURLToPath(new URL("../../../.data/", import.meta.url));
const DATA_FILE = path.join(DATA_DIR, "community-initiatives.json");

const CATEGORIES = new Set([
  "public_transport",
  "parks",
  "waste",
  "environment",
  "civic",
  "social",
  "other"
]);
const STATUSES = new Set(["active", "recurring", "completed", "planned", "unknown"]);
const ORGANIZER_TYPES = new Set([
  "association",
  "foundation",
  "citizen_group",
  "municipal_partner",
  "company_volunteers",
  "unknown"
]);

type FileShape = {
  seq: number;
  initiatives: Record<string, CommunityInitiative>;
};

export type CommunityInitiativeInput = {
  id?: unknown;
  title_bg?: unknown;
  title_en?: unknown;
  summary_bg?: unknown;
  summary_en?: unknown;
  category?: unknown;
  status?: unknown;
  organizer?: {
    name_bg?: unknown;
    name_en?: unknown;
    type?: unknown;
    website_url?: unknown;
    facebook_url?: unknown;
    instagram_url?: unknown;
  };
  call_to_action_bg?: unknown;
  call_to_action_en?: unknown;
  location?: {
    lat?: unknown;
    lng?: unknown;
    address_bg?: unknown;
    address_en?: unknown;
    approximate?: unknown;
  };
  related_project_ids?: unknown;
  tags?: unknown;
  contact_links?: unknown;
  source_title?: unknown;
  source_url?: unknown;
  query_bg?: unknown;
  query_en?: unknown;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function optionalString(value: unknown): string | undefined {
  const cleaned = cleanString(value);
  return cleaned.length > 0 ? cleaned : undefined;
}

function validUrl(value: unknown): string | undefined {
  const cleaned = optionalString(value);
  if (!cleaned) return undefined;
  try {
    const url = new URL(cleaned);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function splitList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(cleanString).filter(Boolean);
  }
  return cleanString(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string): string {
  const ascii = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii || "manual";
}

async function nextSeq(): Promise<number> {
  if (redisEnabled()) {
    return Number(await redis("INCR", KEY_SEQ));
  }
  const store = await readFileStore();
  store.seq += 1;
  await writeFileStore(store);
  return store.seq;
}

async function readFileStore(): Promise<FileShape> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as FileShape;
    return { seq: parsed.seq ?? 0, initiatives: parsed.initiatives ?? {} };
  } catch {
    return { seq: 0, initiatives: {} };
  }
}

async function writeFileStore(data: FileShape): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`);
}

function sortInitiatives(items: CommunityInitiative[]): CommunityInitiative[] {
  return items.sort((a, b) => {
    const byDate = b.updated_at.localeCompare(a.updated_at);
    return byDate || a.title_bg.localeCompare(b.title_bg, "bg");
  });
}

export async function listManualCommunityInitiatives(): Promise<CommunityInitiative[]> {
  if (redisEnabled()) {
    const ids = ((await redis("SMEMBERS", KEY_MANUAL)) as string[]) ?? [];
    if (ids.length === 0) return [];
    const raws = (await redis("MGET", ...ids.map(KEY_INITIATIVE))) as (string | null)[];
    return sortInitiatives(
      raws
        .filter((raw): raw is string => Boolean(raw))
        .map((raw) => JSON.parse(raw) as CommunityInitiative)
    );
  }
  const store = await readFileStore();
  return sortInitiatives(Object.values(store.initiatives));
}

export async function listAllCommunityInitiatives(): Promise<CommunityInitiative[]> {
  const byId = new Map(curatedInitiatives.map((item) => [item.id, item]));
  for (const item of await listManualCommunityInitiatives()) byId.set(item.id, item);
  return sortInitiatives([...byId.values()]);
}

function validateProjectIds(ids: string[]): string[] {
  const projectIds = new Set(projects.map((project) => project.id));
  return ids.filter((id) => projectIds.has(id));
}

function buildContactLinks(input: CommunityInitiativeInput): CommunityInitiative["contact_links"] {
  const contactLinks: CommunityInitiative["contact_links"] = [];
  const websiteUrl = validUrl(input.organizer?.website_url);
  const facebookUrl = validUrl(input.organizer?.facebook_url);
  const instagramUrl = validUrl(input.organizer?.instagram_url);

  if (websiteUrl) contactLinks.push({ label_bg: "Сайт", label_en: "Website", type: "website", url: websiteUrl });
  if (facebookUrl) {
    contactLinks.push({
      label_bg: "Facebook страница",
      label_en: "Facebook page",
      type: "facebook",
      url: facebookUrl
    });
  }
  if (instagramUrl) {
    contactLinks.push({
      label_bg: "Instagram",
      label_en: "Instagram",
      type: "instagram",
      url: instagramUrl
    });
  }

  return contactLinks.length > 0 ? contactLinks : undefined;
}

export async function buildCommunityInitiative(
  input: CommunityInitiativeInput
): Promise<CommunityInitiative> {
  const titleBg = cleanString(input.title_bg);
  const summaryBg = cleanString(input.summary_bg);
  const organizerName = cleanString(input.organizer?.name_bg);
  const sourceTitle = cleanString(input.source_title);
  const sourceUrl = validUrl(input.source_url);
  const category = cleanString(input.category);
  const status = cleanString(input.status);
  const organizerType = cleanString(input.organizer?.type);
  const lat = Number(input.location?.lat);
  const lng = Number(input.location?.lng);
  const addressBg = cleanString(input.location?.address_bg);

  if (titleBg.length < 3) throw new Error("title_bg is required");
  if (summaryBg.length < 10) throw new Error("summary_bg is required");
  if (!CATEGORIES.has(category)) throw new Error("invalid category");
  if (!STATUSES.has(status)) throw new Error("invalid status");
  if (organizerName.length < 2) throw new Error("organizer.name_bg is required");
  if (!ORGANIZER_TYPES.has(organizerType)) throw new Error("invalid organizer type");
  if (!Number.isFinite(lat) || lat < 42 || lat > 42.25) throw new Error("invalid latitude");
  if (!Number.isFinite(lng) || lng < 24.6 || lng > 24.9) throw new Error("invalid longitude");
  if (addressBg.length < 3) throw new Error("location.address_bg is required");
  if (!sourceUrl || sourceTitle.length < 3) throw new Error("a public source title and URL are required");

  const proposedId = cleanString(input.id);
  const id =
    proposedId.match(/^community-plovdiv-[a-z0-9-]+$/)?.[0] ??
    `community-plovdiv-${slugify(cleanString(input.title_en) || titleBg)}-${await nextSeq()}`;
  const checkedAt = today();
  const websiteUrl = validUrl(input.organizer?.website_url);
  const facebookUrl = validUrl(input.organizer?.facebook_url);
  const instagramUrl = validUrl(input.organizer?.instagram_url);

  const initiative: CommunityInitiative = {
    id,
    title_bg: titleBg,
    title_en: cleanString(input.title_en) || titleBg,
    summary_bg: summaryBg,
    category,
    status,
    organizer: {
      name_bg: organizerName,
      type: organizerType
    },
    location: {
      lat,
      lng,
      address_bg: addressBg,
      approximate: input.location?.approximate !== false
    },
    sources: [
      {
        title: sourceTitle,
        url: sourceUrl,
        accessed_at: checkedAt
      }
    ],
    discovery: {
      method: "admin_manual",
      discovered_at: checkedAt,
      last_checked_at: checkedAt
    },
    data_quality: "manual_reviewed",
    updated_at: checkedAt
  };

  const summaryEn = optionalString(input.summary_en);
  const organizerNameEn = optionalString(input.organizer?.name_en);
  const addressEn = optionalString(input.location?.address_en);
  const callToActionBg = optionalString(input.call_to_action_bg);
  const callToActionEn = optionalString(input.call_to_action_en);
  const queryBg = optionalString(input.query_bg);
  const queryEn = optionalString(input.query_en);
  const tags = splitList(input.tags);
  const relatedProjectIds = validateProjectIds(splitList(input.related_project_ids));
  const contactLinks = buildContactLinks(input);

  if (summaryEn) initiative.summary_en = summaryEn;
  if (organizerNameEn) initiative.organizer.name_en = organizerNameEn;
  if (websiteUrl) initiative.organizer.website_url = websiteUrl;
  if (facebookUrl) initiative.organizer.facebook_url = facebookUrl;
  if (instagramUrl) initiative.organizer.instagram_url = instagramUrl;
  if (addressEn) initiative.location.address_en = addressEn;
  if (callToActionBg) initiative.call_to_action_bg = callToActionBg;
  if (callToActionEn) initiative.call_to_action_en = callToActionEn;
  if (tags.length > 0) initiative.tags = tags;
  if (relatedProjectIds.length > 0) initiative.related_project_ids = relatedProjectIds;
  if (contactLinks) initiative.contact_links = contactLinks;
  if (queryBg) initiative.discovery.query_bg = queryBg;
  if (queryEn) initiative.discovery.query_en = queryEn;

  return initiative;
}

export async function saveCommunityInitiative(
  input: CommunityInitiativeInput
): Promise<CommunityInitiative> {
  const initiative = await buildCommunityInitiative(input);

  if (redisEnabled()) {
    await redis("SET", KEY_INITIATIVE(initiative.id), JSON.stringify(initiative));
    await redis("SADD", KEY_MANUAL, initiative.id);
    return initiative;
  }

  const store = await readFileStore();
  store.initiatives[initiative.id] = initiative;
  await writeFileStore(store);
  return initiative;
}
