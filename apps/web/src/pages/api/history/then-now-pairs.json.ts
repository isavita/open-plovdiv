import type { APIRoute } from "astro";
import { thenNowPairs } from "@lib/data";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(
    {
      count: thenNowPairs.length,
      then_now_pairs: thenNowPairs
    },
    200,
    { "Cache-Control": "public, max-age=300" }
  );
