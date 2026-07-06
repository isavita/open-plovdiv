import nodemailer from "nodemailer";
import type { CommunityReport } from "./moderation";

type SignalResult =
  | { ok: true; messageId?: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped?: false; reason: string };

type AgentSignal = {
  subject: string;
  text: string;
};

function envBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function envInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function publicBaseUrl(requestUrl?: string): string {
  const configured =
    process.env.PUBLIC_SITE_URL ??
    (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : undefined);

  if (configured) return trimTrailingSlash(configured);

  if (requestUrl) {
    try {
      return trimTrailingSlash(new URL(requestUrl).origin);
    } catch {
      // fall through to the documented placeholder
    }
  }

  return "https://openplovdiv.example";
}

function mailConfig() {
  const host = process.env.SMTP_HOST ?? "";
  const port = envInt(process.env.SMTP_PORT, 465);
  const user = process.env.SMTP_USER ?? "";
  const pass = process.env.SMTP_PASSWORD ?? "";
  const from = process.env.AGENT_EMAIL_FROM ?? process.env.SMTP_FROM ?? user;
  const to = process.env.AGENT_EMAIL_TO ?? user;
  const secure = envBool(process.env.SMTP_SECURE, port === 465);
  const requireTLS = envBool(process.env.SMTP_REQUIRE_TLS ?? process.env.SMTP_STARTTLS, port === 587);
  const timeout = envInt(process.env.AGENT_EMAIL_TIMEOUT_MS, 10000);

  return { host, port, user, pass, from, to, secure, requireTLS, timeout };
}

export function agentSignalConfigured(): boolean {
  const config = mailConfig();
  return Boolean(config.host && config.user && config.pass && config.from && config.to);
}

export async function sendAgentSignal(signal: AgentSignal): Promise<SignalResult> {
  const config = mailConfig();
  if (!agentSignalConfigured()) {
    return { ok: false, skipped: true, reason: "smtp_not_configured" };
  }

  try {
    const transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      requireTLS: config.requireTLS,
      auth: {
        user: config.user,
        pass: config.pass
      },
      connectionTimeout: config.timeout,
      greetingTimeout: config.timeout,
      socketTimeout: config.timeout
    });

    const info = await transport.sendMail({
      from: config.from,
      to: config.to,
      subject: signal.subject,
      text: signal.text
    });

    return { ok: true, messageId: info.messageId };
  } catch (error) {
    console.error("[agent-signal] failed to send email", error);
    return { ok: false, reason: "send_failed" };
  }
}

function reportKindLabel(report: CommunityReport): string {
  return report.kind === "history_contribution" ? "history contribution" : "fix-map report";
}

export async function notifyAgentReportCreated(
  report: CommunityReport,
  requestUrl?: string
): Promise<SignalResult> {
  const baseUrl = publicBaseUrl(requestUrl);
  const adminUrl = `${baseUrl}/admin/reports`;
  const pendingApiUrl = `${baseUrl}/api/admin/reports/pending`;
  const reportApiBase = `${baseUrl}/api/admin/reports/${encodeURIComponent(report.id)}`;
  const title = report.title_en ?? report.title_bg;
  const description = report.description_en ?? report.description_bg;
  const photoCount = report.photos.length;

  return sendAgentSignal({
    subject: `[Open Plovdiv] New ${reportKindLabel(report)} ${report.id}`,
    text: [
      "A new Open Plovdiv request is waiting for moderation.",
      "",
      `ID: ${report.id}`,
      `Type: ${reportKindLabel(report)}`,
      `Language: ${report.lang}`,
      `Category: ${report.category}`,
      `Submitted: ${report.created_at}`,
      `Location: ${report.location.lat.toFixed(6)}, ${report.location.lng.toFixed(6)}`,
      `Photos: ${photoCount}`,
      "",
      `Title: ${title}`,
      "",
      description,
      "",
      "Management:",
      `Admin panel: ${adminUrl}`,
      `Pending API: GET ${pendingApiUrl}`,
      `Approve: POST ${reportApiBase}/approve with {"public_status":"verified"}`,
      `Reject: POST ${reportApiBase}/reject with {"reason":"..."}`,
      `Update status: POST ${reportApiBase}/update-status with {"public_status":"in_progress"}`,
      "",
      "Use the existing admin credential as an Authorization bearer token.",
      "Do not publish the request until the text and any photos have been reviewed."
    ].join("\n")
  });
}
