const CANONICAL_RECORDING_FILE = /^MTZ-\d{4}-V\d{2}\.mp3$/i;

// This set is intentionally generated/maintained from governed Professional
// Catalogue exposure state. A protected R2 object is not served merely because
// it exists in the bucket. No production professional-only recordings are
// authorised in the current v12.6.0 build, so the initial allow-list is empty.
const APPROVED_PROTECTED_RECORDINGS = new Set(["MTZ-0014-V02", "MTZ-0002-V02", "MTZ-0026-V01"]);

function requestFileName(params) {
  const raw = Array.isArray(params?.path)
    ? params.path.join("/")
    : String(params?.path || "");

  if (!raw || raw.includes("/")) return "";
  return raw;
}

function baseHeaders(object) {
  const headers = new Headers();
  if (object?.writeHttpMetadata) object.writeHttpMetadata(headers);
  headers.set("ETag", object.httpEtag);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("X-Content-Type-Options", "nosniff");
  if (!headers.has("Content-Type")) headers.set("Content-Type", "audio/mpeg");
  headers.set("Content-Disposition", "inline");
  return headers;
}

function unavailableBinding() {
  return new Response("Protected audio delivery is not configured.", {
    status: 503,
    headers: { "Cache-Control": "no-store, max-age=0" }
  });
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method.toUpperCase();

  if (method !== "GET" && method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        Allow: "GET, HEAD",
        "Cache-Control": "no-store, max-age=0"
      }
    });
  }

  const fileName = requestFileName(params);
  if (!CANONICAL_RECORDING_FILE.test(fileName)) {
    return new Response("Not found", { status: 404 });
  }

  const recordingId = fileName.replace(/\.mp3$/i, "").toUpperCase();
  if (!APPROVED_PROTECTED_RECORDINGS.has(recordingId)) {
    return new Response("Not found", { status: 404 });
  }

  const bucket = env.PROFESSIONAL_AUDIO;
  if (!bucket || typeof bucket.get !== "function" || typeof bucket.head !== "function") {
    return unavailableBinding();
  }

  if (method === "HEAD") {
    const object = await bucket.head(fileName);
    if (!object) return new Response("Not found", { status: 404 });

    const headers = baseHeaders(object);
    headers.set("Content-Length", String(object.size));
    return new Response(null, { status: 200, headers });
  }

  const object = await bucket.get(fileName, {
    range: request.headers
  });

  if (!object) return new Response("Not found", { status: 404 });

  const headers = baseHeaders(object);

  let status = 200;
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

  return new Response(object.body, { status, headers });
}
