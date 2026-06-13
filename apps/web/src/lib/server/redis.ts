// Minimal Upstash Redis REST client (no dependency). Only used when the
// UPSTASH_REDIS_REST_* env vars are set; otherwise the report store falls back
// to a local JSON file so the project runs with no external infrastructure.

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export function redisEnabled(): boolean {
  return Boolean(url && token);
}

export async function redis(...args: (string | number)[]): Promise<unknown> {
  if (!url || !token) throw new Error("Redis is not configured");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(args)
  });
  if (!res.ok) {
    throw new Error(`Redis command ${args[0]} failed with ${res.status}`);
  }
  const data = (await res.json()) as { result?: unknown; error?: string };
  if (data.error) throw new Error(`Redis error: ${data.error}`);
  return data.result;
}
