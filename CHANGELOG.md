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
