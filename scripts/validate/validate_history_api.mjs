import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { isDeepStrictEqual } from "node:util";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const root = process.cwd();
const clientDir = path.join(root, "apps/web/dist/client");
const schemaDir = path.join(root, "data/schemas");

if (!fs.existsSync(clientDir)) {
  throw new Error("history API: apps/web/dist/client is missing; run npm run build first");
}

const issues = [];
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function fail(message) {
  issues.push(message);
}

function fileForUrl(url) {
  return path.join(clientDir, url.replace(/^\//, ""));
}

function readText(url) {
  const filePath = fileForUrl(url);
  if (!fs.existsSync(filePath)) {
    fail(`missing file for ${url}`);
    return null;
  }
  const text = fs.readFileSync(filePath, "utf8");
  if (!text.trim()) fail(`empty file for ${url}`);
  return text;
}

function readJson(url) {
  const text = readText(url);
  if (text == null) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`invalid JSON at ${url}: ${error.message}`);
    return null;
  }
}

function formatErrors(errors = []) {
  return errors
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
}

function loadSchemas() {
  for (const entry of fs.readdirSync(schemaDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".schema.json")) continue;
    const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, entry.name), "utf8"));
    if (schema.$id && !ajv.getSchema(schema.$id)) ajv.addSchema(schema);
  }
}

function validateWithSchema(label, schemaFile, value) {
  const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, schemaFile), "utf8"));
  const validate = ajv.getSchema(schema.$id) ?? ajv.compile(schema);
  if (!validate(value)) {
    fail(`${label} failed ${schemaFile}: ${formatErrors(validate.errors)}`);
  }
}

function validateArrayWithSchema(label, schemaFile, records) {
  if (!Array.isArray(records)) {
    fail(`${label} expected array`);
    return;
  }
  for (const [index, record] of records.entries()) {
    const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, schemaFile), "utf8"));
    const validate = ajv.getSchema(schema.$id) ?? ajv.compile(schema);
    if (!validate(record)) {
      fail(`${label}[${index}] ${record?.id ?? "(missing id)"} failed ${schemaFile}: ${formatErrors(validate.errors)}`);
      return;
    }
  }
}

function countCsvRows(text) {
  let rows = text.length > 0 ? 1 : 0;
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      index += 1;
      continue;
    }
    if (char === '"') quoted = !quoted;
    if (char === "\n" && !quoted && index < text.length - 1) rows += 1;
  }
  return rows;
}

function assertSameJson(label, left, right) {
  if (!isDeepStrictEqual(left, right)) fail(`${label} does not match downloadable JSON`);
}

loadSchemas();

const index = readJson("/api/history/index.json");
const downloadableIndex = readJson("/data/history/index.json");
if (index && downloadableIndex) {
  validateWithSchema("/api/history/index.json", "history-index.schema.json", index);
  validateWithSchema("/data/history/index.json", "history-index.schema.json", downloadableIndex);
  assertSameJson("history index API", index, downloadableIndex);
}

const resources = [
  {
    key: "events",
    arrayKey: "events",
    schema: "knowledge-event.schema.json",
    indexCount: "events"
  },
  {
    key: "people",
    arrayKey: "people",
    schema: "knowledge-person.schema.json",
    indexCount: "people"
  },
  {
    key: "person_relationships",
    arrayKey: "person_relationships",
    schema: "knowledge-person-relationship.schema.json",
    indexCount: "person_relationships"
  },
  {
    key: "places",
    arrayKey: "places",
    schema: "knowledge-place.schema.json",
    indexCount: "places"
  },
  {
    key: "organizations",
    arrayKey: "organizations",
    schema: "knowledge-organization.schema.json",
    indexCount: "organizations"
  },
  {
    key: "sources",
    arrayKey: "sources",
    schema: "knowledge-source.schema.json",
    indexCount: "sources"
  },
  {
    key: "archive_items",
    arrayKey: "archive_items",
    schema: "historical-archive-item.schema.json"
  },
  {
    key: "then_now_pairs",
    arrayKey: "then_now_pairs",
    schema: "knowledge-then-now-pair.schema.json",
    indexCount: "then_now_pairs"
  },
  {
    key: "primary_documents",
    arrayKey: "primary_documents",
    schema: "primary-document.schema.json",
    indexCount: "primary_documents"
  },
  {
    key: "story_longreads",
    arrayKey: "story_longreads",
    schema: "story-longread.schema.json",
    indexCount: "story_longreads"
  },
  {
    key: "education_resources",
    arrayKey: "education_resources",
    schema: "education-resource.schema.json",
    indexCount: "lesson_plans"
  },
  {
    key: "editorial_signoffs",
    arrayKey: "editorial_signoffs",
    schema: "editorial-signoff.schema.json",
    indexCount: "editorial_signoff_logs"
  }
];

if (index) {
  for (const resource of resources) {
    const endpoint = index.endpoints?.[resource.key];
    const jsonDownload = index.downloads?.[`${resource.key}_json`];
    const csvDownload = index.downloads?.[`${resource.key}_csv`];
    if (!endpoint) {
      fail(`index.endpoints missing ${resource.key}`);
      continue;
    }
    if (!jsonDownload) fail(`index.downloads missing ${resource.key}_json`);
    if (!csvDownload) fail(`index.downloads missing ${resource.key}_csv`);

    const endpointPayload = readJson(endpoint);
    const downloadPayload = jsonDownload ? readJson(jsonDownload) : null;
    const endpointRows = endpointPayload?.[resource.arrayKey];
    if (!Array.isArray(endpointRows)) {
      fail(`${endpoint} must expose array field ${resource.arrayKey}`);
      continue;
    }
    if (endpointPayload.count !== endpointRows.length) {
      fail(`${endpoint} count ${endpointPayload.count} does not match ${resource.arrayKey}.length ${endpointRows.length}`);
    }
    if (resource.indexCount && index.counts?.[resource.indexCount] !== endpointRows.length) {
      fail(`index.counts.${resource.indexCount} ${index.counts?.[resource.indexCount]} does not match ${endpoint}`);
    }
    if (downloadPayload) {
      assertSameJson(`${endpoint}`, endpointRows, downloadPayload);
      validateArrayWithSchema(jsonDownload, resource.schema, downloadPayload);
    }

    const csvText = csvDownload ? readText(csvDownload) : null;
    if (csvText != null) {
      const expectedRows = endpointRows.length + 1;
      const actualRows = countCsvRows(csvText.trimEnd());
      if (actualRows !== expectedRows) {
        fail(`${csvDownload} expected ${expectedRows} CSV row(s), got ${actualRows}`);
      }
    }
  }

  const editorialReviewEndpoint = index.endpoints?.editorial_review;
  const editorialReviewJson = index.downloads?.editorial_review_json;
  const editorialReviewCsv = index.downloads?.editorial_review_csv;
  const reviewApi = editorialReviewEndpoint ? readJson(editorialReviewEndpoint) : null;
  const reviewDownload = editorialReviewJson ? readJson(editorialReviewJson) : null;
  if (!editorialReviewEndpoint) fail("index.endpoints missing editorial_review");
  if (!editorialReviewJson) fail("index.downloads missing editorial_review_json");
  if (!editorialReviewCsv) fail("index.downloads missing editorial_review_csv");
  if (reviewApi) validateWithSchema(editorialReviewEndpoint, "editorial-review.schema.json", reviewApi);
  if (reviewDownload) validateWithSchema(editorialReviewJson, "editorial-review.schema.json", reviewDownload);
  if (reviewApi && reviewDownload) assertSameJson(editorialReviewEndpoint, reviewApi, reviewDownload);
  if (reviewApi && !isDeepStrictEqual(index.editorial_review, reviewApi.summary)) {
    fail("index.editorial_review does not match editorial review summary");
  }
  const reviewCsvText = editorialReviewCsv ? readText(editorialReviewCsv) : null;
  if (reviewApi?.records && reviewCsvText != null) {
    const expectedRows = reviewApi.records.length + 1;
    const actualRows = countCsvRows(reviewCsvText.trimEnd());
    if (actualRows !== expectedRows) {
      fail(`${editorialReviewCsv} expected ${expectedRows} CSV row(s), got ${actualRows}`);
    }
  }

  const sourceCoverageEndpoint = index.endpoints?.source_coverage;
  const sourceCoverageJson = index.downloads?.source_coverage_json;
  const sourceCoverageCsv = index.downloads?.source_coverage_csv;
  const coverageApi = sourceCoverageEndpoint ? readJson(sourceCoverageEndpoint) : null;
  const coverageDownload = sourceCoverageJson ? readJson(sourceCoverageJson) : null;
  if (!sourceCoverageEndpoint) fail("index.endpoints missing source_coverage");
  if (!sourceCoverageJson) fail("index.downloads missing source_coverage_json");
  if (!sourceCoverageCsv) fail("index.downloads missing source_coverage_csv");
  if (coverageApi) validateWithSchema(sourceCoverageEndpoint, "source-coverage.schema.json", coverageApi);
  if (coverageDownload) validateWithSchema(sourceCoverageJson, "source-coverage.schema.json", coverageDownload);
  if (coverageApi && coverageDownload) assertSameJson(sourceCoverageEndpoint, coverageApi, coverageDownload);
  if (coverageApi && !isDeepStrictEqual(index.source_coverage, coverageApi.summary)) {
    fail("index.source_coverage does not match source coverage summary");
  }
  if (coverageApi?.records && index.counts?.source_coverage_records !== coverageApi.records.length) {
    fail(
      `index.counts.source_coverage_records ${index.counts?.source_coverage_records} does not match ${sourceCoverageEndpoint}`
    );
  }
  const coverageCsvText = sourceCoverageCsv ? readText(sourceCoverageCsv) : null;
  if (coverageApi?.records && coverageCsvText != null) {
    const expectedRows = coverageApi.records.length + 1;
    const actualRows = countCsvRows(coverageCsvText.trimEnd());
    if (actualRows !== expectedRows) {
      fail(`${sourceCoverageCsv} expected ${expectedRows} CSV row(s), got ${actualRows}`);
    }
  }
}

if (issues.length > 0) {
  console.error(`history API validation failed: ${issues.length} issue(s)`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`history API validation passed: ${resources.length + 3} JSON endpoints/downloads and CSV exports checked`);
