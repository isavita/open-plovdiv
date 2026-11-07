import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const HOST = "openplovdiv.com";
const PENDING_RETRY_DELAYS_MS = [15000, 30000];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export async function submitIndexNow(key, urls, fetcher = fetch, wait = sleep) {
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key || "")) throw new Error("INDEXNOW_KEY missing or invalid");
  if (!Array.isArray(urls) || urls.length > 100000 || new Set(urls).size !== urls.length) throw new Error("Invalid URL list");
  for (const text of urls) {
    const url = new URL(text);
    if (url.origin !== `https://${HOST}` || url.search || url.hash || url.username || url.password) throw new Error("Refusing noncanonical URL");
  }
  const keyLocation = `https://${HOST}/${key}.txt`;
  const verification = await fetcher(keyLocation, { redirect: "error", signal: AbortSignal.timeout(20000), cache: "no-store" });
  if (!verification.ok || (await verification.text()).trim() !== key) throw new Error("Live IndexNow ownership file is missing or mismatched");
  if (!urls.length) { console.log("IndexNow ownership file verified; no changed URLs to submit."); return 0; }
  let lastStatus = 0;
  for (let i = 0; i < urls.length; i += 10000) {
    const batch = urls.slice(i, i + 10000);
    let endpoint = "https://api.indexnow.org/indexnow";
    let attempt = 0;
    for (;;) {
      const response = await fetcher(endpoint, {
        method: "POST", headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: HOST, key, keyLocation, urlList: batch }), signal: AbortSignal.timeout(30000), redirect: "error"
      });
      if (response.status === 200) {
        lastStatus = response.status;
        console.log(`${endpoint === "https://yandex.com/indexnow" ? "Yandex IndexNow" : "IndexNow"} accepted a batch of ${batch.length} URL(s), HTTP ${response.status}.`);
        break;
      }
      if (response.status === 403 && endpoint !== "https://yandex.com/indexnow") {
        // Participating search engines share IndexNow submissions. Direct
        // Bing validation can fail independently of another participant.
        console.log("IndexNow returned 403; trying the Yandex participant.");
        endpoint = "https://yandex.com/indexnow";
        attempt = 0;
        continue;
      }
      if (response.status !== 202) throw new Error(`IndexNow rejected a batch (${response.status}); no baseline was advanced`);
      const delay = PENDING_RETRY_DELAYS_MS[attempt++];
      if (delay === undefined) throw new Error("IndexNow key validation pending (202) after retries; no baseline was advanced. Re-run after the provider validates the ownership key.");
      console.log(`IndexNow key validation pending (202); retrying in ${delay / 1000} seconds.`);
      await wait(delay);
    }
  }
  return lastStatus;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const urls = JSON.parse(await readFile(process.argv[2], "utf8"));
  await submitIndexNow(process.env.INDEXNOW_KEY, urls);
}
