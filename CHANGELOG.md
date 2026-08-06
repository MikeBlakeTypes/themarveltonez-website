## v11.8.4 — Hub Mobile Card Height Refinement — 6 August 2026

- Reduced the Featured mobile card height by approximately 6%.
- Reduced the Discover Marveltonez and Industry & Contact mobile card heights by approximately 9%.
- Preserved equal compact-card heights, practical full-card tap targets, current imagery, crops, titles, supporting copy and arrows.
- Improved compact-card visibility above the iPhone Safari toolbar without changing the approved logo, header, Hear the Songs card or Songs We’ve Written card.
- Changed no wording, destinations, analytics, privacy, consent or accessibility behaviour.
- Made no desktop redesign; Featured-card rotation remains unimplemented.

Changed files:

- modified: `hub/index.html`
- modified: `hub/hub.css`
- modified: `README.md`
- modified: `CHANGELOG.md`

Rollback: revert the v11.8.4 commit in GitHub Desktop to restore the previous Hub card heights exactly.

## v11.7.3 — Hub Final Mobile Fold Refinement — 4 August 2026

- Reduced the rendered mobile logo by approximately 6% without modifying the Production Master SVG.
- Reduced the mobile height of the Discover Marveltonez and Industry & Contact cards by approximately 7%.
- Shifted the Songs We’ve Written image composition to the right and reduced its scale slightly.
- Kept both eyes visible and preserved clear space between the face and the red arrow control.
- Preserved the left-side black fade, live HTML copy and the approved landscape-card architecture.
- Changed no wording, destinations, analytics, privacy, consent, accessibility or Featured-card behaviour.
- Featured-card rotation remains unimplemented.

Changed files:

- modified: `hub/index.html`
- modified: `hub/hub.css`
- modified: `README.md`
- modified: `CHANGELOG.md`

Rollback: revert the v11.7.3 commit in GitHub Desktop to restore the exact v11.7.2 Hub layout.

## v11.7.2 — Hub Mobile Header and Second-Screen Refinement — 4 August 2026

- Applied the approved optical logo alignment at desktop and tablet breakpoints without modifying the Production Master SVG.
- Refactored the three landscape cards so their photography occupies the right-hand 72% and fades smoothly into a stable black text field through CSS.
- Added responsive WebP derivatives from the approved *I Didn’t Mean to Turn Out Bad* reverse master for the Featured card.
- Added responsive WebP derivatives from the approved *Just Sayin’* reverse master for Hear the Songs.
- Retained the current Songs We’ve Written source image while applying the same right-justified fade treatment.
- Made Featured approximately 14% shallower and both large music cards approximately 12% shallower on mobile, preserving title sizes, arrows and practical tap targets.
- Added Facebook before Instagram using the authoritative repository URL `https://www.facebook.com/themarveltonez` and the new aggregate `hub-facebook` route.
- Renamed the visible Shop utility label and accessible name to Merch while preserving the Etsy destination and existing `hub-shop` route.
- Preserved card wording, existing destinations, privacy, consent, accessibility and static Featured behaviour.

Changed files:

- new: `assets/images/hub/hub-featured-idmtob-480.webp`
- new: `assets/images/hub/hub-featured-idmtob-960.webp`
- new: `assets/images/hub/hub-hear-songs-just-sayin-480.webp`
- new: `assets/images/hub/hub-hear-songs-just-sayin-960.webp`
- modified: `hub/index.html`
- modified: `hub/hub.css`
- modified: `functions/track/[[path]].js`
- modified: `HUB-CONTENT-GUIDE.md`
- modified: `README.md`
- modified: `CHANGELOG.md`

Rollback: revert the v11.7.2 commit in GitHub Desktop to restore the exact v11.7.1 Hub design, temporary artwork, four-item utility row and analytics routes.

## v11.7.1 — Hub Mobile Header and First-Screen Refinement — 4 August 2026

- Reduced the rendered mobile logo width by approximately 14% without modifying the Production Master SVG.
- Aligned the visible logo, positioning copy and card column on one coherent left axis.
- Tightened mobile top padding and header spacing while retaining premium breathing room.
- Made the Featured card approximately 6% shallower on mobile.
- Reduced mobile gaps between the large cards and compact-card pair from 9px to 6px.
- Improved first-screen visibility of Discover Marveltonez and Industry & Contact.
- Preserved card-title sizes, body-copy readability, arrow controls and practical tap targets.
- Changed no wording, destinations, photography, analytics, privacy, consent or accessibility behaviour.
- Featured-card rotation remains unimplemented.

Changed files:

- modified: `hub/index.html`
- modified: `hub/hub.css`
- modified: `README.md`
- modified: `CHANGELOG.md`

Rollback: revert the v11.7.1 commit in GitHub Desktop to restore the original v11.7 Hub spacing exactly.

## v11.7 — Marveltonez Hub Initial Static Release — 4 August 2026

- Added the new mobile-first `/hub/` social entrance using the approved Editorial B layout.
- Used the unchanged official Production Master SVG, official Marveltonez colours and existing local Barlow Condensed and Inter font files.
- Added one static manual Featured card, two large music cards, two compact editorial cards and four secondary utility links.
- Added optimised provisional WebP photography derived only from existing repository images; all original source images remain unchanged.
- Added nine fixed `hub-*` aggregate outbound-click routes to the existing Cloudflare Pages Function without changing its D1 schema, privacy behaviour, error handling or existing routes.
- Reused the existing consent system, added no embedded media, third-party trackers, new cookies, persistent visitor identifiers or autoplay.
- Added keyboard focus, screen-reader names, responsive card behaviour, safe-area support and reduced-motion handling.
- Added `HUB-CONTENT-GUIDE.md` explaining manual Featured edits, image replacement and route configuration.
- Did not add the Hub to the existing main navigation and did not change the homepage, catalogue, song artwork viewer, metadata, audio, merchandise, privacy page or Cloudflare configuration.

Changed files:

- new: `hub/index.html`
- new: `hub/hub.css`
- new: `assets/images/marveltonez-logo-production-master.svg`
- new: `assets/images/hub/*`
- new: `HUB-CONTENT-GUIDE.md`
- modified: `functions/track/[[path]].js`
- modified: `README.md`
- modified: `CHANGELOG.md`

Rollback: revert the v11.7 commit in GitHub Desktop. This removes all new Hub files and Hub-specific analytics routes and restores the exact previous v11.6 state.

## v11.6 — Song Card Artwork Viewer — 3 August 2026

- Added all nine approved 3:2 Song Card artworks to the Unreleased Demos cards.
- Added responsive WebP card derivatives and retained the supplied 1536 × 1024 PNG masters for enlarged viewing.
- Added an accessible Visual Listening Mode with a charcoal overlay, enlarged uncropped artwork and the selected song’s existing audio transport directly beneath it.
- Reused the same audio element in the modal rather than cloning it, preserving playback position, Play/Pause state, Go to Start behaviour, one-song-at-a-time playback and play/replay analytics.
- Added Close button, outside-click and Escape closing, focus trapping, focus return, background inertness, preserved scroll position and reduced-motion support.
- Preserved existing song-card content, accordions, enquiry routes, privacy, consent, merchandise, analytics and unrelated site behaviour.

## v11.5.9 — Further Song Card Transport and Artwork Space Refinement

- Restyled the Go to Start control as a charcoal, softly rounded rectangle with a white Skip Backward icon.
- Matched its visual height and alignment to the adjacent native audio-player control area.
- Preserved the approved pause-and-reset behaviour, accessible label, one-song-at-a-time playback and play/replay analytics.
- Reduced all four lower action dividers from 218px to 142px, approximately 35% shorter and still left-aligned.
- Increased the right-hand space reserved for future song-card artwork.
- Changed no JavaScript, lyrics, catalogue metadata, audio URLs, privacy, consent, merchandise, analytics or Cloudflare configuration.

## v11.5.8 — Song Card Transport and Artwork Space Refinement

- Removed the separate Restart text button from all nine Unreleased Demo cards.
- Added an accessible Skip Backward / Go to Start icon beside each native audio player.
- Go to Start pauses and resets the selected track to 0:00 without starting playback.
- Preserved one-song-at-a-time playback and play/replay analytics.
- Moved Profile and Lyrics plus/minus symbols immediately after their labels.
- Added View/Close Song Profile wording synchronized with the profile state.
- Shortened and left-aligned the four lower action dividers to reserve right-hand artwork space.
- Added no artwork placeholder and changed no catalogue metadata, lyrics, audio URLs, privacy, consent, merchandise, analytics or Cloudflare configuration.

## v11.5.7 — Add Replay Button — 1 August 2026

- Added a small visible Restart button beneath the native audio player on all nine public Unreleased Demos song cards.
- Restart pauses the selected song, returns it to 0:00 and starts it again.
- Preserved the existing v11.5.6 deliberate play and same-session replay analytics.
- Preserved one-song-at-a-time playback, native audio controls, Featured Song badges, metadata-driven Explicit badges, catalogue order, lyrics, profiles, enquiry links, privacy and responsive behaviour.
- Updated only the catalogue script, catalogue stylesheet, Unreleased Demos cache references and version documentation.

## v11.5.6 — Privacy-Conscious Song Play and Replay Analytics — 1 August 2026

- Added aggregate `song-play-[song-slug]` counters for the first deliberate start of each public catalogue song during the current open-page session.
- Added aggregate `song-replay-[song-slug]` counters for later deliberate starts of the same song during that same open-page session.
- Added a first-party `/analytics/song` Pages Function that accepts only approved public song slugs and approved `play` or `replay` event types.
- Kept replay state only in temporary webpage memory; no cookies, local storage, session storage, persistent identifiers or visitor profiles were introduced.
- Preserved one-song-at-a-time playback and excluded pause/resume, seeking, preload, metadata loading and HEAD requests from deliberate-start counting.
- Updated English and German privacy wording.
- Preserved all existing analytics routes and D1 data.

## v11.5.5 — Contact Click Analytics Refinement — 30 July 2026

- Split the previous combined `general-contact` counter into placement-specific counters for the homepage Contact Us button, homepage Get In Touch card, footer email link and navigation Contact links.
- Preserved all existing Etsy, merchandise, publisher-access and song-enquiry tracking.
- Retained the legacy `general-contact` route for compatibility with previously cached pages.
- Updated English and German privacy wording to describe the refined aggregate contact-link counting.
- Preserved cookie-free, profile-free D1 aggregation, HEAD exclusion and fail-safe redirects.

## v11.5.4c — Single Audio Playback Restoration

- Restored single-audio-player behaviour on the Unreleased Demos page.
- Starting one song now pauses every other catalogue player and resets previously playing audio to 0:00.
- Preserved all v11.5.4b lyrics, panel-closing, badge, metadata, enquiry, privacy, analytics, merchandise and Cloudflare behaviour.
- Updated only the Unreleased Demos JavaScript cache reference.

## v11.5.4b — Duplicate Title and Panel Close Refinement

- Removed the unintended small duplicate song title from all Unreleased Demo cards.
- Preserved the large main song title and consolidated status badges.
- Standardised View Lyrics / Close Lyrics with a red right-aligned plus/minus state symbol.
- Added click-anywhere closing for non-interactive areas of open song-profile and lyrics panels.
- Added Escape-key closing while preserving links, buttons, audio controls and explicit close controls.
- Updated Unreleased Demos cache references only; no catalogue metadata, lyrics, audio URLs, analytics, privacy, consent, merchandise or Cloudflare configuration changed.

# Changelog

## v11.5.4a — Song Card Action and Badge Refinement — 29 July 2026

- Unified View Song Profile, View Lyrics and Enquire About This Song as consistent left-aligned plain-text action rows.
- Added accessible hover and keyboard-focus treatment using Marveltonez red.
- Added View Lyrics / Close Lyrics state text with red plus and minus indicators.
- Removed the redundant grey song identifier from the upper-right of every card.
- Kept Featured Song and EXPLICIT badges together in the existing metadata-driven badge row.
- Preserved all lyrics, copyright notices, catalogue metadata, public display order, audio URLs, enquiry routes, Writer’s Collection navigation, privacy, consent, analytics and Cloudflare configuration.
- Versioned the Unreleased Demos catalogue stylesheet and script as v11.5.4a.

## v11.5.4 — Lyrics, Catalogue Order and Writer’s Collection Navigation — 29 July 2026

- Added accessible View Lyrics controls and expandable lyric panels to all nine public Unreleased Demos cards.
- Preserved the supplied lyric wording, section structure, explicit language and two-line copyright notices.
- Added metadata-driven `Public Display Order` values from `Marveltonez Catalogue Master v2.9.2` and made the card renderer sort by those values.
- Synchronised public titles, keywords, Explicit values, status and profile metadata from catalogue master v2.9.2 without changing any working R2 audio URL.
- Preserved the Featured Song and red EXPLICIT badge system.
- Updated each merchandise product page’s Writer’s Collection and Back to Collection links to the root `/#writers-collection` anchor.
- Versioned the Unreleased Demos catalogue stylesheet and script as v11.5.4.

## v11.5.3a — Catalogue Metadata and Explicit Badge Refinement — 28 July 2026

- Updated the public Unreleased Demos metadata from `Marveltonez Catalogue Master v2.4`.
- Marked “Put Your Shirt Back On”, “Just Sayin’” and “I Didn’t Mean to Turn Out Bad” as explicit.
- Changed the displayed title from “It’s a Happy Break-Up” to “It’s a Happy Breakup”.
- Updated that song’s public catalogue metadata and keywords from the v2.4 source of truth while retaining its existing R2 audio URL.
- Reduced the EXPLICIT badge font weight to match the existing Featured Song badge while preserving its red-tinted treatment.
- Versioned the Unreleased Demos catalogue stylesheet as v11.5.3a.

## v11.5.3 — Explicit Lyrics Badge — 28 July 2026

- Added metadata-driven support for the new `Explicit` catalogue field.
- Added a discreet red `EXPLICIT` badge to Unreleased Demos cards where the catalogue value is `Yes`.
- Preserved the existing Featured Song or other status badge so both labels can appear together.
- Updated the public catalogue source reference to `Marveltonez Catalogue Master v2.3`.
- Marked “Just Sayin’” as explicit in accordance with the uploaded v2.3 catalogue source of truth.
- Versioned `catalogue.css` and `catalogue.js` references as v11.5.3.

## v11.5.1 — Privacy-Conscious Outbound Click Analytics — 26 July 2026

- Added a Cloudflare Pages Function at `functions/track/[[path]].js`.
- Added aggregate D1 counting for selected Etsy, merchandise, publisher-access, contact and per-song enquiry actions.
- Added fail-safe destination redirects and excluded HEAD requests from counting.
- Updated the English and German privacy wording.
- Updated the catalogue enquiry links and cache version.

## v11.5 — Privacy, Consent and Embedded Media Corrections

- Corrected the privacy policy to identify Cloudflare Pages as the current publishing and hosting platform.
- Updated the bilingual privacy-policy date to 24 July 2026.
- Clarified that song metadata normally loads locally and public audio loads from Cloudflare R2 only when played.
- Added explicit English and German wording for external Etsy shop and product links.
- Confirmed that no Etsy content or widget loads before a visitor clicks an Etsy link.
- Removed the malformed and unusable Cloudflare R2 metadata fallback.
- Retained the working local catalogue metadata file as the single metadata source.
- Added keyboard focus containment to the cookie and media preferences dialog.
- Versioned consent.js, script.js and catalogue.js references as v11.5 to reduce stale-cache behaviour.
- Retained the existing local YouTube thumbnails, consent-gated YouTube loading, youtube-nocookie.com embeds, ordinary Etsy links and preload="none" public audio architecture.
- Removed the retired GitHub Pages CNAME file from the deployment package.

## v11.4.3 — Hero Logo Sizing Hotfix

- Reduced the hero logo maximum width across desktop, tablet and phone layouts.
- Set the desktop and iPad maximum width to 500px.
- Set the tablet maximum width to 390px.
- Set the phone maximum width to 320px.
- Set the narrow-phone maximum width to 290px.
- Added inline safety sizing so the logo cannot render at its full source width if cached CSS is briefly stale.
- Versioned the homepage stylesheet reference as `style.css?v=11.4.3` to force immediate loading of the corrected rules.

## v11.4.2 — Hero Logo Asset Hotfix

- Replaced the reconstructed hero text logo with the approved Marveltonez Production Master logo image.
- Ensured the hero now uses the exact approved grey and red logo colours and original logo proportions.
- Preserved the existing hero layout, copy, buttons and responsive behaviour.

## v11.4.1 — Website Quality Corrections

- Removed the duplicate front three-quarter Premium Cap gallery image.
- Removed the duplicate model image from the Signature T-Shirt gallery.
- Moved the Signature T-Shirt “Available on Etsy” badge to the bottom of its collection thumbnail.
- Changed the Studio Hoodie collection action to “Coming Soon — Preview Here.”
- Updated every song-card enquiry email with the approved song-specific template.
- Added a complete pre-filled Publisher Catalogue access-request email.
- Ensured the word “THE” in the approved website logo uses Marveltonez Grey (#B3B3B3).
- Retained song Share buttons for the planned v11.5 Song Showcase release.

## v11.4 — Website Quality Pass

- Connected the Writer’s Collection to the live TheMarveltonez Etsy shop.
- Replaced outdated “Coming Soon” wording for the live T-shirt, cap and mug.
- Added direct Etsy purchase links for the three active products.
- Retained the Studio Hoodie as “Sample Evaluation Pending.”
- Added a customer reviews placeholder for the Writer’s Collection.
- Updated the Publisher Catalogue wording and added the approved-access contents list.
- Italicised “human-written” in the two agreed sections.
- Added the J-Dash unreleased-song collaboration.
- Replaced the text-built header and footer wordmarks with the approved Production Master logo export.
- Refined merchandise badge sizing and repositioned the hoodie badge to protect faces and branding.
- Updated collection product naming and post-launch wording.

## v11.3 — Compliance & Corrections

- Added a bilingual English/German Privacy & Datenschutz page covering hosting, Cloudflare R2 audio, optional YouTube content, local storage, email enquiries, external links, data-subject rights and the Austrian Data Protection Authority.
- Added an equal-choice privacy banner with Accept videos, Reject optional and Preferences controls.
- Added persistent Cookie Preferences access in every footer and on the privacy page.
- Blocked YouTube connections by default; embedded videos load only after consent and use YouTube’s privacy-enhanced domain.
- Self-hosted Barlow Condensed and Inter to remove automatic Google Fonts requests.
- Confirmed the corrected Blocked & Deleted R2 master and added a dated cache-busting query to its catalogue URL.
- Replaced the former sweatshirt/hoodie presentation with the approved Marveltonez Studio Hoodie and all five supplied mock-ups.
- Used the male-and-female model image as the homepage and featured hoodie image.
- Restored the T-shirt and hoodie homepage thumbnails to clean light-background imagery.
- Preserved the v11.2 catalogue, navigation, profile-closing, playback, responsive and accessibility behavior.

## v11.2 — Website Quality Pass

- Standardised click-through page spacing using the Writer’s Mug page as the reference.
- Reduced Publisher Catalogue top spacing on iPhone.
- Added mobile full-screen guidance and improved landscape video viewer behaviour.
- Added stronger hover/focus feedback to video cards.
- Added “human-written” messaging to Our Story and the enquiry section.
- Added “New songs will be uploaded regularly” to the catalogue introduction.
- Added the Jenny Frost studio photograph to Behind the Songs with monochrome treatment.
- Reworked tee and hoodie homepage thumbnails with charcoal backgrounds and black frames.
- Changed product calls-to-action to “View & Order”.
- Expanded all four product pages with material, fit, dimensions or product-development information.
- Added Notify Me email actions for Collection One.
- Improved song-specific email enquiry wording with a pre-filled message.
- Added the closing slogan “Songs with hooks. Built for artists.” to the footer.
- Added favicon, Apple touch icon, Open Graph/Twitter metadata, canonical homepage URL and basic structured data.
- Added lazy loading to suitable images, reduced-motion support, focus states and accessibility refinements.
