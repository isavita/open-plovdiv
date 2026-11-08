import { appendFile, copyFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { validateManifest } from "./validate-baseline.mjs";

export function sameDeployment(previous, { id, sha, deployedAt }) {
  validateManifest(previous);
  const time = Date.parse(deployedAt || "");
  const previousTime = Date.parse(previous.deployedAt || "");
  if (!Number.isSafeInteger(id) || id < 1 || !/^[a-f0-9]{40}$/.test(sha || "") || !Number.isFinite(time)) throw new Error("Invalid deployment context");
  const same = previous.deploymentId === id && previous.sha === sha;
  if (!same && (previous.deploymentId === id || previousTime > time || (previousTime === time && previous.deploymentId >= id))) throw new Error("Latest deployment conflicts with or predates the saved IndexNow baseline");
  return same;
}

async function main() {
  const previous = JSON.parse(await readFile(".indexnow/previous/manifest.json", "utf8"));
  const same = sameDeployment(previous, { id: Number(process.env.DEPLOYMENT_ID), sha: process.env.DEPLOYMENT_SHA, deployedAt: process.env.DEPLOYED_AT });
  if (same) await copyFile(".indexnow/previous/manifest.json", ".indexnow/current.json");
  await appendFile(process.env.GITHUB_OUTPUT, `same=${same}\n`);
  console.log(same ? "The latest deployment is already submitted; refreshing the unchanged snapshot." : "The latest deployment still needs to be compared and submitted.");
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
