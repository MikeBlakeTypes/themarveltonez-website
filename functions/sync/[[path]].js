const COOKIE_NAME = "mtz_sync_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const ALLOWED_AUDIO = new Set([
  "MTZ-0014-V02.mp3",
  "MTZ-0022-V02.mp3",
  "MTZ-0027-V01.mp3",
  "MTZ-0042-V02.mp3",
  "MTZ-0044-V03.mp3",
  "MTZ-0031-V02.mp3",
  "MTZ-0012-V02.2.mp3"
]);

function parseCookie(request, name) {
  const raw = request.headers.get("Cookie") || "";
  for (const item of raw.split(";")) {
    const [key, ...rest] = item.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return "";
}

function validTokens(env) {
  const tokens = [];
  if (env.SYNC_ACCESS_TOKEN) tokens.push(String(env.SYNC_ACCESS_TOKEN));
  if (env.SYNC_ACCESS_TOKENS) {
    String(env.SYNC_ACCESS_TOKENS)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => tokens.push(item));
  }
  return tokens;
}

function tokenIsValid(token, env) {
  if (!token) return false;
  return validTokens(env).some((candidate) => candidate === token);
}

function securityHeaders(contentType = "text/plain; charset=utf-8") {
  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet, noimageindex");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  headers.set("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; media-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
  return headers;
}

function notFound() {
  const headers = securityHeaders("text/plain; charset=utf-8");
  return new Response("Not found", { status: 404, headers });
}

function requestPath(params) {
  if (Array.isArray(params?.path)) return params.path.join("/");
  return String(params?.path || "");
}

function contentTypeFor(path) {
  if (path.endsWith(".html")) return "text/html; charset=utf-8";
  if (path.endsWith(".css")) return "text/css; charset=utf-8";
  if (path.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (path.endsWith(".mp3")) return "audio/mpeg";
  return "application/octet-stream";
}

function setCookieHeader(token) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/sync/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Strict`;
}

async function serveObject(bucket, objectKey, request, method) {
  if (!bucket || typeof bucket.get !== "function" || typeof bucket.head !== "function") {
    return new Response("Private sync storage is not configured.", {
      status: 503,
      headers: securityHeaders()
    });
  }

  if (method === "HEAD") {
    const object = await bucket.head(objectKey);
    if (!object) return notFound();
    const headers = securityHeaders(contentTypeFor(objectKey));
    headers.set("ETag", object.httpEtag);
    headers.set("Content-Length", String(object.size));
    if (objectKey.endsWith(".mp3")) {
      headers.set("Accept-Ranges", "bytes");
      headers.set("Content-Disposition", "inline");
    }
    return new Response(null, { status: 200, headers });
  }

  const options = objectKey.endsWith(".mp3") ? { range: request.headers } : undefined;
  const object = await bucket.get(objectKey, options);
  if (!object) return notFound();

  const headers = securityHeaders(contentTypeFor(objectKey));
  headers.set("ETag", object.httpEtag);

  let status = 200;
  if (objectKey.endsWith(".mp3")) {
    headers.set("Accept-Ranges", "bytes");
    headers.set("Content-Disposition", "inline");
    if (request.headers.has("Range") && object.range) {
      const start = object.range.offset;
      const length = object.range.length;
      const end = start + length - 1;
      headers.set("Content-Range", `bytes ${start}-${end}/${object.size}`);
      headers.set("Content-Length", String(length));
      status = 206;
    } else {
      headers.set("Content-Length", String(object.size));
    }
  } else {
    headers.set("Content-Length", String(object.size));
  }

  return new Response(object.body, { status, headers });
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD", "Cache-Control": "no-store" }
    });
  }

  const url = new URL(request.url);
  const suppliedToken = url.searchParams.get("access") || "";

  if (suppliedToken && tokenIsValid(suppliedToken, env)) {
    const headers = securityHeaders();
    headers.set("Location", "/sync/");
    headers.set("Set-Cookie", setCookieHeader(suppliedToken));
    return new Response(null, { status: 302, headers });
  }

  const cookieToken = parseCookie(request, COOKIE_NAME);
  if (!tokenIsValid(cookieToken, env)) return notFound();

  const rawPath = requestPath(params).replace(/^\/+|\/+$/g, "");
  let objectKey = "";

  if (!rawPath) {
    objectKey = "site/index.html";
  } else if (rawPath === "sync.css") {
    objectKey = "site/sync.css";
  } else if (rawPath === "sync.js") {
    objectKey = "site/sync.js";
  } else if (rawPath.startsWith("audio/")) {
    const fileName = rawPath.slice("audio/".length);
    if (!ALLOWED_AUDIO.has(fileName)) return notFound();
    objectKey = `audio/${fileName}`;
  } else {
    return notFound();
  }

  return serveObject(env.SYNC_PACKAGE, objectKey, request, method);
}
