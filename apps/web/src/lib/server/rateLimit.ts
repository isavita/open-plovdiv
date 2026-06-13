// Lightweight rate limiting keyed by a salted IP hash. Raw IPs are never stored.

import crypto from "node:crypto";
import { redis, redisEnabled } from "./redis";

const WINDOW_SECONDS = 600; // 10 minutes
const MAX_PER_WINDOW = 5;
const SALT = process.env.IP_HASH_SALT ?? "open-plovdiv-dev-salt";

const memory = new Map<string, { count: number; resetAt: number }>();

export function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(`${SALT}:${ip}`).digest("hex").slice(0, 16);
}

export function clientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get("cf-connecting-ip") ??
    h.get("x-forwarded-for")?.split(",")[0] ??
    h.get("x-real-ip") ??
    "0.0.0.0"
  ).trim();
}

export async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rate-limit:${hashIp(ip)}`;

  if (redisEnabled()) {
    const count = Number(await redis("INCR", key));
    if (count === 1) await redis("EXPIRE", key, WINDOW_SECONDS);
    return { allowed: count <= MAX_PER_WINDOW, remaining: Math.max(0, MAX_PER_WINDOW - count) };
  }

  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt < now) {
    memory.set(key, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    return { allowed: true, remaining: MAX_PER_WINDOW - 1 };
  }
  entry.count += 1;
  return { allowed: entry.count <= MAX_PER_WINDOW, remaining: Math.max(0, MAX_PER_WINDOW - entry.count) };
}
