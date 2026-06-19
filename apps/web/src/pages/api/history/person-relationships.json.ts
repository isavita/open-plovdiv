import type { APIRoute } from "astro";
import personRelationships from "../../../../../../data/generated/history-knowledge/person-relationships.json";
import { json } from "@lib/server/http";

export const prerender = true;

export const GET: APIRoute = () =>
  json(
    {
      count: personRelationships.length,
      person_relationships: personRelationships
    },
    200,
    { "Cache-Control": "public, max-age=300" }
  );
