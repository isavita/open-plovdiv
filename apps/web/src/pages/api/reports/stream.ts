import type { APIRoute } from "astro";
import { toPublicReport } from "@lib/server/moderation";
import { listPublished } from "@lib/server/reportStore";

export const prerender = false;

async function snapshot() {
  const published = await listPublished();
  const reports = published.map(toPublicReport);
  const updated_at = published.reduce((max, r) => (r.updated_at > max ? r.updated_at : max), "");
  return { updated_at, count: reports.length, reports };
}

export const GET: APIRoute = async ({ request }) => {
  const encoder = new TextEncoder();
  let closed = false;
  let lastUpdated = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      async function tick() {
        if (closed) return;
        try {
          const data = await snapshot();
          if (data.updated_at !== lastUpdated) {
            lastUpdated = data.updated_at;
            send("reports", data);
          } else {
            send("heartbeat", { at: new Date().toISOString() });
          }
        } catch {
          send("error", { error: "stream_snapshot_failed" });
        }
      }

      await tick();
      const interval = setInterval(tick, 30000);
      request.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(interval);
        controller.close();
      });
    },
    cancel() {
      closed = true;
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      Connection: "keep-alive"
    }
  });
};
