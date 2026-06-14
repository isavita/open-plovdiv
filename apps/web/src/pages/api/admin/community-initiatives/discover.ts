import type { APIRoute } from "astro";
import { isAdmin, unauthorized } from "@lib/server/auth";
import { json } from "@lib/server/http";

export const prerender = false;

type Candidate = {
  title: string;
  url: string;
  snippet?: string;
};

function cleanText(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function unwrapDuckDuckGoUrl(raw: string): string {
  try {
    const absolute = raw.startsWith("http") ? raw : `https://duckduckgo.com${raw}`;
    const parsed = new URL(absolute);
    const uddg = parsed.searchParams.get("uddg");
    return uddg ? decodeURIComponent(uddg) : absolute;
  } catch {
    return raw;
  }
}

function assertPublicHttpUrl(url: URL): void {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("only http and https URLs are supported");
  }

  const host = url.hostname.toLowerCase();
  const blocked =
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.startsWith("127.") ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host);

  if (blocked) throw new Error("local and private network URLs are not supported");
}

async function inspectUrl(sourceUrl: string): Promise<Candidate> {
  const url = new URL(sourceUrl);
  assertPublicHttpUrl(url);
  const res = await fetch(url.href, {
    headers: {
      "User-Agent": "OpenPlovdivBot/1.0 (+https://openplovdiv.example)"
    }
  });
  if (!res.ok) throw new Error(`source returned ${res.status}`);
  const html = await res.text();
  const title = cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? url.hostname);
  const description = cleanText(
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      ""
  );
  return { title, url: url.href, snippet: description || undefined };
}

async function searchWeb(query: string): Promise<Candidate[]> {
  const url = new URL("https://duckduckgo.com/html/");
  url.searchParams.set("q", query);
  const res = await fetch(url.href, {
    headers: {
      "User-Agent": "Mozilla/5.0 OpenPlovdivBot/1.0"
    }
  });
  if (!res.ok) throw new Error(`search returned ${res.status}`);

  const html = await res.text();
  const results: Candidate[] = [];
  const seen = new Set<string>();
  const regex =
    /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(?:<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>|<div[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/div>)?/gi;

  for (const match of html.matchAll(regex)) {
    const candidateUrl = unwrapDuckDuckGoUrl(match[1] ?? "");
    if (!candidateUrl.startsWith("http") || seen.has(candidateUrl)) continue;
    seen.add(candidateUrl);
    results.push({
      title: cleanText(match[2] ?? candidateUrl),
      url: candidateUrl,
      snippet: cleanText(match[3] ?? match[4] ?? "") || undefined
    });
    if (results.length >= 8) break;
  }

  return results;
}

export const POST: APIRoute = async ({ request }) => {
  if (!isAdmin(request)) return unauthorized();

  try {
    const body = (await request.json()) as { query?: string; source_url?: string };
    const sourceUrl = typeof body.source_url === "string" ? body.source_url.trim() : "";
    if (sourceUrl) {
      return json({ candidates: [await inspectUrl(sourceUrl)] });
    }

    const query = typeof body.query === "string" ? body.query.trim() : "";
    if (query.length < 3) return json({ error: "query is required" }, 400);
    const candidates = await searchWeb(query);
    return json({ candidates });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "discovery failed", candidates: [] },
      400
    );
  }
};
