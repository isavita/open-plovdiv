import { appendFile, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { changedUrls, validateManifest } from "./manifest.mjs";

export function isStaleDeployment(previous, current) {
  validateManifest(previous); validateManifest(current);
  const currentTime = Date.parse(current.deployedAt), previousTime = Date.parse(previous.deployedAt);
  return currentTime < previousTime || (currentTime === previousTime && current.deploymentId <= previous.deploymentId);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const current = validateManifest(JSON.parse(await readFile(".indexnow/current.json", "utf8")));
  const previous = validateManifest(JSON.parse(await readFile(".indexnow/previous/manifest.json", "utf8")));
  if (isStaleDeployment(previous, current)) {
    console.log("Skipping an older or already processed deployment.");
    await appendFile(process.env.GITHUB_OUTPUT, "stale=true\n");
  } else {
    const urls = changedUrls(previous, current);
    await writeFile(".indexnow/changed.json", JSON.stringify(urls));
    await appendFile(process.env.GITHUB_OUTPUT, "stale=false\n");
    console.log(`${urls.length} added, changed, or removed canonical pages.`);
  }
}
