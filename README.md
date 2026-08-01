# Marveltonez Website v11.5.7 — Add Replay Button

This narrowly scoped refinement adds a small visible **Restart** button beneath the native audio player on all nine public Unreleased Demos song cards.

- Restart pauses the selected song, returns it to 0:00 and starts playback again.
- The existing v11.5.6 play/replay analytics remain in place, so restarting a previously played song records the existing same-session replay action.
- One-song-at-a-time playback, native audio controls, Featured Song badges, Explicit badges, song metadata, lyrics, enquiry links, privacy controls and all other website content remain unchanged.

Rollback: before committing, discard all changes in GitHub Desktop. After deployment, revert the v11.5.7 commit in GitHub Desktop and push the revert to `main`.

# Marveltonez Website v11.5.6 — Privacy-Conscious Song Play and Replay Analytics

This controlled refinement extends the existing first-party Cloudflare D1 analytics system with aggregate per-song action counters:

- `song-play-[song-slug]` for the first deliberate start of a song during the current open-page session;
- `song-replay-[song-slug]` for later deliberate starts of the same song during that same open-page session.

The distinction exists only in temporary webpage memory. No cookies, `localStorage`, `sessionStorage`, persistent browser identifiers, listener profiles, listening duration or completion data are introduced. Analytics requests are sent to `/analytics/song`, accept only the nine known public song slugs and the approved `play` or `replay` event types, and fail silently without delaying playback.

All existing outbound-click, merchandise, contact, publisher-access and song-enquiry counters remain unchanged.

# Marveltonez Website v11.5.5 — Contact Click Analytics Refinement

This small analytics refinement separates the former combined `general-contact` count into four placement-specific aggregate counters:

- `homepage-contact-button`
- `homepage-get-in-touch`
- `footer-email`
- `navigation-contact`

The existing Etsy, merchandise, publisher-access and song-enquiry counters remain unchanged. The first-party Cloudflare Pages Function still records only date, descriptive link name and aggregate daily count, excludes HEAD requests, and redirects even if the D1 write fails. The legacy `general-contact` route remains available for compatibility with previously cached pages.

# Marveltonez Website v11.5.4c — Single Audio Playback Restoration

Corrective Unreleased Demos update:
- restores one-song-at-a-time playback across the nine public demo cards;
- starting a new song pauses every other catalogue audio player;
- previously playing audio is reset to 0:00;
- preserves all v11.5.4b song-card, lyrics, profile, badge and panel-closing behaviour;
- leaves catalogue metadata, lyrics, Public Display Order, R2 audio URLs, enquiry routes, analytics, privacy, consent, merchandise and Cloudflare configuration unchanged.

Rollback: discard changes before committing, or revert the v11.5.4c commit in GitHub Desktop and push the revert to `main`.

# Marveltonez Website v11.5.4b — Duplicate Title and Panel Close Refinement

Corrective Unreleased Demos update:
- removes the unintended small duplicate song title beneath the badge row;
- keeps the large main title unchanged;
- retains the View Lyrics / Close Lyrics action with a red right-aligned plus/minus symbol;
- allows non-interactive clicks inside an open song-profile or lyrics panel to close that panel;
- preserves explicit close controls, interactive elements and Escape-key closing;
- leaves lyrics, metadata, Public Display Order, audio URLs, badges, enquiry routes, analytics, privacy, consent, merchandise and Cloudflare configuration unchanged.

Rollback: discard changes before committing, or revert the v11.5.4b commit in GitHub Desktop and push the revert to `main`.

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
