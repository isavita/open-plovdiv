import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// IndexNow requires a publicly reachable ownership file. The random key is
// supplied by Railway at build time, never committed to this public repository.
export async function writeIndexNowKey(key, outputDirectory) {
  if (!key) return false;
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error("Invalid INDEXNOW_KEY format");
  await writeFile(resolve(outputDirectory, `${key}.txt`), key, { encoding: "utf8", mode: 0o644 });
  return true;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await writeIndexNowKey(process.env.INDEXNOW_KEY, resolve("apps/web/dist/client"));
}
