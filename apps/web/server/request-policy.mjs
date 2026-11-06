const STATIC_JSON_API_PATH = /^\/api\/(history|search)\/[^/]+\.json$/;
const ALLOWED_STATIC_API_METHODS = new Set(["GET", "HEAD"]);
const STATIC_API_CACHE_CONTROL = {
  history: "public, max-age=300",
  search: "public, max-age=3600"
};
// Railway exposes the custom domain as RAILWAY_PUBLIC_DOMAIN here, so it
// cannot identify this service's separately assigned railway.app alias.
const PRODUCTION_RAILWAY_ALIAS = "open-plovdivweb-production.up.railway.app";

// Canonical page URLs in the sitemap and HTML omit a trailing slash. Only
// redirect safe page requests; API and file paths retain their own semantics.
export function redirectCanonicalPage(request, response, environment = process.env) {
  const method = String(request.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") return false;
  const rawUrl = request.url ?? "/";
  if (!rawUrl.startsWith("/") || rawUrl.startsWith("//") || rawUrl.includes("\\")) return false;

  let url;
  try {
    url = new URL(rawUrl, "http://localhost");
  } catch {
    return false;
  }

  const isApi = url.pathname === "/api" || url.pathname.startsWith("/api/");
  const host = String(request.headers.host ?? "").toLowerCase();
  let canonicalOrigin = "";
  // A Railway preview, local server, health check, or arbitrary Host must not
  // be redirected to production. Only the configured production Railway
  // service's known alias is eligible, and the target is configured locally.
  if (!isApi && environment.RAILWAY_ENVIRONMENT_NAME === "production" &&
      host === PRODUCTION_RAILWAY_ALIAS) {
    try {
      const configured = new URL(environment.PUBLIC_SITE_URL ?? "");
      if (configured.protocol === "https:" && configured.hostname !== host &&
          !configured.username && !configured.password) canonicalOrigin = configured.origin;
    } catch { /* No explicit production origin: leave the domain untouched. */ }
  }

  let pathname = url.pathname;
  const isFile = /\.[^/]+\/?$/.test(pathname);
  if (!isApi && !isFile && pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.replace(/\/+$/, "");
  }
  if (!canonicalOrigin && pathname === url.pathname) return false;
  response.statusCode = 308;
  response.setHeader("Location", `${canonicalOrigin}${pathname}${url.search}`);
  response.end();
  return true;
}

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
