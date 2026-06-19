// Export approved/published citizen reports to a public JSON snapshot.
// Reads from Upstash Redis when configured, otherwise the local file store.
// Output: apps/web/public/data/community-fix-reports.json
//
// This keeps the project transparent and lets the static site display community
// reports even when the dynamic API is unavailable.

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../..");
const dataDir = process.env.REPORTS_DATA_DIR ?? path.join(repoRoot, "apps/web/.data");
const sourceFile = path.join(dataDir, "community-reports.json");
const outFile = path.join(repoRoot, "apps/web/public/data/community-fix-reports.json");

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function toPublic(report) {
  return {
    id: report.id,
    title_bg: report.title_bg,
    title_en: report.title_en,
    description_bg: report.description_bg,
    description_en: report.description_en,
    category: report.category,
    status: report.public_status,
    location: report.location,
    photo_urls: report.photo_urls ?? [],
    photo_thumbnail_urls: report.photo_thumbnail_urls ?? [],
    source: report.source ?? "citizen_submission",
    created_at: report.created_at,
    updated_at: report.updated_at
  };
}

async function redis(...args) {
  const res = await fetch(REDIS_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args)
  });
  if (!res.ok) throw new Error(`Redis ${args[0]} failed: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`Redis error: ${data.error}`);
  return data.result;
}

async function fromRedis() {
  const ids = (await redis("SMEMBERS", "reports:published")) ?? [];
  if (ids.length === 0) return [];
  const raws = await redis("MGET", ...ids.map((id) => `report:${id}`));
  return raws
    .filter(Boolean)
    .map((raw) => JSON.parse(raw))
    .filter((r) => r.moderation_status === "published" && (r.kind ?? "fix_report") === "fix_report");
}

async function fromFile() {
  try {
    const raw = await fs.readFile(sourceFile, "utf8");
    const parsed = JSON.parse(raw);
    return Object.values(parsed.reports ?? {}).filter(
      (r) => r.moderation_status === "published" && (r.kind ?? "fix_report") === "fix_report"
    );
  } catch {
    return [];
  }
}

async function main() {
  const usingRedis = Boolean(REDIS_URL && REDIS_TOKEN);
  const reports = usingRedis ? await fromRedis() : await fromFile();
  reports.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));

  const payload = {
    generated_at: new Date().toISOString(),
    source: usingRedis ? "redis" : "file",
    count: reports.length,
    reports: reports.map(toPublic)
  };

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`exported ${reports.length} approved report(s) -> apps/web/public/data/community-fix-reports.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
