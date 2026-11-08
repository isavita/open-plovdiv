import http from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { applyCompression } from "./compression.mjs";
import {
  applyStaticApiCachePolicy,
  redirectCanonicalPage,
  rejectUnsupportedStaticApiMethod
} from "./request-policy.mjs";

let server;
let baseUrl;

beforeAll(async () => {
  server = http.createServer((request, response) => {
    if (rejectUnsupportedStaticApiMethod(request, response)) return;
    if (redirectCanonicalPage(request, response, {
      RAILWAY_ENVIRONMENT_NAME: "production",
      PUBLIC_SITE_URL: "https://example.org"
    })) return;
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

describe("canonical redirects", () => {
  it.each(["GET", "HEAD"])("redirects a page's trailing slash and keeps its query for %s", async (method) => {
    const response = await fetch(`${baseUrl}/en/history/?from=search`, { method, redirect: "manual" });
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("/en/history?from=search");
  });

  it("redirects only the configured production Railway alias to the canonical origin", () => {
    const headers = {};
    const response = { setHeader: (name, value) => { headers[name] = value; }, end: () => {} };
    expect(redirectCanonicalPage({ method: "GET", url: "/places/?q=one", headers: { host: "open-plovdivweb-production.up.railway.app" } }, response, {
      RAILWAY_ENVIRONMENT_NAME: "production",
      PUBLIC_SITE_URL: "https://example.org"
    })).toBe(true);
    expect(response.statusCode).toBe(308);
    expect(headers.Location).toBe("https://example.org/places?q=one");
  });

  it.each(["healthcheck.railway.app", "unknown.up.railway.app", "example.org"])(
    "does not redirect the root for host %s", (host) => {
      const response = { setHeader: () => { throw new Error("unexpected redirect"); } };
      expect(redirectCanonicalPage({ method: "GET", url: "/", headers: { host } }, response, {
        RAILWAY_ENVIRONMENT_NAME: "production", PUBLIC_SITE_URL: "https://example.org"
      })).toBe(false);
    }
  );

  it.each(["/api/history/events.json/", "/data/example.json/", "/images/example.webp/"])(
    "does not alter API or file paths such as %s", async (path) => {
      const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
      expect(response.status).toBe(200);
    }
  );

  it("does not redirect a Railway preview to production", () => {
    const response = { setHeader: () => { throw new Error("unexpected redirect"); } };
    expect(redirectCanonicalPage({ method: "GET", url: "/", headers: { host: "preview.up.railway.app" } }, response, {
      RAILWAY_ENVIRONMENT_NAME: "preview", RAILWAY_PUBLIC_DOMAIN: "preview.up.railway.app",
      PUBLIC_SITE_URL: "https://example.org"
    })).toBe(false);
  });

  it("leaves API requests on the Railway alias unchanged", () => {
    const response = { setHeader: () => { throw new Error("unexpected redirect"); } };
    expect(redirectCanonicalPage({ method: "GET", url: "/api/history/events.json", headers: { host: "open-plovdivweb-production.up.railway.app" } }, response, {
      RAILWAY_ENVIRONMENT_NAME: "production", PUBLIC_SITE_URL: "https://example.org"
    })).toBe(false);
  });

  it("ignores forwarded host headers, malformed targets and non-HTTPS configured origins", () => {
    const response = { setHeader: () => { throw new Error("unexpected redirect"); } };
    const environment = { RAILWAY_ENVIRONMENT_NAME: "production", PUBLIC_SITE_URL: "http://example.org" };
    expect(redirectCanonicalPage({ method: "GET", url: "/", headers: {
      host: "healthcheck.railway.app", "x-forwarded-host": "open-plovdivweb-production.up.railway.app"
    } }, response, environment)).toBe(false);
    expect(redirectCanonicalPage({ method: "GET", url: "/", headers: {
      host: "open-plovdivweb-production.up.railway.app"
    } }, response, environment)).toBe(false);
    expect(redirectCanonicalPage({ method: "GET", url: "//other.example/", headers: {} }, response, environment)).toBe(false);
  });
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
    ["/api/history/people-catalog/v1/zh.json", "public, max-age=600"],
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

  it("rejects writes and preserves errors for nested localized catalog endpoints", async () => {
    const response = await fetch(`${baseUrl}/api/history/people-catalog/v1/en.json`, { method: "POST" });
    expect(response.status).toBe(405);
    expect(response.headers.get("cache-control")).toBe("no-store");
    const failure = await fetch(`${baseUrl}/api/history/people-catalog/v1/en.json?fail=1`);
    expect(failure.status).toBe(500);
    expect(failure.headers.get("cache-control")).toBe("private, no-store");
  });

  it("does not apply static caching or method restrictions to unrelated nested APIs", async () => {
    const path = `${baseUrl}/api/history/other/action.json`;
    const post = await fetch(path, { method: "POST" });
    expect(post.status).toBe(200);
    expect(post.headers.get("cache-control")).toBeNull();
    const get = await fetch(path);
    expect(get.headers.get("cache-control")).toBeNull();
  });

  it("keeps the ten-minute cache policy on a conditional catalog response", async () => {
    const response = await fetch(`${baseUrl}/api/history/people-catalog/v1/en.json?not-modified=1`);
    expect(response.status).toBe(304);
    expect(response.headers.get("cache-control")).toBe("public, max-age=600");
  });

  it("keeps cache policy on conditional static API responses", async () => {
    const response = await fetch(`${baseUrl}/api/history/events.json?not-modified=1`);

    expect(response.status).toBe(304);
    expect(response.headers.get("cache-control")).toBe("public, max-age=300");
    expect(response.headers.get("vary")).toBe("Accept-Encoding");
  });
});
