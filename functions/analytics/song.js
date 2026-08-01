const APPROVED_SONG_SLUGS = new Set([
  "put-your-shirt-back-on",
  "so-youre-dating-my-ex",
  "just-sayin",
  "i-didnt-mean-to-turn-out-bad",
  "blocked-and-deleted",
  "happy-breakup",
  "doorstep",
  "a-girl-like-me",
  "youre-my-boy"
]);

const APPROVED_EVENT_TYPES = new Set(["play", "replay"]);

function noContent() {
  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method === "HEAD") {
    return noContent();
  }

  if (method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        Allow: "POST, HEAD",
        "Cache-Control": "no-store, max-age=0"
      }
    });
  }

  let payload;

  try {
    const rawBody = await request.text();
    if (!rawBody || rawBody.length > 200) {
      return new Response("Bad request", { status: 400 });
    }
    payload = JSON.parse(rawBody);
  } catch (error) {
    return new Response("Bad request", { status: 400 });
  }

  const slug = typeof payload.slug === "string" ? payload.slug : "";
  const eventType = typeof payload.eventType === "string" ? payload.eventType : "";

  if (!APPROVED_SONG_SLUGS.has(slug) || !APPROVED_EVENT_TYPES.has(eventType)) {
    return new Response("Not found", { status: 404 });
  }

  const linkName = `song-${eventType}-${slug}`;

  try {
    const clickDate = new Date().toISOString().slice(0, 10);
    await env.MARVELTONEZ_ANALYTICS.prepare(`
      INSERT INTO outbound_clicks (click_date, link_name, click_count)
      VALUES (?, ?, 1)
      ON CONFLICT(click_date, link_name)
      DO UPDATE SET click_count = click_count + 1
    `).bind(clickDate, linkName).run();
  } catch (error) {
    console.error("Song analytics count failed", error);
  }

  return noContent();
}
