import type { APIRoute } from "astro";
import { isAdmin, unauthorized } from "@lib/server/auth";
import {
  listAllCommunityInitiatives,
  saveCommunityInitiative
} from "@lib/server/communityInitiativeStore";
import { json } from "@lib/server/http";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  if (!isAdmin(request)) return unauthorized();
  const initiatives = await listAllCommunityInitiatives();
  return json({ count: initiatives.length, initiatives });
};

export const POST: APIRoute = async ({ request }) => {
  if (!isAdmin(request)) return unauthorized();

  try {
    const body = await request.json();
    const initiative = await saveCommunityInitiative(body);
    return json({ initiative });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "invalid initiative" },
      400
    );
  }
};
