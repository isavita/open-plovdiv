// Admin protection for moderation endpoints: a single shared bearer token.
// Set ADMIN_TOKEN in production. Locally it falls back to a dev token so the
// dashboard is testable, with a loud warning.

import crypto from "node:crypto";

const DEV_TOKEN = "dev-admin-token";
const TOKEN = process.env.ADMIN_TOKEN ?? DEV_TOKEN;

if (!process.env.ADMIN_TOKEN) {
  console.warn(
    "[open-plovdiv] ADMIN_TOKEN is not set — using an insecure dev token. Set ADMIN_TOKEN before deploying."
  );
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function isAdmin(request: Request): boolean {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return token.length > 0 && safeEqual(token, TOKEN);
}

export function unauthorized(): Response {
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" }
  });
}
