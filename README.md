# Marveltonez Website v11.8.3 — Industry Final Mobile Typography and Alignment Refinement

Focused mobile-only refinements to the permanent `/industry/` page:

- reduces the mobile **For Music Professionals** heading by approximately 25%;
- removes the forced line break before Mike Shannon so `Mike Shannon · United Kingdom` can remain together where space permits;
- vertically and horizontally centres the labels in the three mobile Industry action buttons;
- preserves the complete v11.8.2 mobile conference refinement, desktop presentation, wording, analytics, privacy, consent and catalogue behaviour.

Changed files: `industry.css`, `README.md`, `CHANGELOG.md`.

Rollback: discard the v11.8.3 changes before committing, or revert the v11.8.3 commit in GitHub Desktop and push the revert to `main`.

# Marveltonez Website v11.8.2 — Industry Mobile Conference Refinement

Focused mobile-first refinement of the permanent `/industry/` page:

- restores a compact mobile header with the Marveltonez logo and an accessible hamburger menu closed by default;
- keeps the desktop Industry navigation unchanged;
- reduces mobile hero height while preserving Professional Information, For Music Professionals and the approved Austria–UK wording;
- consolidates the Mike Blake and Mike Shannon profiles into one compact grouped mobile panel while preserving the desktop two-card layout;
- reduces mobile card padding, gaps, heading scale and button bulk;
- shortens the selected-songs button visually on mobile to **Hear the Featured Demos** while preserving its full accessible name and destination;
- substantially compresses Back to Top and the mobile footer without removing legal or consent controls;
- preserves all analytics action names, privacy, consent, catalogue, song, artwork, audio, merchandise and Cloudflare behaviour.

Changed files: `industry/index.html`, `industry.css`, `README.md`, `CHANGELOG.md`; new file: `industry.js`.

Rollback: discard the v11.8.2 changes before committing, or revert the v11.8.2 commit in GitHub Desktop and push the revert to `main`.

# Marveltonez Website v11.8.1 — Industry Heading Refinement

- Changed the large visible Industry-page heading from **Industry** to **For Music Professionals**.
- Preserved the **Professional Information** eyebrow, Industry navigation label, `/industry/` URL, metadata, styling, analytics, privacy, consent, catalogue and all other website behaviour.

Rollback: discard the v11.8.1 changes before committing, or revert the v11.8.1 commit in GitHub Desktop and push the revert to `main`.

# Marveltonez Website v11.8 — Industry and Conference Readiness Foundation

Professional-readiness refinement based on the current production repository:

- establishes Marveltonez consistently as the Austria–UK songwriting partnership of Mike Blake and Mike Shannon;
- identifies Mike Blake as based in Austria and Mike Shannon as based in the United Kingdom;
- renames the public nine-song collection to **Unreleased Featured Demos** while preserving its URL, song order, artworks, audio, lyrics, profiles and enquiries;
- applies the approved featured-demos introductory sentence;
- adds a permanent, responsive `/industry/` page for conference delegates, publishers, artist managers, recording artists, producers, A&R contacts, music supervisors and collaborators;
- links the Industry page from the homepage Our Story section and the concise catalogue-page navigation;
- routes Industry visitors to the existing featured demos, catalogue-access email request and professional contact mechanisms;
- adds privacy-conscious aggregate actions: `homepage-industry`, `navigation-industry`, `industry-featured-demos`, `industry-catalogue-access` and `industry-contact`;
- updates the privacy notice only to clarify the Austria–UK operating position and the new descriptive Industry-page action routes;
- preserves consent, optional-media blocking, accessibility, song-player behaviour, play/replay analytics, merchandise, Cloudflare Pages Functions, D1 schema and R2 audio delivery.

New files: `industry/index.html` and `industry.css`.

Rollback: discard v11.8 changes before committing, or revert the v11.8 commit in GitHub Desktop and push the revert to `main`.

# Marveltonez Website v11.6 — Song Card Artwork Viewer

Adds the nine approved 3:2 Song Card artworks and a lightweight, accessible Visual Listening Mode to the Unreleased Demos catalogue.

- places the correct approved artwork in the reserved lower-right area of each song card;
- uses small WebP card derivatives while retaining the supplied 1536 × 1024 PNG masters for enlarged viewing;
- opens each artwork in a centred charcoal modal with the existing audio transport moved into the viewer;
- reuses the same underlying audio element, playback state and event listeners, so playback continues uninterrupted and no duplicate audio stream is created;
- preserves Play, Pause, Go to Start, one-song-at-a-time behaviour and aggregate play/replay analytics;
- supports outside-click, Close button and Escape closing, focus trapping, focus return, background inertness and reduced-motion preferences;
- preserves scroll position and all unrelated catalogue, privacy, consent, merchandise and Cloudflare behaviour.

Changed files: `catalogue.js`, `catalogue.css`, `unreleased.html`, `metadata/songs.json`, `README.md`, `CHANGELOG.md`, plus the new `assets/images/song-artwork/` image assets.

Rollback: discard the v11.6 changes before committing, or revert the v11.6 commit in GitHub Desktop and push the revert to the preview branch or `main`, depending on where it was tested.

# Marveltonez Website v11.5.9 — Further Song Card Transport and Artwork Space Refinement

Narrowly scoped visual follow-up to v11.5.8:
- preserves the approved Go to Start action and all JavaScript behaviour;
- restyles the Go to Start control with a charcoal background, softly rounded rectangular shape and white transport icon;
- retains Marveltonez-red hover and keyboard-focus feedback;
- keeps the control aligned beside the native audio player at the same visual height;
- reduces the four left-aligned lower action dividers from 218px to 142px, approximately 35% shorter;
- increases the clear right-hand area reserved for future song-card artwork;
- adds no artwork placeholder;
- leaves lyrics, catalogue metadata, Public Display Order, audio URLs, badges, profiles, analytics, privacy, consent, merchandise and Cloudflare configuration unchanged.

Rollback: discard changes before committing, or revert the v11.5.9 commit in GitHub Desktop and push the revert to `main`.

# Marveltonez Website v11.5.8 — Song Card Transport and Artwork Space Refinement

Narrowly scoped Unreleased Demos refinement:
- removes the separate Restart text button;
- adds an accessible icon-led Go to Start control in the same transport row immediately beside the native audio player;
- Go to Start pauses the selected track, resets it to 0:00 and leaves it ready to play;
- preserves the one-song-at-a-time playback and aggregate play/replay analytics introduced in earlier releases;
- moves the red Profile and Lyrics plus/minus symbols immediately after their action text;
- changes the profile action between View Song Profile and Close Song Profile;
- shortens and left-aligns the four lower action dividers to create clear right-hand space for future artwork;
- adds no artwork placeholder in this release;
- leaves lyrics, catalogue metadata, Public Display Order, audio URLs, badges, enquiry routes, privacy, consent, merchandise, analytics and Cloudflare configuration unchanged.

Implementation note: browser-native audio controls cannot accept additional controls inside their protected control interface. The smallest reliable cross-browser solution is therefore a hybrid transport row with the Go to Start icon immediately adjacent to the native player.

Rollback: discard changes before committing, or revert the v11.5.8 commit in GitHub Desktop and push the revert to `main`.

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
