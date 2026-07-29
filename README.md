# The Marveltonez Website

## Current release

**v11.5.4 — Lyrics, Catalogue Order and Writer’s Collection Navigation**

This incremental release synchronises the nine public songs with Marveltonez Catalogue Master v2.9.2, orders the cards by the dedicated Public Display Order field, adds accessible expandable lyrics with the approved copyright notices, preserves the metadata-driven Explicit badges and working R2 audio, and strengthens the return route from each product page to the Writer’s Collection section.

## Cloudflare binding

Production Pages binding:

- Variable name: `MARVELTONEZ_ANALYTICS`
- D1 database: `marveltonez-analytics`

## Deployment

Deploy through the established workflow:

Mac source folder → GitHub Desktop → GitHub repository `main` → Cloudflare Pages → live custom domain.

After deployment, verify the Etsy shop and product routes, a general contact route, the publisher-access route, one song-enquiry route, and the D1 aggregate query.

The official Website Version Register is maintained in the Master Planning workstream.

## v11.5.4 rollback

Before committing, use GitHub Desktop’s **Repository → Discard All Changes** to return to the current live release.

After deployment, open **History**, select the v11.5.4 commit, choose **Revert changes in commit**, and push the resulting revert commit to `main`.
