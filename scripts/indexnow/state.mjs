import { appendFile, mkdir, rename } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

// Never silently fall back to an older snapshot or treat an incomplete list
// as first setup. A deleted/expired newest baseline needs explicit recovery.
export async function findBaselineRun(rawRuns, runId, artifactsFor, jobsFor) {
  const runs = [...rawRuns].sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
  for (const run of runs) {
    if (run.id === runId) continue;
    const artifact = (await artifactsFor(run.id)).find((item) => item.name === "indexnow-manifest");
    if (artifact) {
      if (artifact.expired) throw new Error("The latest successful IndexNow snapshot has expired. Restore it or deliberately re-establish the baseline after reviewing unsent changes.");
      return run.id;
    }
    const jobs = await jobsFor(run.id);
    if (jobs.some((job) => job.steps?.some((step) => step.name === "Save IndexNow baseline" && step.conclusion === "success"))) {
      throw new Error("The latest successful IndexNow snapshot is unavailable. Restore it or deliberately re-establish the baseline after reviewing unsent changes.");
    }
  }
  if (runs.length >= 100) throw new Error("Too many successful runs to safely determine whether an IndexNow baseline exists; investigate before bootstrapping.");
  return null;
}

async function main() {
  const repository = process.env.GITHUB_REPOSITORY;
  const token = process.env.GH_TOKEN;
  const runId = Number(process.env.GITHUB_RUN_ID);
  const currentId = Number(process.env.DEPLOYMENT_ID);
  const timestamp = Date.parse(process.env.DEPLOYED_AT || "");
  const refresh = process.env.INDEXNOW_REFRESH === "1";
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository || "") || !token || !runId || (!refresh && (!currentId || !Number.isFinite(timestamp)))) throw new Error("Missing GitHub deployment context");
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  async function github(path) {
    const response = await fetch(`https://api.github.com/repos/${repository}${path}`, { headers, signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    return response.json();
  }
  async function output(name, value) { await appendFile(process.env.GITHUB_OUTPUT, `${name}=${value}\n`); }
  await mkdir(".indexnow", { recursive: true });
  const { workflow_runs: runs } = await github("/actions/workflows/indexnow.yml/runs?status=success&per_page=100");
  const previous = await findBaselineRun(runs, runId,
    async (id) => (await github(`/actions/runs/${id}/artifacts?per_page=100`)).artifacts,
    async (id) => (await github(`/actions/runs/${id}/jobs?per_page=100`)).jobs);
  if (previous) {
    const result = spawnSync("gh", ["run", "download", String(previous), "--name", "indexnow-manifest", "--dir", ".indexnow/previous"], { stdio: "inherit" });
    if (result.status !== 0) throw new Error("Could not download IndexNow baseline");
    await rename(".indexnow/previous/current.json", ".indexnow/previous/manifest.json");
    await output("mode", "artifact");
    console.log("Using the latest successful IndexNow snapshot.");
    return;
  }
  await output("mode", "bootstrap");
  console.log(refresh ? "No IndexNow snapshot exists yet; nothing to refresh." : "First IndexNow run: establishing a baseline without notifying URLs.");
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
