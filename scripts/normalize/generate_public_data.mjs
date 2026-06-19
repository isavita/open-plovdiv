import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const publicDir = path.join(root, "apps/web/public/data");
const historyPublicDir = path.join(publicDir, "history");

const files = [
  "projects.json",
  "community-initiatives.json",
  "budget-items.json",
  "city-archive.json",
  "fix-reports.json",
  "sources.json",
  "plovdiv-history.json",
  "plovdiv-landmarks.json",
  "historical-archive-items.json",
  "then-now-pairs.json",
  "primary-documents.json",
  "education-resources.json",
  "story-longreads.json",
  "notable-people.json",
  "person-relationships.json"
];

execFileSync(process.execPath, ["scripts/validate/validate_data.mjs"], {
  cwd: root,
  stdio: "inherit"
});

fs.mkdirSync(publicDir, { recursive: true });

for (const file of files) {
  const source = path.join(root, "data/curated", file);
  const target = path.join(publicDir, file);
  const json = JSON.parse(fs.readFileSync(source, "utf8"));
  fs.writeFileSync(target, `${JSON.stringify(json, null, 2)}\n`);
  console.log(`generated apps/web/public/data/${file}`);
}

fs.rmSync(historyPublicDir, { recursive: true, force: true });
fs.cpSync(path.join(root, "data/generated/history-knowledge"), historyPublicDir, {
  recursive: true
});
console.log("generated apps/web/public/data/history");
