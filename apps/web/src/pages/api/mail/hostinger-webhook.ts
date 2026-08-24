import crypto from "node:crypto";
import type { APIRoute } from "astro";
import { json } from "../../../lib/server/http";

export const prerender = false;

const TOKEN = process.env.HOSTINGER_MAIL_WEBHOOK_TOKEN ?? "";

function bearerToken(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

function summarizePayload(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object") {
    return { received: true, payload_type: typeof payload };
  }

  const record = payload as Record<string, unknown>;
  const message =
    record.message && typeof record.message === "object"
      ? (record.message as Record<string, unknown>)
      : undefined;

  return {
    event: record.event ?? record.type ?? "message.received",
    mailbox: record.mailbox ?? record.mailbox_address ?? record.to ?? message?.to,
    message_id: record.message_id ?? record.messageId ?? message?.id ?? message?.message_id,
    received_at: record.received_at ?? record.timestamp ?? message?.received_at,
    subject_present: Boolean(record.subject ?? message?.subject),
    preview_present: Boolean(record.preview ?? record.snippet ?? message?.preview ?? message?.snippet)
  };
}

export const POST: APIRoute = async ({ request }) => {
  if (!TOKEN) {
    console.error("[hostinger-mail-webhook] HOSTINGER_MAIL_WEBHOOK_TOKEN is not configured");
    return json({ error: "webhook_not_configured" }, 503);
  }

  const provided = bearerToken(request);
  if (!provided || !safeEqual(provided, TOKEN)) {
    return json({ error: "unauthorized" }, 401);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload) || Object.keys(payload).length === 0) {
    return json({ error: "invalid_payload" }, 400);
  }

  console.info("[hostinger-mail-webhook]", summarizePayload(payload));

  return json({ ok: true });
};
