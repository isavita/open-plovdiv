import type { APIRoute } from "astro";
import { historyKnowledgePersonRelationships } from "@lib/data";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(
    {
      count: historyKnowledgePersonRelationships.length,
      person_relationships: historyKnowledgePersonRelationships
    },
    200,
    { "Cache-Control": "public, max-age=300" }
  );
