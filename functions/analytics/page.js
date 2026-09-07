const APPROVED_PAGES = new Map([
  ["industry", "industry-page-view"]
]);

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
    if (!rawBody || rawBody.length > 100) {
      return new Response("Bad request", { status: 400 });
    }
    payload = JSON.parse(rawBody);
  } catch (error) {
    return new Response("Bad request", { status: 400 });
  }

  const page = typeof payload.page === "string" ? payload.page : "";
  const linkName = APPROVED_PAGES.get(page);

  if (!linkName) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const clickDate = new Date().toISOString().slice(0, 10);
    await env.MARVELTONEZ_ANALYTICS.prepare(`
      INSERT INTO outbound_clicks (click_date, link_name, click_count)
      VALUES (?, ?, 1)
      ON CONFLICT(click_date, link_name)
      DO UPDATE SET click_count = click_count + 1
    `).bind(clickDate, linkName).run();
  } catch (error) {
    console.error("Page analytics count failed", error);
  }

  return noContent();
}
