import type { APIRoute } from "astro";
import { agentSignalConfigured, publicBaseUrl, sendAgentSignal } from "@lib/server/agentSignal";
import { hasBearerToken, isAdmin, unauthorized } from "@lib/server/auth";
import { json } from "@lib/server/http";

export const prerender = false;

const SIGNAL_TOKEN = process.env.AGENT_SIGNAL_TOKEN ?? "";

type SignalBody = {
  subject?: unknown;
  message?: unknown;
  metadata?: unknown;
};

function authorized(request: Request): boolean {
  return isAdmin(request) || hasBearerToken(request, SIGNAL_TOKEN);
}

function clean(value: unknown, maxLength: number): string {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function metadataText(value: unknown): string {
  if (value === undefined) return "";
  try {
    return JSON.stringify(value, null, 2).slice(0, 8000);
  } catch {
    return String(value).slice(0, 8000);
  }
}

export const GET: APIRoute = async ({ request }) => {
  if (!authorized(request)) return unauthorized();
  const baseUrl = publicBaseUrl(request.url);
  return json({
    ok: true,
    configured: agentSignalConfigured(),
    admin_panel: `${baseUrl}/admin/reports`,
    pending_reports_api: `${baseUrl}/api/admin/reports/pending`,
    accepts: {
      method: "POST",
      body: {
        subject: "Short signal subject",
        message: "Message to send to the agent mailbox",
        metadata: { optional: "JSON object included in the email body" }
      }
    }
  });
};

export const POST: APIRoute = async ({ request }) => {
  if (!authorized(request)) return unauthorized();

  let body: SignalBody = {};
  try {
    body = (await request.json()) as SignalBody;
  } catch {
    return json({ error: "invalid_body" }, 400);
  }

  const subject = clean(body.subject, 140) || "Open Plovdiv agent signal";
  const message = clean(body.message, 5000) || "The Open Plovdiv site received an agent signal.";
  const metadata = metadataText(body.metadata);
  const baseUrl = publicBaseUrl(request.url);

  const result = await sendAgentSignal({
    subject: `[Open Plovdiv] ${subject}`,
    text: [
      message,
      "",
      metadata ? "Metadata:" : "",
      metadata,
      metadata ? "" : "",
      "Management:",
      `Admin panel: ${baseUrl}/admin/reports`,
      `Pending API: GET ${baseUrl}/api/admin/reports/pending`,
      "",
      "Use the admin credential as an Authorization bearer token for moderation actions."
    ]
      .filter((line) => line !== "")
      .join("\n")
  });

  if (!result.ok) {
    return json({ ok: false, error: result.reason }, result.skipped ? 503 : 502);
  }

  return json({ ok: true, message_id: result.messageId });
};
