import http from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { rejectUnsupportedStaticApiMethod } from "./request-policy.mjs";

let server;
let baseUrl;

beforeAll(async () => {
  server = http.createServer((request, response) => {
    if (rejectUnsupportedStaticApiMethod(request, response)) return;
    response.statusCode = 200;
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
    await expect(response.text()).resolves.toBe("astro-handler");
  });
});
