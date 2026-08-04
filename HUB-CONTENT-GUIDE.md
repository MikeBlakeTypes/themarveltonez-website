# Marveltonez Hub Content Guide

This guide covers the static Hub introduced in **Marveltonez Website v11.7**.

The Hub lives at:

- webpage: `hub/index.html`
- styling: `hub/hub.css`
- temporary images: `assets/images/hub/`
- click destinations and aggregate counters: `functions/track/[[path]].js`

## Featured card

Open `hub/index.html` and find this comment:

```html
<!-- FEATURED CARD — MANUAL CONTENT: EDIT LABEL, TITLE, COPY AND IMAGE HERE -->
```

The Featured card immediately below that comment contains:

- label: `Featured`
- title: `A Song for the Right Artist`
- supporting copy: `Discover what we’re writing now.`
- image references: `hub-featured-temp-480.webp` and `hub-featured-temp-960.webp`
- click route: `/track/hub-featured`

The Featured destination is configured in `functions/track/[[path]].js`:

```js
"hub-featured": "/unreleased.html"
```

Change the destination there rather than placing the final external URL directly in the card. This preserves the privacy-conscious aggregate click count.

**Featured rotation is not implemented in v11.7.** The card remains static until its label, title, copy, image or destination is changed manually.

## Permanent card destinations

The five Hub card routes are configured in `functions/track/[[path]].js`:

| Hub card | Analytics route | Current destination |
|---|---|---|
| Featured | `hub-featured` | `/unreleased.html` |
| Hear the Songs | `hub-hear-the-songs` | `/unreleased.html` |
| Songs We’ve Written | `hub-songs-weve-written` | `/#selected-releases` |
| Discover Marveltonez | `hub-discover` | `/#story` |
| Industry & Contact | `hub-industry-contact` | `/publisher.html` |

The utility routes are:

| Utility link | Analytics route |
|---|---|
| Instagram | `hub-instagram` |
| YouTube | `hub-youtube` |
| Shop | `hub-shop` |
| Main Website | `hub-main-website` |

Do not rename an analytics route after it has started collecting data unless a deliberate new counter is required.

## Temporary photography

The v11.7 images are local, optimised derivatives created from image material already in the website repository. Original source images remain unchanged.

| Card | Temporary files | Intended ratio |
|---|---|---|
| Featured | `hub-featured-temp-480.webp`, `hub-featured-temp-960.webp` | about 2.18:1 |
| Hear the Songs | `hub-hear-songs-temp-480.webp`, `hub-hear-songs-temp-960.webp` | about 2.67:1 |
| Songs We’ve Written | `hub-songs-written-temp-480.webp`, `hub-songs-written-temp-960.webp` | about 2.67:1 |
| Discover Marveltonez | `hub-discover-temp-480.webp`, `hub-discover-temp-960.webp` | about 8:9 |
| Industry & Contact | `hub-industry-temp-480.webp`, `hub-industry-temp-960.webp` | about 8:9 |

Recommended replacement sizes:

- Featured: 480 × 220 and 960 × 440 pixels
- each large music card: 480 × 180 and 960 × 360 pixels
- each compact card: 480 × 540 and 960 × 1080 pixels
- format: WebP
- colour direction: predominantly cool monochrome, strong contrast, controlled Marveltonez-red details where suitable

To replace a card image without redesigning the Hub:

1. prepare replacement images at the same dimensions and ratio;
2. give them clear filenames inside `assets/images/hub/`;
3. replace the two image paths in the relevant `<picture>` element in `hub/index.html`;
4. keep the displayed text as live HTML rather than embedding words into the image;
5. check the card at narrow-phone and standard-phone widths before deployment.

The layout, typography, gradients and arrow treatment are controlled by `hub/hub.css`; replacing photography does not require changing the card layout.

## Official logo

The Hub uses:

```text
assets/images/marveltonez-logo-production-master.svg
```

This is the official Production Master and must not be redrawn, recoloured, filtered or replaced with typeset text.

## Privacy and consent

The Hub loads the existing root `consent.js`. It adds no embedded YouTube or Spotify content and introduces no new cookies, third-party analytics or visitor identifiers.
