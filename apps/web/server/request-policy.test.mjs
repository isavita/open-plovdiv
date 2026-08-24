import http from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { applyCompression } from "./compression.mjs";
import {
  applyStaticApiCachePolicy,
  rejectUnsupportedStaticApiMethod
} from "./request-policy.mjs";

let server;
let baseUrl;

beforeAll(async () => {
  server = http.createServer((request, response) => {
    if (rejectUnsupportedStaticApiMethod(request, response)) return;
    applyCompression(request, response, { beforeCommit: applyStaticApiCachePolicy });
    response.statusCode = 200;
    const searchParams = new URL(request.url, baseUrl ?? "http://localhost").searchParams;
    if (searchParams.has("fail")) {
      response.statusCode = 500;
      response.setHeader("Cache-Control", "private, no-store");
    } else if (searchParams.has("not-modified")) {
      response.statusCode = 304;
    }
    response.end("astro-handler");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe("static JSON API method policy", () => {
  it.each(["POST", "PUT", "PATCH", "DELETE", "OPTIONS"])(
    "rejects %s for generated history data",
    async (method) => {
      const response = await fetch(`${baseUrl}/api/history/events.json?source=test`, { method });

      expect(response.status).toBe(405);
      expect(response.headers.get("allow")).toBe("GET, HEAD");
      expect(response.headers.get("cache-control")).toBe("no-store");
      await expect(response.json()).resolves.toEqual({
        error: "method_not_allowed",
        allowed_methods: ["GET", "HEAD"]
      });
    }
  );

  it("applies the same policy to generated search indexes", async () => {
    const response = await fetch(`${baseUrl}/api/search/bg.json`, { method: "POST" });

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, HEAD");
  });

  it.each(["GET", "HEAD"])("allows %s to reach the Astro handler", async (method) => {
    const response = await fetch(`${baseUrl}/api/history/events.json`, { method });

    expect(response.status).toBe(200);
  });

  it("does not intercept non-API pages", async () => {
    const response = await fetch(`${baseUrl}/history/`, { method: "POST" });

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBeNull();
    await expect(response.text()).resolves.toBe("astro-handler");
  });

  it.each([
    ["/api/history/events.json", "public, max-age=300"],
    ["/api/search/bg.json", "public, max-age=3600"]
  ])("sets the production cache policy for %s", async (path, expected) => {
    const response = await fetch(`${baseUrl}${path}`);

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe(expected);
  });

  it("preserves error cache policy on static API failures", async () => {
    const response = await fetch(`${baseUrl}/api/history/events.json?fail=1`);

    expect(response.status).toBe(500);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("keeps cache policy on conditional static API responses", async () => {
    const response = await fetch(`${baseUrl}/api/history/events.json?not-modified=1`);

    expect(response.status).toBe(304);
    expect(response.headers.get("cache-control")).toBe("public, max-age=300");
  });
});
