import type { APIRoute } from "astro";
import thenNowPairs from "../../../../../../data/generated/history-knowledge/then-now-pairs.json";
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
