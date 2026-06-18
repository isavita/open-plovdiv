import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const root = process.cwd();
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const datasets = [
  {
    label: "projects",
    dataPath: "data/curated/projects.json",
    schemaPath: "data/schemas/project.schema.json",
    minRecords: 1
  },
  {
    label: "community initiatives",
    dataPath: "data/curated/community-initiatives.json",
    schemaPath: "data/schemas/community-initiative.schema.json",
    minRecords: 1
  },
  {
    label: "budget items",
    dataPath: "data/curated/budget-items.json",
    schemaPath: "data/schemas/budget-item.schema.json",
    minRecords: 1
  },
  {
    label: "city archive",
    dataPath: "data/curated/city-archive.json",
    schemaPath: "data/schemas/city-archive.schema.json",
    minRecords: 1
  },
  {
    label: "fix reports",
    dataPath: "data/curated/fix-reports.json",
    schemaPath: "data/schemas/fix-report.schema.json",
    minRecords: 0
  }
];

const forbiddenFixKeys = new Set([
  "name",
  "email",
  "phone",
  "ip",
  "ip_address",
  "user_id",
  "account_id",
  "submitted_by"
]);

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function formatErrors(errors = []) {
  return errors
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
}

function assertUniqueIds(records, label) {
  const seen = new Set();
  for (const record of records) {
    if (seen.has(record.id)) {
      throw new Error(`${label}: duplicate id ${record.id}`);
    }
    seen.add(record.id);
  }
}

function assertNoPrivateFixFields(records) {
  for (const record of records) {
    for (const key of Object.keys(record)) {
      if (forbiddenFixKeys.has(key.toLowerCase())) {
        throw new Error(`fix reports: private field "${key}" is not allowed`);
      }
    }
  }
}

function assertProjectBudgetLinks(projects, budgetItems) {
  const budgetIds = new Set(budgetItems.map((item) => item.id));
  for (const project of projects) {
    // The link is optional; only validate it when a project declares one.
    if (project.related_budget_item_id && !budgetIds.has(project.related_budget_item_id)) {
      throw new Error(
        `projects: ${project.id} references missing budget item ${project.related_budget_item_id}`
      );
    }
  }
}

function assertCommunityProjectLinks(initiatives, projects) {
  const projectIds = new Set(projects.map((project) => project.id));
  for (const initiative of initiatives) {
    for (const projectId of initiative.related_project_ids ?? []) {
      if (!projectIds.has(projectId)) {
        throw new Error(
          `community initiatives: ${initiative.id} references missing project ${projectId}`
        );
      }
    }
  }
}

function assertMayorArchiveCompleteness(cityArchive) {
  const mayors = cityArchive
    .filter((record) => record.kind === "mayor_term")
    .sort((a, b) => a.year_start - b.year_start || (a.year_end ?? 9999) - (b.year_end ?? 9999));
  const officialHistoricalTerms = mayors.filter((record) =>
    record.source_document.url.includes("/administration/mayor/mayors-of-plovdiv/")
  );
  const current = mayors.find(
    (record) => record.actor_bg === "Костадин Димитров" && record.year_start === 2023 && record.year_end == null
  );

  if (officialHistoricalTerms.length !== 65) {
    throw new Error(
      `city archive: expected 65 official historical mayor terms, got ${officialHistoricalTerms.length}`
    );
  }
  if (mayors.length !== 66) {
    throw new Error(`city archive: expected 66 mayor terms including incumbent, got ${mayors.length}`);
  }
  if (mayors[0]?.actor_bg !== "Атанас Самоковлиев" || mayors[0]?.year_start !== 1878) {
    throw new Error("city archive: first mayor term must be Атанас Самоковлиев in 1878");
  }
  if (officialHistoricalTerms.at(-1)?.actor_bg !== "Здравко Димитров") {
    throw new Error("city archive: official municipality list should end with Здравко Димитров");
  }
  if (!current) {
    throw new Error("city archive: missing incumbent mayor term for Костадин Димитров from 2023");
  }
}

const loaded = new Map();

for (const dataset of datasets) {
  const schema = readJson(dataset.schemaPath);
  const validate = ajv.compile(schema);
  const records = readJson(dataset.dataPath);

  if (!Array.isArray(records)) {
    throw new Error(`${dataset.label}: expected top-level array`);
  }
  if (records.length < dataset.minRecords) {
    throw new Error(
      `${dataset.label}: expected at least ${dataset.minRecords} records, got ${records.length}`
    );
  }

  records.forEach((record, index) => {
    if (!validate(record)) {
      throw new Error(
        `${dataset.label}[${index}] ${record.id || "(missing id)"}: ${formatErrors(validate.errors)}`
      );
    }
  });

  assertUniqueIds(records, dataset.label);
  loaded.set(dataset.label, records);
  console.log(`valid ${dataset.label}: ${records.length}`);
}

assertNoPrivateFixFields(loaded.get("fix reports"));
assertProjectBudgetLinks(loaded.get("projects"), loaded.get("budget items"));
assertCommunityProjectLinks(loaded.get("community initiatives"), loaded.get("projects"));
assertMayorArchiveCompleteness(loaded.get("city archive"));

console.log("data validation passed");
