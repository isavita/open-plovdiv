import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import { applyCompression } from "./compression.mjs";
import { rejectUnsupportedStaticApiMethod } from "./request-policy.mjs";
import { resolveTlsPaths } from "./runtime-config.mjs";

// Astro's standalone entry starts itself when imported. Disable that behavior
// so this production boundary can preserve its handler and add safe encoding
// negotiation before any response headers are written.
process.env.ASTRO_NODE_AUTOSTART = "disabled";

const tlsPaths = resolveTlsPaths();
const { handler, options } = await import("../dist/server/entry.mjs");
const port = Number.parseInt(process.env.PORT ?? "", 10) || options.port || 4321;
const host = process.env.HOST ?? options.host ?? "0.0.0.0";

const listener = (req, response) => {
  if (rejectUnsupportedStaticApiMethod(req, response)) return;
  applyCompression(req, response);
  try {
    const result = handler(req, response);
    Promise.resolve(result).catch((error) => {
      console.error("Unhandled Astro request error", error);
      if (response.headersSent) response.destroy(error);
      else {
        response.statusCode = 500;
        response.end("Internal server error");
      }
    });
  } catch (error) {
    console.error("Unhandled Astro request error", error);
    if (response.headersSent) response.destroy(error);
    else {
      response.statusCode = 500;
      response.end("Internal server error");
    }
  }
};

const server = tlsPaths
  ? https.createServer(
      {
        key: fs.readFileSync(tlsPaths.keyPath),
        cert: fs.readFileSync(tlsPaths.certPath)
      },
      listener
    )
  : http.createServer(listener);

server.listen(port, host, () => {
  const address = server.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  const protocol = server instanceof https.Server ? "https" : "http";
  console.log(`Open Plovdiv production server listening on ${protocol}://${host}:${actualPort}`);
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => {
    server.closeAllConnections?.();
    process.exit(0);
  }, 10_000).unref();
}

process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);
