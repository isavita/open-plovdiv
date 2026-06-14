import type { APIRoute } from "astro";
import { listAllCommunityInitiatives } from "@lib/server/communityInitiativeStore";
import { json } from "@lib/server/http";

export const prerender = false;

export const GET: APIRoute = async () => {
  const initiatives = await listAllCommunityInitiatives();
  return json({ count: initiatives.length, initiatives });
};
