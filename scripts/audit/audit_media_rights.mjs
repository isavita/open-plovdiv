import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const strict = args.has("--strict");
const writeReport = args.has("--write");
const reportPath = path.join(root, "data/audits/media-rights-audit.json");
const commonsApi = "https://commons.wikimedia.org/w/api.php";
const userAgent = "OpenPlovdivMediaRightsAudit/1.0 (https://github.com/openai/open-plovdiv)";

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function cleanMetadata(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedLicense(value) {
  return cleanMetadata(value)
    .toLocaleLowerCase("en")
    .replace(/[\s._-]+/g, "");
}

function mediaUrlKey(value) {
  try {
    const url = new URL(value);
    return `${url.hostname}${decodeURIComponent(url.pathname)}`.toLocaleLowerCase("en");
  } catch {
    return String(value ?? "").trim().toLocaleLowerCase("en");
  }
}

function commonsFileTitle(pageUrl) {
  try {
    const url = new URL(pageUrl);
    if (url.hostname !== "commons.wikimedia.org") return null;
    const pathname = decodeURIComponent(url.pathname);
    if (!pathname.startsWith("/wiki/")) return null;
    const title = pathname.slice("/wiki/".length).replaceAll("_", " ");
    return /^File:/i.test(title) ? title : null;
  } catch {
    return null;
  }
}

function addMediaRecord(records, scope, media) {
  records.push({
    scope,
    source_type: "remote_media",
    title: commonsFileTitle(media.page_url),
    page_url: media.page_url,
    direct_url: media.url,
    listed_license: media.license,
    listed_credit: media.credit,
    local_path: null
  });
}

function collectRecords() {
  const records = [];
  const landmarks = readJson("data/curated/plovdiv-landmarks.json");
  const archiveItems = readJson("data/curated/historical-archive-items.json");
  const thenNowPairs = readJson("data/curated/then-now-pairs.json");
  const storyGalleries = readJson("data/curated/story-galleries.json");
  const cityArchive = readJson("data/curated/city-archive.json");
  const mayorCredits = readJson("data/curated/mayor-image-credits.json");

  for (const landmark of landmarks) {
    for (const [index, media] of (landmark.media ?? []).entries()) {
      addMediaRecord(records, `landmark:${landmark.id}:media:${index}`, media);
    }
  }

  for (const item of archiveItems) {
    addMediaRecord(records, `archive:${item.id}`, item.media);
  }

  for (const pair of thenNowPairs) {
    addMediaRecord(records, `then-now:${pair.id}:then`, pair.then_media);
    addMediaRecord(records, `then-now:${pair.id}:now`, pair.now_media);
  }

  for (const profile of storyGalleries) {
    for (const section of profile.sections) {
      for (const item of section.gallery) {
        if (item.media) {
          addMediaRecord(records, `story-gallery:${profile.id}:${section.section_index}`, item.media);
        }
      }
    }
  }

  for (const credit of mayorCredits) {
    records.push({
      scope: `mayor:${credit.slug}`,
      source_type: "local_mayor_portrait",
      title: commonsFileTitle(credit.source_page),
      page_url: credit.source_page,
      direct_url: null,
      listed_license: credit.license,
      listed_credit: credit.artist,
      local_path: path.join(root, "apps/web/public", credit.image.replace(/^\//, ""))
    });
  }

  const creditedMayorImages = new Set(mayorCredits.map((credit) => credit.image));
  const mayorImagesWithoutCredit = [
    ...new Set(
      cityArchive
        .filter((record) => record.kind === "mayor_term" && record.image)
        .map((record) => record.image)
    )
  ].filter((image) => !creditedMayorImages.has(image));

  return { records, thenNowPairs, mayorImagesWithoutCredit };
}

async function requestCommons(params) {
  const url = new URL(commonsApi);
  for (const [key, value] of Object.entries({
    action: "query",
    format: "json",
    formatversion: "2",
    origin: "*",
    redirects: "1",
    ...params
  })) {
    url.searchParams.set(key, value);
  }

  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": userAgent } });
      if (response.ok) return response.json();
      lastError = new Error(`Commons API returned ${response.status}`);
      if (response.status !== 429 && response.status < 500) throw lastError;
    } catch (error) {
      lastError = error;
    }
    await sleep(750 * 2 ** attempt);
  }
  throw lastError;
}

async function queryCommonsFiles(titles) {
  const pageByRequestedTitle = new Map();

  for (let index = 0; index < titles.length; index += 40) {
    const requestedTitles = titles.slice(index, index + 40);
    const payload = await requestCommons({
      prop: "imageinfo",
      iiprop: "url|size|extmetadata",
      titles: requestedTitles.join("|")
    });
    const alias = new Map([
      ...(payload.query?.normalized ?? []).map((entry) => [entry.from, entry.to]),
      ...(payload.query?.redirects ?? []).map((entry) => [entry.from, entry.to])
    ]);
    const pageByTitle = new Map((payload.query?.pages ?? []).map((page) => [page.title, page]));

    for (const requestedTitle of requestedTitles) {
      const resolvedTitle = alias.get(requestedTitle) ?? requestedTitle;
      pageByRequestedTitle.set(requestedTitle, pageByTitle.get(resolvedTitle) ?? null);
    }

    if (index + 40 < titles.length) await sleep(450);
  }

  return pageByRequestedTitle;
}

function auditPairDuplicates(thenNowPairs) {
  return thenNowPairs
    .filter((pair) => mediaUrlKey(pair.then_media?.url) === mediaUrlKey(pair.now_media?.url))
    .map((pair) => ({
      kind: "same_file_used_for_then_and_now",
      scope: `then-now:${pair.id}`,
      then_url: pair.then_media.url,
      now_url: pair.now_media.url
    }));
}

function auditRecord(record, page) {
  const issues = [];
  const localFilePresent = !record.local_path || fs.existsSync(record.local_path);
  if (!localFilePresent) issues.push("local_file_missing");

  if (!record.title) {
    issues.push("rights_source_is_not_a_commons_file");
    return {
      ...record,
      status: "requires_manual_rights_confirmation",
      local_file_present: localFilePresent,
      commons: null,
      issues
    };
  }

  const imageInfo = page?.imageinfo?.[0];
  if (!imageInfo) {
    issues.push("commons_file_missing_or_not_an_image");
    return {
      ...record,
      status: "failed",
      local_file_present: localFilePresent,
      commons: null,
      issues
    };
  }

  const metadata = imageInfo.extmetadata ?? {};
  const commonsLicense = cleanMetadata(metadata.LicenseShortName?.value);
  const commonsCredit = cleanMetadata(metadata.Artist?.value);
  const capturedAt = cleanMetadata(metadata.DateTimeOriginal?.value ?? metadata.DateTime?.value);

  if (normalizedLicense(record.listed_license) !== normalizedLicense(commonsLicense)) {
    issues.push("license_does_not_match_commons_metadata");
  }
  if (record.direct_url && mediaUrlKey(record.direct_url) !== mediaUrlKey(imageInfo.url)) {
    issues.push("direct_image_url_does_not_match_commons_metadata");
  }

  return {
    ...record,
    status: issues.length === 0 ? "verified" : "failed",
    local_file_present: localFilePresent,
    commons: {
      canonical_page_url: imageInfo.descriptionurl,
      canonical_direct_url: imageInfo.url,
      license: commonsLicense,
      credit: commonsCredit,
      captured_at: capturedAt,
      width: imageInfo.width,
      height: imageInfo.height
    },
    issues
  };
}

const { records, thenNowPairs, mayorImagesWithoutCredit } = collectRecords();
const commonsTitles = [...new Set(records.map((record) => record.title).filter(Boolean))];
const pagesByTitle = await queryCommonsFiles(commonsTitles);
const pairDuplicateIssues = auditPairDuplicates(thenNowPairs);
const auditedRecords = records.map((record) => auditRecord(record, record.title ? pagesByTitle.get(record.title) : null));
const issues = [
  ...pairDuplicateIssues,
  ...mayorImagesWithoutCredit.map((image) => ({
    kind: "mayor_portrait_has_no_credit_record",
    scope: `mayor-portrait:${image}`
  })),
  ...auditedRecords.flatMap((record) => record.issues.map((kind) => ({ kind, scope: record.scope })))
];
const summary = {
  records_total: auditedRecords.length,
  commons_file_references: auditedRecords.filter((record) => record.title).length,
  unique_commons_files: commonsTitles.length,
  verified: auditedRecords.filter((record) => record.status === "verified").length,
  requires_manual_rights_confirmation: auditedRecords.filter(
    (record) => record.status === "requires_manual_rights_confirmation"
  ).length,
  failed: auditedRecords.filter((record) => record.status === "failed").length,
  same_file_then_now_pairs: pairDuplicateIssues.length,
  mayor_portraits_without_credit_record: mayorImagesWithoutCredit.length,
  issues_total: issues.length
};
const report = {
  generated_at: new Date().toISOString(),
  policy:
    "Checks Wikimedia Commons file existence, licence labels, direct image URLs and local mayor portrait files. A non-Commons source is reported for manual rights confirmation rather than treated as open-licensed.",
  summary,
  issues,
  records: auditedRecords
};

if (writeReport) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`wrote media rights audit: ${path.relative(root, reportPath)}`);
}

console.log(
  `media rights audit: ${summary.verified}/${summary.records_total} verified, ` +
    `${summary.requires_manual_rights_confirmation} manual-rights checks, ` +
    `${summary.failed} failed records, ${summary.same_file_then_now_pairs} duplicate then/now pairs, ` +
    `${summary.mayor_portraits_without_credit_record} uncredited mayor portraits`
);

if (strict && summary.issues_total > 0) {
  console.error("media rights audit failed in strict mode; inspect the report or rerun with --write");
  process.exitCode = 1;
}
