# Marveltonez Catalogue Audio Delivery Contract v1.0

## Purpose

This contract implements the approved 2c catalogue/output addendum for audio identity and Public/Professional exposure without changing SIHO, E2D or SAO authority.

The core rule is:

**one governed recording/version → one canonical audio asset at a time → independently controlled Public and Professional presentation surfaces.**

## Canonical identity and filename

A canonical production web-audio object is named from the governed recording/version ID:

`MTZ-####-V##.mp3`

The song title is presentation metadata, not the storage identity.

Do not invent a recording/version ID for a legacy song whose current governed Song Version is still blank.

## Presentation routes

Public song page:

`/song/<slug>/`

Professional song page:

`/catalogue/song/<slug>/`

A song may be Public only, Professional only, both, or neither. The page/exposure state does not redefine the underlying recording identity.

## Delivery modes

### PUBLIC_R2_LEGACY

Temporary migration state for an existing public recording whose current R2 object still uses a title-based legacy key.

The current URL remains live until the governed recording/version ID exists and the canonical replacement has been verified.

### PUBLIC_CANONICAL_R2

Used when the recording is Public-enabled. The public and Professional surfaces may both reference the same public canonical asset when the song is enabled in both areas.

Expected URL form:

`https://audio.themarveltonez.com/audio/MTZ-####-V##.mp3`

### PROTECTED_CATALOGUE_R2

Used for a Professional-only recording.

Expected website URL form:

`/catalogue/audio/MTZ-####-V##.mp3`

The Pages Function at `functions/catalogue/audio/[[path]].js` serves the object from a private R2 binding named `PROFESSIONAL_AUDIO`. Because the route sits under `/catalogue/*`, it is intended to inherit the existing Cloudflare Access boundary.

The Function also uses a generated allow-list of currently approved Professional-only recording IDs. An object remaining in the bucket is not, by itself, publication authority.

### PROTECTED_DESIGN_FIXTURE

Prototype-only delivery mode for explicitly protected design fixtures such as the current Superstar preview. It is not a production state.

## Legacy-nine migration procedure

For each legacy public recording:

1. confirm the current governed recording/version ID;
2. create the canonical R2 object using `MTZ-####-V##.mp3`;
3. update the website delivery record to the canonical URL;
4. deploy;
5. verify public playback and, where applicable, Professional playback;
6. only then retire the legacy title-based object.

The website must not switch to a canonical URL before that object exists and has been verified.

## Exposure-switch consequence

The governing state remains in Catalogue Master / Song Profiles. Website data and routes are derived consequences only.

- Public Enabled controls Public exposure.
- Professional Enabled controls Professional exposure.
- A change to exposure does not mutate SIHO/SAO intelligence.
- Website deployment must remove or cease exposing routes/data not authorised by the current derived state.

For a Public + Professional recording, no duplicate audio upload is required.

For a change between public delivery and Professional-only delivery, the storage/delivery transition must be verified before the former public object or route is retired.

## Protected data boundary

Professional profile data is loaded only from:

`/catalogue/data/professional-catalogue.json`

Do not restore professional profile data to an unprotected root `/metadata/` path.
