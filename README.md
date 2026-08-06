# Marveltonez Website v11.9 — Search Identity and Legacy Contact Resolution

Search identity and indexing-discovery refinement:

- changes the homepage title, Open Graph title and Twitter title to **The Marveltonez | Austria–UK Songwriting Partnership**;
- preserves the approved homepage Austria–UK description and visible positioning;
- adds factual Organisation-member structured data for Mike Blake in Austria and Mike Shannon in the United Kingdom;
- adds `id="professional-contact"` to the existing Industry contact section with a safe sticky-header scroll offset;
- adds permanent `/contact` and `/contact/` redirects to `/industry/#professional-contact`;
- adds a canonical non-`www` `sitemap.xml`;
- adds `robots.txt` with the canonical sitemap location;
- restores root `.gitignore` protection against macOS metadata;
- preserves Hub synchronisation through v11.8.5, analytics, privacy, consent, catalogue, songs, audio, merchandise and all unrelated behaviour.

Changed files: `index.html`, `industry/index.html`, `industry.css`, `README.md`, `CHANGELOG.md`.
Added files: `_redirects`, `sitemap.xml`, `robots.txt`, `.gitignore`.

Rollback: discard the v11.9 changes before committing, or revert the v11.9 commit in GitHub Desktop and push the revert to `main`. Reverting also removes the sitemap, robots file and legacy contact redirects unless reapplied separately.

# Marveltonez Website v11.8.5 — Hub Main Synchronisation and Destination Correction

Controlled reconciliation using the current production `main` repository as the website foundation and the approved v11.8.4 Hub branch as the Hub source.

- preserves the current production homepage, Industry page, Unreleased Featured Demos page, Publisher page, privacy and consent system, merchandise pages, navigation, analytics and all v11.8.3a production refinements;
- carries across the complete approved `/hub/` implementation, Hub assets, Production Master logo and Hub content guide;
- reconciles production and Hub analytics routes without removing or duplicating existing routes;
- changes `hub-featured` to the current Industry page at `/industry/`;
- confirms `hub-hear-the-songs` points to the current Unreleased Featured Demos page at `/unreleased.html`;
- preserves the approved Hub design, card dimensions, imagery, wording, responsive behaviour, privacy and consent behaviour.

Changed or added files: `hub/index.html`, `hub/hub.css`, `HUB-CONTENT-GUIDE.md`, `assets/images/marveltonez-logo-production-master.svg`, `assets/images/hub/`, `functions/track/[[path]].js`, `README.md`, and `CHANGELOG.md`.

Rollback: revert the v11.8.5 commit to restore the preceding feature-branch state. This package intentionally updates the branch to the current production `main` baseline while retaining the approved Hub.

# Marveltonez Website v11.8.4 — Hub Mobile Card Height Refinement

Final mobile-only card-height refinement of the approved Editorial B Hub.

- makes the Featured card approximately 6% shallower at mobile breakpoints;
- makes Discover Marveltonez and Industry & Contact approximately 9% shallower while preserving equal heights and practical full-card tap targets;
- freezes the approved logo, header, Hear the Songs card, Songs We’ve Written card, image crops, wording, destinations, analytics, privacy and consent behaviour;
- updates the Hub stylesheet cache version to v11.8.4 so Safari and Cloudflare request the refined CSS.

Modified files: `hub/index.html`, `hub/hub.css`, `README.md`, and `CHANGELOG.md`.

Rollback: revert the v11.8.4 commit in GitHub Desktop to restore the previous Hub card heights exactly.

# Marveltonez Website v11.7.3 — Hub Final Mobile Fold Refinement

Targeted final-fold refinement of the approved Editorial B Hub.

- reduces the rendered mobile logo by approximately 6% while preserving the Production Master SVG and optical alignment;
- makes the Discover Marveltonez and Industry & Contact cards approximately 7% shallower on mobile;
- repositions and slightly scales down the Songs We’ve Written image so both eyes are visible and the arrow remains clear of the eye area;
- preserves all wording, destinations, analytics, privacy, consent, accessibility, photography and Featured-card behaviour.

Modified files: `hub/index.html`, `hub/hub.css`, `README.md`, and `CHANGELOG.md`.

Rollback: revert the v11.7.3 commit in GitHub Desktop to restore the exact v11.7.2 Hub layout.

# Marveltonez Website v11.7.2 — Hub Mobile Header and Second-Screen Refinement

Targeted editorial-card and utility-row refinement of the approved v11.7.1 Hub.

- applies the approved optical logo alignment at desktop and tablet breakpoints without modifying the Production Master SVG;
- moves photography in the three landscape cards to the right-hand 72% with a smooth CSS fade into a stable black text field;
- replaces the Featured artwork with responsive derivatives from the approved *I Didn’t Mean to Turn Out Bad* reverse master;
- replaces the Hear the Songs artwork with responsive derivatives from the approved *Just Sayin’* reverse master;
- makes Featured approximately 14% shallower and both large music cards approximately 12% shallower on mobile;
- adds the authoritative Marveltonez Facebook link and aggregate `hub-facebook` route;
- renames the visible Shop utility label to Merch while preserving the existing Etsy destination and `hub-shop` counter;
- preserves all existing card wording, destinations, privacy, consent, accessibility and static Featured behaviour.

New files: `assets/images/hub/hub-featured-idmtob-480.webp`, `assets/images/hub/hub-featured-idmtob-960.webp`, `assets/images/hub/hub-hear-songs-just-sayin-480.webp`, and `assets/images/hub/hub-hear-songs-just-sayin-960.webp`.

Modified files: `hub/index.html`, `hub/hub.css`, `functions/track/[[path]].js`, `HUB-CONTENT-GUIDE.md`, `README.md`, and `CHANGELOG.md`.

Rollback: revert the v11.7.2 commit in GitHub Desktop to restore the exact v11.7.1 Hub artwork, card proportions, utility row and analytics routes.

# Marveltonez Website v11.7.1 — Hub Mobile Header and First-Screen Refinement

Targeted mobile refinement of the approved v11.7 Editorial B Hub.

- reduces the rendered mobile logo width while preserving the unchanged Production Master SVG;
- aligns the visible logo, positioning copy and card column on one coherent left axis;
- tightens mobile header spacing without reducing card-title sizes or tap targets;
- makes the Featured card approximately 6% shallower on mobile;
- reduces mobile card gaps slightly to reveal more of the compact lower cards;
- preserves all wording, destinations, analytics, privacy, consent, accessibility and photography;
- leaves Featured-card rotation deliberately unimplemented.

Modified files: `hub/index.html`, `hub/hub.css`, `README.md`, and `CHANGELOG.md`.

Rollback: revert the v11.7.1 commit in GitHub Desktop to restore the original v11.7 Hub spacing exactly.

# Marveltonez Website v11.7 — Marveltonez Hub Initial Static Release

Adds a new isolated `/hub/` social-media entrance using the approved Editorial B composition and official Marveltonez Production Master SVG.

- introduces one static, manually editable Featured card;
- adds two large music routes: Hear the Songs and Songs We’ve Written;
- adds two compact editorial routes: Discover Marveltonez and Industry & Contact;
- adds restrained Instagram, YouTube, Shop and Main Website utility links;
- uses local, provisional responsive photography derived from existing repository assets;
- extends the existing first-party Cloudflare D1 click analytics with nine fixed `hub-*` routes;
- retains the existing consent interface, privacy principles, keyboard access, visible focus, reduced-motion support and mobile-first responsive behaviour;
- keeps the implementation isolated from the homepage, catalogue, song-card artwork viewer, merchandise pages and existing navigation.

New files: `hub/index.html`, `hub/hub.css`, `assets/images/marveltonez-logo-production-master.svg`, `assets/images/hub/`, and `HUB-CONTENT-GUIDE.md`.

Modified files: `functions/track/[[path]].js`, `README.md`, and `CHANGELOG.md`.

Featured-card rotation is deliberately not included in this initial static release.

Rollback: discard the v11.7 changes before committing, or revert the v11.7 commit in GitHub Desktop. Reverting removes the Hub files and Hub analytics routes and restores the exact previous v11.6 state.

# Marveltonez Website v11.8.3a — Industry CSS Cache Refresh and macOS Debris Cleanup

Small deployment hotfix:

- updates the Industry stylesheet cache reference from `/industry.css?v=11.8.2` to `/industry.css?v=11.8.3` so normal browser sessions request the current v11.8.3 CSS;
- removes committed and packaged macOS metadata files including `.DS_Store`, AppleDouble `._*` files and `__MACOSX`;
- adds a root `.gitignore` rule to prevent macOS metadata from being committed again;
- preserves all v11.8.3 styling, content, analytics, privacy, consent, catalogue and website functionality.

Changed files: `industry/index.html`, `.gitignore`, `README.md`, `CHANGELOG.md`.
Removed repository debris: `assets/.DS_Store`, `assets/images/.DS_Store`, `functions/.DS_Store`.

Rollback: discard the v11.8.3a changes before committing, or revert the v11.8.3a commit in GitHub Desktop and push the revert to `main`.

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
