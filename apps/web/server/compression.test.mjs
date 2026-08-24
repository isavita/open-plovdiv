import http from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { applyCompression } from "./compression.mjs";

let server;
let baseUrl;

beforeAll(async () => {
  server = http.createServer((request, response) => {
    applyCompression(request, response);

    if (request.url === "/conditional") {
      response.statusCode = 304;
      response.setHeader("Vary", "Accept-Language");
      response.end();
      return;
    }
    if (request.url === "/conditional-wildcard") {
      response.statusCode = 304;
      response.setHeader("Vary", "*");
      response.end();
      return;
    }
    if (request.url === "/missing") {
      response.statusCode = 404;
      response.end("not found");
      return;
    }

    const body = "compressible response ".repeat(100);
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.end(body);
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

describe("production response compression", () => {
  it("preserves existing Vary fields on conditional responses", async () => {
    const response = await fetch(`${baseUrl}/conditional`);

    expect(response.status).toBe(304);
    expect(response.headers.get("vary")).toBe("Accept-Language, Accept-Encoding");
    expect(response.headers.get("content-encoding")).toBeNull();
  });

  it("does not expand a wildcard Vary field", async () => {
    const response = await fetch(`${baseUrl}/conditional-wildcard`);

    expect(response.status).toBe(304);
    expect(response.headers.get("vary")).toBe("*");
  });

  it("does not add encoding variance to unrelated error responses", async () => {
    const response = await fetch(`${baseUrl}/missing`);

    expect(response.status).toBe(404);
    expect(response.headers.get("vary")).toBeNull();
  });

  it("continues to negotiate compression for eligible success responses", async () => {
    const response = await fetch(`${baseUrl}/document`, {
      headers: { "Accept-Encoding": "gzip" }
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-encoding")).toBe("gzip");
    expect(response.headers.get("vary")).toBe("Accept-Encoding");
    expect(await response.text()).toBe("compressible response ".repeat(100));
  });
});
