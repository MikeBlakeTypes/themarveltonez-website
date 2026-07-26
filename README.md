# The Marveltonez Website

## Current release

**v11.5.1 — Privacy-Conscious Outbound Click Analytics**

This small update adds first-party aggregate outbound-click counting for selected high-value merchandise, catalogue and contact actions. Counts are stored in Cloudflare D1 only as date, descriptive link name and aggregate daily total. The system does not use analytics cookies or create individual visitor profiles, and every tracking route redirects to its destination even if the database write fails.

Tracked actions include the main Etsy shop, the Signature T-Shirt, Premium Cap, Writer’s Mug, publisher-access requests, principal general-contact links and per-song enquiry links. The bilingual privacy policy has been updated accordingly.

## Cloudflare binding

Production Pages binding:

- Variable name: `MARVELTONEZ_ANALYTICS`
- D1 database: `marveltonez-analytics`

## Deployment

Deploy through the established workflow:

Mac source folder → GitHub Desktop → GitHub repository `main` → Cloudflare Pages → live custom domain.

After deployment, verify the Etsy shop and product routes, a general contact route, the publisher-access route, one song-enquiry route, and the D1 aggregate query.

The official Website Version Register is maintained in the Master Planning workstream.
