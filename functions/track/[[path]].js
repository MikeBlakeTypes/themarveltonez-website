const FIXED_DESTINATIONS = {
  "etsy-shop": "https://www.etsy.com/shop/TheMarveltonez",
  "signature-t-shirt": "https://www.etsy.com/listing/4541387693/marveltonez-signature-t-shirt-black",
  "premium-cap": "https://www.etsy.com/listing/4541425553/marveltonez-premium-cap-embroidered",
  "writers-mug": "https://www.etsy.com/listing/4541405511/marveltonez-writers-mug-black-glossy-11",
  "studio-hoodie": "https://www.etsy.com/shop/TheMarveltonez?search_query=hoodie",
  "publisher-access-request": "/publisher.html#request-access-title",
  "homepage-contact-button": "/#contact",
  "homepage-get-in-touch": "/#contact",
  "footer-email": "/#contact",
  "navigation-contact": "/#contact",
  "general-contact": "/#contact",
  "hub-featured": "/industry/",
  "hub-hear-the-songs": "/unreleased.html",
  "hub-songs-weve-written": "/#selected-releases",
  "hub-discover": "/#story",
  "hub-industry-contact": "/publisher.html",
  "hub-facebook": "https://www.facebook.com/themarveltonez",
  "hub-instagram": "https://www.instagram.com/themarveltonez/",
  "hub-youtube": "https://www.youtube.com/@marveltonez",
  "hub-shop": "https://www.etsy.com/shop/TheMarveltonez",
  "hub-main-website": "/",
  "homepage-industry": "/industry/",
  "navigation-industry": "/industry/",
  "industry-featured-demos": "/unreleased.html#featured-demos",
  "industry-catalogue-access": "/publisher.html",
  "industry-contact": "/industry/#professional-contact"
};

const BACKGROUND_ONLY_LINKS = new Set([
  "publisher-access-request",
  "homepage-contact-button",
  "homepage-get-in-touch",
  "footer-email",
  "navigation-contact",
  "general-contact",
  "industry-contact"
]);

const SONG_TITLES = {
  "blocked-and-deleted": "Blocked and Deleted",
  "put-your-shirt-back-on": "Put Your Shirt Back On",
  "so-youre-dating-my-ex": "So You’re Dating My Ex",
  "just-sayin": "Just Sayin’",
  "i-didnt-mean-to-turn-out-bad": "I Didn’t Mean to Turn Out Bad",
  "happy-breakup": "It’s a Happy Break-Up",
  "doorstep": "Doorstep",
  "a-girl-like-me": "A Girl Like Me",
  "youre-my-boy": "You’re My Boy"
};

function songEnquiryDestination(slug) {
  if (!SONG_TITLES[slug]) return null;
  return `/song/${encodeURIComponent(slug)}/`;
}

function redirect(destination) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: destination,
      "Cache-Control": "no-store, max-age=0"
    }
  });
}

function noContent() {
  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}

async function recordClick(env, linkName) {
  try {
    const clickDate = new Date().toISOString().slice(0, 10);
    await env.MARVELTONEZ_ANALYTICS.prepare(`
      INSERT INTO outbound_clicks (click_date, link_name, click_count)
      VALUES (?, ?, 1)
      ON CONFLICT(click_date, link_name)
      DO UPDATE SET click_count = click_count + 1
    `).bind(clickDate, linkName).run();
  } catch (error) {
    console.error("Outbound click count failed", error);
  }
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method.toUpperCase();

  const pathParts = Array.isArray(params.path)
    ? params.path
    : String(params.path || "").split("/").filter(Boolean);

  let linkName;
  let destination;
  let backgroundOnly = false;

  if (pathParts.length === 1 && FIXED_DESTINATIONS[pathParts[0]]) {
    linkName = pathParts[0];
    destination = FIXED_DESTINATIONS[linkName];
    backgroundOnly = BACKGROUND_ONLY_LINKS.has(linkName);
  } else if (pathParts.length === 2 && pathParts[0] === "song-enquiry") {
    const slug = pathParts[1];
    destination = songEnquiryDestination(slug);
    if (destination) {
      linkName = `song-enquiry-${slug}`;
      backgroundOnly = true;
    }
  }

  if (!destination || !linkName) {
    return new Response("Not found", { status: 404 });
  }

  if (method === "HEAD") {
    return redirect(destination);
  }

  if (method === "POST") {
    await recordClick(env, linkName);
    return noContent();
  }

  if (method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD, POST" }
    });
  }

  if (!backgroundOnly) {
    await recordClick(env, linkName);
  }

  return redirect(destination);
}
