import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const publicDir = path.join(root, "apps/web/public/data");

const files = [
  "projects.json",
  "community-initiatives.json",
  "budget-items.json",
  "city-archive.json",
  "fix-reports.json",
  "sources.json"
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
