const FIXED_DESTINATIONS = {
  "etsy-shop": "https://www.etsy.com/shop/TheMarveltonez",
  "signature-t-shirt": "https://www.etsy.com/listing/4541387693/marveltonez-signature-t-shirt-black",
  "premium-cap": "https://www.etsy.com/listing/4541425553/marveltonez-premium-cap-embroidered",
  "writers-mug": "https://www.etsy.com/listing/4541405511/marveltonez-writers-mug-black-glossy-11",
  "studio-hoodie": "https://www.etsy.com/shop/TheMarveltonez?search_query=hoodie",
  "publisher-access-request": "mailto:mikeblake@themarveltonez.com?subject=Request%20for%20Marveltonez%20Professional%20Catalogue%20Access&body=Hi%20Mike%20and%20Mike%2C%0A%0AI%20would%20like%20to%20request%20access%20to%20the%20secure%20Marveltonez%20Professional%20Catalogue.%0A%0AName:%0ACompany%20/%20organisation:%0ARole:%0AWebsite%20or%20professional%20profile:%0A%0AI%20am%20interested%20in%20accessing%20the%20catalogue%20for:%0A%0ABest%20regards%2C%0A%0A%0A%0A%0A%0A%0APlease%20note:%20access%20requests%20are%20approved%20manually%2C%20so%20there%20may%20be%20a%20short%20delay%20depending%20on%20time%20zone%20and%20time%20of%20day.%20Thanks%20for%20your%20patience.",
  "homepage-contact-button": "mailto:mikeblake@themarveltonez.com?body=Hi%20Mike%20and%20Mike%2C%0A%0A",
  "homepage-get-in-touch": "mailto:mikeblake@themarveltonez.com?body=Hi%20Mike%20and%20Mike%2C%0A%0A",
  "footer-email": "mailto:mikeblake@themarveltonez.com?body=Hi%20Mike%20and%20Mike%2C%0A%0A",
  "navigation-contact": "mailto:mikeblake@themarveltonez.com",
  "general-contact": "mailto:mikeblake@themarveltonez.com",
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
  "industry-catalogue-access": "mailto:mikeblake@themarveltonez.com?subject=Request%20for%20Marveltonez%20Professional%20Catalogue%20Access&body=Hi%20Mike%20and%20Mike%2C%0A%0AI%20would%20like%20to%20discuss%20access%20to%20the%20broader%20Marveltonez%20catalogue%20and%20additional%20song%20information.%0A%0AName:%0ACompany%20/%20organisation:%0ARole:%0AWebsite%20or%20professional%20profile:%0A%0AI%20am%20looking%20for:%0A%0ABest%20regards%2C%0A%0A%0A%0A%0A%0A%0APlease%20note:%20access%20requests%20are%20approved%20manually%2C%20so%20there%20may%20be%20a%20short%20delay%20depending%20on%20time%20zone%20and%20time%20of%20day.%20Thanks%20for%20your%20patience.",
  "industry-contact": "mailto:mikeblake@themarveltonez.com?subject=Industry%20enquiry%20for%20Marveltonez&body=Hi%20Mike%20and%20Mike%2C%0A%0AI%20would%20like%20to%20start%20a%20conversation%20with%20Marveltonez.%0A%0AName%3A%0ACompany%20/%20organisation%3A%0ARole%3A%0A%0AI%20am%20looking%20for%3A%0A%0ABest%20regards%2C"
};

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
  const title = SONG_TITLES[slug];
  if (!title) return null;

  const subject = encodeURIComponent(`Enquiry about “${title}”`);
  const body = encodeURIComponent(
    `Hi Mike and Mike,\n\nI am interested in your song “${title}”.\n\nName:\nCompany / role:\n\nMy enquiry is:\n\nBest regards,`
  );

  return `mailto:mikeblake@themarveltonez.com?subject=${subject}&body=${body}`;
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

export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method.toUpperCase();

  const pathParts = Array.isArray(params.path)
    ? params.path
    : String(params.path || "").split("/").filter(Boolean);

  let linkName;
  let destination;

  if (pathParts.length === 1 && FIXED_DESTINATIONS[pathParts[0]]) {
    linkName = pathParts[0];
    destination = FIXED_DESTINATIONS[linkName];
  } else if (pathParts.length === 2 && pathParts[0] === "song-enquiry") {
    const slug = pathParts[1];
    destination = songEnquiryDestination(slug);
    if (destination) linkName = `song-enquiry-${slug}`;
  }

  if (!destination || !linkName) {
    return new Response("Not found", { status: 404 });
  }

  if (method === "HEAD") {
    return redirect(destination);
  }

  if (method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" }
    });
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
    console.error("Outbound click count failed", error);
  }

  return redirect(destination);
}
