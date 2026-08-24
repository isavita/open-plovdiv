import { Writable } from "node:stream";
import { constants as zlibConstants, createBrotliCompress, createGzip } from "node:zlib";

// Keep the threshold small enough to cover the document and stylesheet payloads
// that affect first render, while avoiding coding overhead for tiny API replies.
const minimumBytes = Math.max(0, Number.parseInt(process.env.COMPRESSION_MIN_BYTES ?? "1024", 10) || 1024);

function headerValue(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value == null ? "" : String(value);
}

function contentType(value) {
  return headerValue(value).split(";", 1)[0].trim().toLowerCase();
}

function parseContentLength(value) {
  const length = Number.parseInt(headerValue(value), 10);
  return Number.isFinite(length) && length >= 0 ? length : null;
}

function isCompressible(contentTypeValue) {
  if (!contentTypeValue || contentTypeValue === "text/event-stream") return false;
  if (contentTypeValue.startsWith("text/")) return true;
  if (contentTypeValue === "image/svg+xml") return true;
  if (contentTypeValue === "application/javascript" || contentTypeValue === "application/x-javascript") return true;
  if (contentTypeValue === "application/json" || contentTypeValue === "application/xml") return true;
  return contentTypeValue.endsWith("+json") || contentTypeValue.endsWith("+xml");
}

function quality(value) {
  if (value == null || value === "") return 1;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : 0;
}

function preferredEncoding(acceptEncoding) {
  const accepted = new Map();

  for (const rawPart of headerValue(acceptEncoding).toLowerCase().split(",")) {
    const [rawName, ...parameters] = rawPart.trim().split(";");
    if (!rawName) continue;
    const qParameter = parameters.find((parameter) => parameter.trim().startsWith("q="));
    accepted.set(rawName.trim(), quality(qParameter?.trim().slice(2)));
  }

  const q = (encoding) => accepted.get(encoding) ?? accepted.get("*") ?? 0;
  const candidates = [
    { encoding: "br", q: q("br") },
    { encoding: "gzip", q: q("gzip") }
  ].filter((candidate) => candidate.q > 0);

  candidates.sort((a, b) => b.q - a.q || (a.encoding === "br" ? -1 : 1));
  return candidates[0]?.encoding ?? null;
}

function addVaryAcceptEncoding(response) {
  const current = headerValue(response.getHeader("Vary"));
  const tokens = current
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.includes("*") || tokens.includes("accept-encoding")) return;
  response.setHeader("Vary", current ? `${current}, Accept-Encoding` : "Accept-Encoding");
}

function mergeWriteHeadHeaders(response, headers) {
  if (!headers) return;

  if (Array.isArray(headers)) {
    if (headers.every(Array.isArray)) {
      for (const [name, value] of headers) response.setHeader(name, value);
      return;
    }
    for (let index = 0; index < headers.length; index += 2) {
      const name = headers[index];
      if (typeof name === "string") response.setHeader(name, headers[index + 1]);
    }
    return;
  }

  if (typeof headers.entries === "function") {
    for (const [name, value] of headers.entries()) response.setHeader(name, value);
    return;
  }

  for (const [name, value] of Object.entries(headers)) response.setHeader(name, value);
}

function normalizeWriteHeadArgs(args) {
  const [statusCode, statusMessageOrHeaders, possibleHeaders] = args;
  const statusMessage = typeof statusMessageOrHeaders === "string" ? statusMessageOrHeaders : undefined;
  return {
    statusCode,
    statusMessage,
    headers: statusMessage === undefined ? statusMessageOrHeaders : possibleHeaders
  };
}

function canTransform(req, response, emptyBodyHint) {
  const cacheControl = headerValue(response.getHeader("Cache-Control")).toLowerCase();
  const responseContentType = contentType(response.getHeader("Content-Type"));
  const responseLength = parseContentLength(response.getHeader("Content-Length"));
  const responseEncoding = headerValue(response.getHeader("Content-Encoding")).toLowerCase();
  const contentDisposition = headerValue(response.getHeader("Content-Disposition")).toLowerCase();

  if (req.method === "HEAD" || req.headers.range || req.headers.upgrade) return false;
  if (response.statusCode < 200 || response.statusCode >= 300) return false;
  if (response.statusCode === 204 || response.statusCode === 205 || response.statusCode === 206) return false;
  if (emptyBodyHint || responseLength === 0 || (responseLength != null && responseLength < minimumBytes)) return false;
  if (responseEncoding && responseEncoding !== "identity") return false;
  if (response.getHeader("Content-Range") || cacheControl.includes("no-transform")) return false;
  if (contentDisposition.includes("attachment")) return false;
  return isCompressible(responseContentType);
}

function createCompressor(encoding) {
  if (encoding === "br") {
    return createBrotliCompress({
      params: {
        [zlibConstants.BROTLI_PARAM_QUALITY]: 4
      }
    });
  }
  return createGzip();
}

/**
 * Decorate a Node ServerResponse before Astro writes to it. The decoration is
 * deliberately response-aware: it retains the adapter's static/API handler,
 * skips byte ranges, streams and already-encoded data, and only adds Vary for
 * representations that can genuinely vary by Accept-Encoding.
 */
export function applyCompression(req, response, { beforeCommit } = {}) {
  const originalWriteHead = response.writeHead.bind(response);
  const originalWrite = response.write.bind(response);
  const originalEnd = response.end.bind(response);
  const originalFlushHeaders = response.flushHeaders?.bind(response);
  let configured = false;
  let activeCompressor = null;
  let pendingStatusMessage;

  function commitHeaders(emptyBodyHint) {
    if (configured || response.headersSent) return;

    beforeCommit?.(req, response);
    if (response.statusCode === 304) addVaryAcceptEncoding(response);
    const eligible = canTransform(req, response, emptyBodyHint);
    if (eligible) {
      // A cache must distinguish the identity and coded variants even when the
      // current client did not ask for a coding.
      addVaryAcceptEncoding(response);
      const encoding = preferredEncoding(req.headers["accept-encoding"]);
      if (encoding) {
        response.removeHeader("Content-Length");
        response.setHeader("Content-Encoding", encoding);
        activeCompressor = createCompressor(encoding);

        const sink = new Writable({
          write(chunk, encodingName, callback) {
            originalWrite(chunk, encodingName, callback);
          },
          final(callback) {
            originalEnd(callback);
          }
        });

        activeCompressor.on("error", (error) => {
          if (!response.destroyed) response.destroy(error);
        });
        // Static files are piped directly into ServerResponse by Astro's Node
        // adapter. Relay compressor backpressure so a large HTML document does
        // not leave that source waiting for a drain event that only the
        // compressor can produce.
        activeCompressor.on("drain", () => response.emit("drain"));
        response.once("close", () => {
          if (!activeCompressor.destroyed) activeCompressor.destroy();
        });
        activeCompressor.pipe(sink);
      }
    }

    configured = true;
    if (pendingStatusMessage === undefined) originalWriteHead(response.statusCode);
    else originalWriteHead(response.statusCode, response.statusMessage);
  }

  response.writeHead = function writeHead(...args) {
    if (response.headersSent) return originalWriteHead(...args);
    const { statusCode, statusMessage, headers } = normalizeWriteHeadArgs(args);
    mergeWriteHeadHeaders(response, headers);
    response.statusCode = statusCode ?? response.statusCode;
    if (statusMessage !== undefined) response.statusMessage = statusMessage;
    pendingStatusMessage = statusMessage;
    // Defer committing headers until the first byte (or end). That lets an
    // explicitly empty writeHead/end response stay empty rather than becoming
    // a coded zero-byte representation.
    return response;
  };

  response.write = function write(chunk, encodingName, callback) {
    if (!configured && !response.headersSent) commitHeaders(false);
    if (!activeCompressor) return originalWrite(chunk, encodingName, callback);
    return activeCompressor.write(chunk, encodingName, callback);
  };

  response.end = function end(...args) {
    if (!configured && !response.headersSent) {
      commitHeaders(args.length === 0 || args[0] == null);
    }
    if (!activeCompressor) return originalEnd(...args);

    let [chunk, encodingName, callback] = args;
    if (typeof chunk === "function") {
      callback = chunk;
      chunk = undefined;
      encodingName = undefined;
    } else if (typeof encodingName === "function") {
      callback = encodingName;
      encodingName = undefined;
    }

    if (chunk == null) activeCompressor.end(callback);
    else activeCompressor.end(chunk, encodingName, callback);
    return response;
  };

  if (originalFlushHeaders) {
    response.flushHeaders = function flushHeaders() {
      if (!configured && !response.headersSent) commitHeaders(false);
      return originalFlushHeaders();
    };
  }
}
