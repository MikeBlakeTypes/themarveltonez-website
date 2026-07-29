# The Marveltonez Website

## Current release

**v11.5.4a — Song Card Action and Badge Refinement**

This narrowly scoped refinement unifies View Song Profile, View Lyrics and Enquire About This Song as accessible left-aligned text action rows, adds clear View/Close Lyrics states with red plus/minus indicators, removes the redundant grey card identifier, and keeps Featured Song and EXPLICIT badges together. All v11.5.4 lyrics, catalogue metadata, display order, audio URLs, enquiry routes and Writer’s Collection navigation remain unchanged.

## Cloudflare binding

Production Pages binding:

- Variable name: `MARVELTONEZ_ANALYTICS`
- D1 database: `marveltonez-analytics`

## Deployment

Deploy through the established workflow:

Mac source folder → GitHub Desktop → GitHub repository `main` → Cloudflare Pages → live custom domain.

After deployment, verify the Etsy shop and product routes, a general contact route, the publisher-access route, one song-enquiry route, and the D1 aggregate query.

The official Website Version Register is maintained in the Master Planning workstream.

## v11.5.4a rollback

Before committing, use GitHub Desktop’s **Repository → Discard All Changes** to return to the current live release.

After deployment, open **History**, select the v11.5.4a commit, choose **Revert changes in commit**, and push the resulting revert commit to `main`.

## v11.5.4 rollback

Before committing, use GitHub Desktop’s **Repository → Discard All Changes** to return to the current live release.

After deployment, open **History**, select the v11.5.4 commit, choose **Revert changes in commit**, and push the resulting revert commit to `main`.
