import type { APIRoute } from "astro";
import { primaryDocuments } from "@lib/data";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(
    {
      count: primaryDocuments.length,
      primary_documents: primaryDocuments
    },
    200,
    { "Cache-Control": "public, max-age=300" }
  );
