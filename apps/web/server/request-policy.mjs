const STATIC_JSON_API_PATH = /^\/api\/(history|search)\/[^/]+\.json$/;
const ALLOWED_STATIC_API_METHODS = new Set(["GET", "HEAD"]);
const STATIC_API_CACHE_CONTROL = {
  history: "public, max-age=300",
  search: "public, max-age=3600"
};

export function matchStaticJsonApi(requestUrl) {
  let pathname;
  try {
    pathname = new URL(requestUrl ?? "/", "http://localhost").pathname;
  } catch {
    return null;
  }

  const match = STATIC_JSON_API_PATH.exec(pathname);
  return match ? { kind: match[1], pathname } : null;
}

export function rejectUnsupportedStaticApiMethod(request, response) {
  if (!matchStaticJsonApi(request.url)) return false;

  const method = String(request.method ?? "GET").toUpperCase();
  if (ALLOWED_STATIC_API_METHODS.has(method)) return false;

  const body = JSON.stringify({
    error: "method_not_allowed",
    allowed_methods: ["GET", "HEAD"]
  });
  response.statusCode = 405;
  response.setHeader("Allow", "GET, HEAD");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Content-Length", Buffer.byteLength(body));
  response.end(body);
  return true;
}

export function applyStaticApiCachePolicy(request, response) {
  const route = matchStaticJsonApi(request.url);
  if (!route) return;

  const statusCode = response.statusCode;
  if ((statusCode >= 200 && statusCode < 300) || statusCode === 304) {
    response.setHeader("Cache-Control", STATIC_API_CACHE_CONTROL[route.kind]);
  }
}
