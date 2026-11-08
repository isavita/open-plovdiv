import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildManifest, changedUrls, sitemapUrls } from "./manifest.mjs";
import { submitIndexNow } from "./submit.mjs";
import { writeIndexNowKey } from "./write-key.mjs";

const sha = "a".repeat(40), deployedAt = "2026-11-07T00:00:00Z";
test("verification key stays outside source and validates input", async () => {
  const root = await mkdtemp(join(tmpdir(), "indexnow-key-"));
  try {
    assert.equal(await writeIndexNowKey(undefined, root), false);
    await assert.rejects(writeIndexNowKey("../secret", root));
    assert.equal(await writeIndexNowKey("abcd1234-efgh5678", root), true);
    assert.equal(await readFile(join(root, "abcd1234-efgh5678.txt"), "utf8"), "abcd1234-efgh5678");
  } finally { await rm(root, { recursive: true, force: true }); }
});
test("manifest captures semantic changes and ignores script-only changes", async () => {
  const root = await mkdtemp(join(tmpdir(), "indexnow-manifest-"));
  const url = "https://openplovdiv.com/en/places";
  const page = (content, script) => `<!doctype html><html lang="en"><head><title>Places</title><link rel="canonical" href="${url}"></head><body><main><h1>Places</h1><p>${content}</p><script>${script}</script></main></body></html>`;
  try {
    await mkdir(join(root, "en/places"), { recursive: true });
    await writeFile(join(root, "sitemap.xml"), `<urlset><url><loc>${url}</loc></url></urlset>`);
    await writeFile(join(root, "en/places/index.html"), page("Ancient landmarks", "one()"));
    const initial = await buildManifest(root, sha, deployedAt, 1);
    await writeFile(join(root, "en/places/index.html"), page("Ancient landmarks", "two()"));
    const scriptOnly = await buildManifest(root, sha, deployedAt, 1);
    assert.deepEqual(changedUrls(initial, scriptOnly), []);
    await writeFile(join(root, "en/places/index.html"), page("New landmarks", "two()"));
    const changed = await buildManifest(root, sha, deployedAt, 1);
    assert.deepEqual(changedUrls(initial, changed), [url]);
    assert.deepEqual(changedUrls(changed, { ...changed, pages: {} }), [url]);
    await mkdir(join(root, "api/history"), { recursive: true });
    await writeFile(join(root, "api/history/places.json"), '{"count":1}');
    await writeFile(join(root, "en/places/index.html"), page("New landmarks", "two()").replace("</main>", '<script type="application/json">{"api":"/api/history/places.json"}</script></main>'));
    const withClientData = await buildManifest(root, sha, deployedAt, 1);
    await writeFile(join(root, "api/history/places.json"), '{"count":2}');
    assert.deepEqual(changedUrls(withClientData, await buildManifest(root, sha, deployedAt, 1)), [url]);
    assert.throws(() => sitemapUrls("<urlset><url><loc>https://example.org/</loc></url></urlset>"));
  } finally { await rm(root, { recursive: true, force: true }); }
});
test("submit verifies the live key, uses canonical URLs, and fails closed", async () => {
  const key = "abc12345def67890", url = "https://openplovdiv.com/en/places";
  const calls = [];
  const fetcher = async (target, options) => {
    calls.push({ target, options });
    return target.endsWith(".txt") ? new Response(key, { status: 200 }) : new Response(null, { status: 200 });
  };
  assert.equal(await submitIndexNow(key, [url], fetcher), 200);
  assert.equal(calls.length, 2);
  assert.deepEqual(JSON.parse(calls[1].options.body).urlList, [url]);
  await assert.rejects(submitIndexNow(key, ["https://other.example/"], fetcher));
  await assert.rejects(submitIndexNow(key, [url, url], fetcher));
  const badKey = async () => new Response("different", { status: 200 });
  await assert.rejects(submitIndexNow(key, [url], badKey), /mismatched/);
  const reject = async (target) => target.endsWith(".txt") ? new Response(key) : new Response(null, { status: 429 });
  await assert.rejects(submitIndexNow(key, [url], reject), /429/);
  const pending = async (target) => target.endsWith(".txt") ? new Response(key) : new Response(null, { status: 202 });
  const delays = [];
  await assert.rejects(submitIndexNow(key, [url], pending, async (ms) => delays.push(ms)), /validation pending \(202\) after retries; no baseline was advanced/);
  assert.deepEqual(delays, [15000, 30000]);
  let attempts = 0;
  const eventuallyAccepted = async (target) => target.endsWith(".txt") ? new Response(key) : new Response(null, { status: ++attempts < 3 ? 202 : 200 });
  assert.equal(await submitIndexNow(key, [url], eventuallyAccepted, async () => {}), 200);
  assert.equal(attempts, 3);
  const forbiddenCalls = [];
  const forbidden = async (target) => {
    forbiddenCalls.push(target);
    return target.endsWith(".txt") ? new Response(key) : new Response(null, { status: 403 });
  };
  await assert.rejects(submitIndexNow(key, [url], forbidden, () => { throw new Error("403 must not be retried"); }), /403/);
  assert.deepEqual(forbiddenCalls.slice(1), ["https://api.indexnow.org/indexnow", "https://yandex.com/indexnow"]);
  const fallbackCalls = [];
  const fallback = async (target) => {
    fallbackCalls.push(target);
    return target.endsWith(".txt") ? new Response(key) : new Response(null, { status: target === "https://yandex.com/indexnow" ? 200 : 403 });
  };
  assert.equal(await submitIndexNow(key, [url], fallback, async () => {}), 200);
  assert.deepEqual(fallbackCalls.slice(1), ["https://api.indexnow.org/indexnow", "https://yandex.com/indexnow"]);
  let primaryAfterPending = 0;
  const pendingThenForbidden = async (target) => {
    if (target.endsWith(".txt")) return new Response(key);
    if (target === "https://yandex.com/indexnow") return new Response(null, { status: 200 });
    return new Response(null, { status: ++primaryAfterPending === 1 ? 202 : 403 });
  };
  assert.equal(await submitIndexNow(key, [url], pendingThenForbidden, async () => {}), 200);
  assert.equal(primaryAfterPending, 2);
  let fallbackPendingCount = 0;
  const fallbackPending = async (target) => {
    if (target.endsWith(".txt")) return new Response(key);
    if (target === "https://api.indexnow.org/indexnow") return new Response(null, { status: 403 });
    fallbackPendingCount++;
    return new Response(null, { status: 202 });
  };
  await assert.rejects(submitIndexNow(key, [url], fallbackPending, async () => {}), /validation pending.*no baseline was advanced/);
  assert.equal(fallbackPendingCount, 3);
  const errorCalls = [];
  const unavailable = async (target) => {
    errorCalls.push(target);
    return target.endsWith(".txt") ? new Response(key) : new Response(null, { status: 503 });
  };
  await assert.rejects(submitIndexNow(key, [url], unavailable, async () => {}), /503/);
  assert.deepEqual(errorCalls.slice(1), ["https://api.indexnow.org/indexnow"]);
  const largeList = Array.from({ length: 10001 }, (_, n) => `https://openplovdiv.com/page-${n}`);
  const batches = [];
  const largeFetcher = async (target, options) => {
    if (target.endsWith(".txt")) return new Response(key);
    batches.push(JSON.parse(options.body).urlList.length);
    return new Response(null, { status: 200 });
  };
  await submitIndexNow(key, largeList, largeFetcher);
  assert.deepEqual(batches, [10000, 1]);
  const fallbackBatches = [];
  const largeFallback = async (target, options) => {
    if (target.endsWith(".txt")) return new Response(key);
    if (target === "https://api.indexnow.org/indexnow") return new Response(null, { status: 403 });
    fallbackBatches.push(JSON.parse(options.body).urlList.length);
    return new Response(null, { status: 200 });
  };
  assert.equal(await submitIndexNow(key, largeList, largeFallback, async () => {}), 200);
  assert.deepEqual(fallbackBatches, [10000, 1]);
  let submittedBatches = 0;
  const partlyPending = async (target) => {
    if (target.endsWith(".txt")) return new Response(key);
    submittedBatches += 1;
    return new Response(null, { status: submittedBatches === 1 ? 200 : 202 });
  };
  await assert.rejects(submitIndexNow(key, largeList, partlyPending, async () => {}), /validation pending/);
  assert.equal(submittedBatches, 4);
});

test("baseline lookup fails closed for expired, deleted, or incomplete state", async () => {
  const { findBaselineRun } = await import("./state.mjs");
  const runs = [{ id: 1, updated_at: "2026-01-01T00:00:00Z" }, { id: 2, updated_at: "2026-02-01T00:00:00Z" }];
  const none = async () => [];
  assert.equal(await findBaselineRun(runs, 3, async (id) => id === 1 ? [{ name: "indexnow-manifest", expired: false }] : [], none), 1);
  await assert.rejects(findBaselineRun(runs, 3, async (id) => id === 2 ? [{ name: "indexnow-manifest", expired: true }] : [{ name: "indexnow-manifest", expired: false }], none), /expired/);
  await assert.rejects(findBaselineRun(runs, 3, none, async (id) => id === 2 ? [{ steps: [{ name: "Save IndexNow baseline", conclusion: "success" }] }] : []), /unavailable/);
  assert.equal(await findBaselineRun([], 3, none, none), null);
  const hundred = Array.from({ length: 100 }, (_, id) => ({ id, updated_at: "2026-02-01T00:00:00Z" }));
  await assert.rejects(findBaselineRun(hundred, 999, none, none), /Too many/);
});

test("older and repeated deployments cannot advance the baseline", async () => {
  const { isStaleDeployment } = await import("./compare.mjs");
  const previous = { schema: 1, sha, deployedAt, deploymentId: 10, pages: {} };
  assert.equal(isStaleDeployment(previous, { ...previous }), true);
  assert.equal(isStaleDeployment(previous, { ...previous, deploymentId: 9 }), true);
  assert.equal(isStaleDeployment(previous, { ...previous, deploymentId: 11 }), false);
  assert.equal(isStaleDeployment(previous, { ...previous, deployedAt: "2025-01-01T00:00:00Z", deploymentId: 11 }), true);
});

test("scheduled retries select only the latest successful Railway production deployment", async () => {
  const { latestProductionDeployment } = await import("./live.mjs");
  const bot = { __typename: "Bot", login: "railway-app" };
  const deployment = (id, timestamp, changes = {}) => ({
    databaseId: id, commitOid: sha, creator: bot,
    payload: JSON.stringify({ environmentId: "c1a0a96b-c810-475b-bef5-584d4ed26630" }),
    statuses: { nodes: [{ state: "SUCCESS", createdAt: timestamp, creator: bot }] }, ...changes
  });
  const first = deployment(1, "2026-11-01T00:00:00Z");
  const latest = deployment(2, "2026-11-02T00:00:00Z");
  const otherEnvironment = deployment(3, "2026-11-03T00:00:00Z", { payload: "{}" });
  const untrusted = deployment(4, "2026-11-04T00:00:00Z", { creator: { __typename: "User", login: "railway-app" } });
  const failed = deployment(5, "2026-11-05T00:00:00Z", { statuses: { nodes: [{ state: "FAILURE", createdAt: "2026-11-05T00:00:00Z", creator: bot }] } });
  assert.equal(latestProductionDeployment([first, otherEnvironment, untrusted, failed, latest]).id, 2);
  assert.throws(() => latestProductionDeployment([otherEnvironment, untrusted, failed]), /Could not establish/);
});

test("retry refreshes only an already accepted deployment and rejects an older or inconsistent baseline", async () => {
  const { sameDeployment } = await import("./baseline-status.mjs");
  const previous = { schema: 1, sha, deployedAt, deploymentId: 10, pages: {} };
  assert.equal(sameDeployment(previous, { id: 10, sha, deployedAt }), true);
  assert.equal(sameDeployment(previous, { id: 10, sha, deployedAt: "2026-11-08T00:00:00Z" }), true);
  assert.equal(sameDeployment(previous, { id: 11, sha, deployedAt: "2026-11-08T00:00:00Z" }), false);
  assert.throws(() => sameDeployment(previous, { id: 9, sha, deployedAt: "2026-11-06T00:00:00Z" }), /predates/);
  assert.throws(() => sameDeployment(previous, { id: 10, sha: "b".repeat(40), deployedAt }), /conflicts/);
  assert.throws(() => sameDeployment({ ...previous, schema: 2 }, { id: 10, sha, deployedAt }), /Invalid/);
  assert.throws(() => sameDeployment({ ...previous, pages: { "https://other.example/": "a".repeat(64) } }, { id: 10, sha, deployedAt }), /Invalid IndexNow page/);
  assert.throws(() => sameDeployment({ ...previous, pages: { "https://openplovdiv.com/": "bad-hash" } }, { id: 10, sha, deployedAt }), /Invalid IndexNow page/);
});
