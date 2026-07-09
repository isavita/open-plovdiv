import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const root = process.cwd();
const serverEntry = path.join(root, "apps/web/dist/server/entry.mjs");
const productionServer = path.join(root, "apps/web/server/production-server.mjs");
const outputPath = path.join(root, "apps/web/dist/lighthouse-mobile-summary.json");
const minimumScore = Number.parseFloat(process.env.LIGHTHOUSE_MIN_SCORE ?? "0.95");
const routes = (process.env.LIGHTHOUSE_ROUTES ?? "/,/history/,/en/history/,/people/,/places/,/stories/,/routes/")
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);
const categories = ["performance", "accessibility", "best-practices", "seo"];

if (!fs.existsSync(serverEntry)) {
  throw new Error("lighthouse mobile: apps/web/dist/server/entry.mjs is missing; run npm run build first");
}

if (!fs.existsSync(productionServer)) {
  throw new Error("lighthouse mobile: apps/web/server/production-server.mjs is missing");
}

function candidateChromePaths() {
  return [
    process.env.CHROME_PATH,
    process.env.LIGHTHOUSE_CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium"
  ].filter(Boolean);
}

function resolveChromePath() {
  for (const executablePath of candidateChromePaths()) {
    if (fs.existsSync(executablePath)) return executablePath;
  }
  try {
    return chromeLauncher.getChromePath();
  } catch {
    return null;
  }
}

async function getFreePort() {
  return await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

async function waitForServer(origin, timeoutMs = 30000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {
      // Retry until the production server is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`lighthouse mobile: production server did not become ready at ${origin}`);
}

function requestRaw(origin, route, headers = {}) {
  const url = new URL(route, origin);
  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        headers
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("error", reject);
        response.on("end", () => {
          resolve({
            statusCode: response.statusCode ?? 0,
            headers: response.headers,
            body: Buffer.concat(chunks)
          });
        });
      }
    );
    request.once("error", reject);
    request.end();
  });
}

function headerIncludes(headers, name, expectedToken) {
  const value = headers[name.toLowerCase()];
  return String(Array.isArray(value) ? value.join(",") : value ?? "")
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .includes(expectedToken.toLowerCase());
}

async function assertCompressedRepresentation(origin, route, label) {
  const identity = await requestRaw(origin, route);
  const coded = await requestRaw(origin, route, { "Accept-Encoding": "br, gzip" });
  const contentEncoding = String(coded.headers["content-encoding"] ?? "").toLowerCase();

  if (identity.statusCode !== 200 || coded.statusCode !== 200) {
    throw new Error(`lighthouse mobile: ${label} compression check expected 200 responses`);
  }
  if (!new Set(["br", "gzip"]).has(contentEncoding)) {
    throw new Error(`lighthouse mobile: ${label} was not Brotli/gzip encoded for an accepting client`);
  }
  if (!headerIncludes(coded.headers, "vary", "accept-encoding")) {
    throw new Error(`lighthouse mobile: ${label} is encoded without Vary: Accept-Encoding`);
  }
  if (coded.body.byteLength >= identity.body.byteLength) {
    throw new Error(
      `lighthouse mobile: ${label} coded payload (${coded.body.byteLength} B) is not smaller than identity (${identity.body.byteLength} B)`
    );
  }

  return identity.body.toString("utf8");
}

async function validateCompression(origin) {
  const html = await assertCompressedRepresentation(origin, "/routes/", "visitor routes HTML");
  const stylesheetMatch = html.match(/<link[^>]+href=["']([^"']+\.css(?:\?[^"']*)?)["']/i);
  if (!stylesheetMatch) {
    throw new Error("lighthouse mobile: could not find a stylesheet to verify production compression");
  }
  const stylesheet = new URL(stylesheetMatch[1], origin);
  if (stylesheet.origin !== origin) {
    throw new Error("lighthouse mobile: first visitor-routes stylesheet is not same-origin");
  }
  await assertCompressedRepresentation(origin, `${stylesheet.pathname}${stylesheet.search}`, "visitor routes CSS");
  console.log("lighthouse mobile: verified Brotli/gzip negotiation for visitor routes HTML and CSS");
}

async function validateCompressionSafety() {
  const compressionModule = pathToFileURL(path.join(root, "apps/web/server/compression.mjs")).href;
  const { applyCompression } = await import(compressionModule);
  const safetyServer = http.createServer((request, response) => {
    applyCompression(request, response);
    if (request.url === "/redirect") {
      response.writeHead(302, { Location: "/routes/", "Content-Type": "text/html; charset=utf-8" });
      response.end();
      return;
    }
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end();
  });

  await new Promise((resolve, reject) => {
    safetyServer.once("error", reject);
    safetyServer.listen(0, "127.0.0.1", resolve);
  });
  const address = safetyServer.address();
  const origin = `http://127.0.0.1:${typeof address === "object" && address ? address.port : 0}`;

  try {
    const headers = { "Accept-Encoding": "br, gzip" };
    const [redirect, empty] = await Promise.all([
      requestRaw(origin, "/redirect", headers),
      requestRaw(origin, "/empty", headers)
    ]);
    const isCoded = (result) => Boolean(result.headers["content-encoding"]);
    if (redirect.statusCode !== 302 || redirect.body.byteLength !== 0 || isCoded(redirect)) {
      throw new Error("lighthouse mobile: redirect response was changed by compression");
    }
    if (empty.statusCode !== 200 || empty.body.byteLength !== 0 || isCoded(empty)) {
      throw new Error("lighthouse mobile: empty writeHead/end response was changed by compression");
    }
  } finally {
    await new Promise((resolve, reject) => safetyServer.close((error) => (error ? reject(error) : resolve())));
  }

  console.log("lighthouse mobile: verified redirect and explicitly empty responses remain identity responses");
}

async function startServer(port) {
  const server = spawn(process.execPath, [productionServer], {
    cwd: root,
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      NODE_ENV: "production",
      PORT: String(port)
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  server.expectedExit = false;

  let output = "";
  server.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  server.once("exit", (code, signal) => {
    if (server.expectedExit) return;
    if (code !== null && code !== 0) {
      console.error(output.trim());
      console.error(`lighthouse mobile: production server exited early with code ${code}`);
      process.exitCode = 1;
    }
    if (signal) {
      console.error(output.trim());
      console.error(`lighthouse mobile: production server exited early with signal ${signal}`);
      process.exitCode = 1;
    }
  });

  await waitForServer(`http://127.0.0.1:${port}/`);
  return { server, getOutput: () => output };
}

function stopServer(server) {
  return new Promise((resolve) => {
    if (server.killed) {
      resolve();
      return;
    }
    server.expectedExit = true;
    server.once("exit", resolve);
    server.kill("SIGTERM");
    setTimeout(() => {
      if (!server.killed) server.kill("SIGKILL");
      resolve();
    }, 3000).unref();
  });
}

function formatScore(score) {
  return Math.round(score * 100);
}

function assertScore(route, category, score, issues) {
  if (typeof score !== "number") {
    issues.push(`${route}: missing Lighthouse ${category} score`);
    return;
  }
  if (score < minimumScore) {
    issues.push(`${route}: ${category} score ${formatScore(score)} is below ${formatScore(minimumScore)}`);
  }
}

async function auditRoute(origin, route, chrome) {
  const url = new URL(route, origin).href;
  const result = await lighthouse(
    url,
    {
      port: chrome.port,
      logLevel: "error",
      output: "json",
      onlyCategories: categories,
      formFactor: "mobile",
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        disabled: false
      },
      throttlingMethod: "simulate"
    },
    undefined
  );

  const scores = Object.fromEntries(
    categories.map((category) => [category, result.lhr.categories[category]?.score ?? null])
  );
  return {
    route,
    finalUrl: result.lhr.finalDisplayedUrl,
    scores
  };
}

const chromePath = resolveChromePath();
if (!chromePath) {
  throw new Error(
    "lighthouse mobile: no Chrome-compatible browser found. Install Chrome/Chromium or set CHROME_PATH."
  );
}

const port = await getFreePort();
const origin = `http://127.0.0.1:${port}`;
const { server, getOutput } = await startServer(port);
let chrome;

try {
  await validateCompressionSafety();
  await validateCompression(origin);
  chrome = await chromeLauncher.launch({
    chromePath,
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"]
  });

  const results = [];
  const issues = [];

  for (const route of routes) {
    const result = await auditRoute(origin, route, chrome);
    results.push(result);
    for (const category of categories) {
      assertScore(route, category, result.scores[category], issues);
    }
  }

  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        audited_at: new Date().toISOString(),
        origin,
        minimum_score: minimumScore,
        routes: results
      },
      null,
      2
    )
  );

  if (issues.length > 0) {
    console.error(`lighthouse mobile validation failed: ${issues.length} issue(s)`);
    for (const result of results) {
      const scores = categories
        .map((category) => `${category}=${formatScore(result.scores[category] ?? 0)}`)
        .join(", ");
      console.error(`- ${result.route}: ${scores}`);
    }
    for (const issue of issues) console.error(`- ${issue}`);
    process.exit(1);
  }

  console.log(
    `lighthouse mobile validation passed: ${routes.length} route(s), minimum score ${formatScore(minimumScore)}`
  );
} finally {
  if (chrome) await chrome.kill();
  await stopServer(server);
  const serverOutput = getOutput().trim();
  if (serverOutput && process.env.LIGHTHOUSE_SHOW_SERVER_LOGS === "1") {
    console.error(serverOutput);
  }
}
