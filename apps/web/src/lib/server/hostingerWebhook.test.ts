import { afterEach, describe, expect, it, vi } from "vitest";

async function post(body: string): Promise<Response> {
  vi.resetModules();
  process.env.HOSTINGER_MAIL_WEBHOOK_TOKEN = "test-token";
  const { POST } = await import("../../pages/api/mail/hostinger-webhook");
  const request = new Request("http://localhost/api/mail/hostinger-webhook", {
    method: "POST",
    headers: {
      authorization: "Bearer test-token",
      "content-type": "application/json"
    },
    body
  });

  return POST({ request } as Parameters<typeof POST>[0]);
}

afterEach(() => {
  delete process.env.HOSTINGER_MAIL_WEBHOOK_TOKEN;
  vi.restoreAllMocks();
});
describe("Hostinger mail webhook", () => {
  it("rejects malformed JSON instead of acknowledging it", async () => {
    const response = await post("{broken");

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "invalid_json" });
  });

  it("rejects structurally empty payloads", async () => {
    const response = await post("{}");

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "invalid_payload" });
  });

  it("acknowledges a non-empty JSON object", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const response = await post('{"event":"message.received","message_id":"message-1"}');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });
});
