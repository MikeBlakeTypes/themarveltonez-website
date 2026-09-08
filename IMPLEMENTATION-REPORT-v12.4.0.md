# Marveltonez Professional Secure Access Area — v12.4.0 Implementation Report

## Baseline

Authoritative source repository: `Current live GitHub repository for Marveltonez-Website-v12.3.2.zip`

This implementation is bounded to the Professional Secure Access Area framework, its publication data contract, the protected individual-song route architecture, and the minimum privacy disclosure required by the new browser-local shortlist.

No legacy publisher-oriented song content has been imported.

## Files added

- `professional-catalogue.js` — isolated Professional Catalogue renderer and interaction layer.
- `professional-catalogue.css` — isolated Professional Catalogue visual/responsive layer.
- `metadata/professional-catalogue.json` — new authoritative website publication source for approved Professional Catalogue Profiles; currently contains zero profiles.
- `PROFESSIONAL-CATALOGUE-DATA-CONTRACT.md` — schema and governance boundary documentation.
- `catalogue/song/index.html` — protected individual professional-song route shell.

## Files changed

- `catalogue/index.html` — replaces the former protected empty-state placeholder with the real Professional Catalogue framework.
- `_redirects` — adds the protected `/catalogue/song/*` rewrite to the individual-song shell.
- `privacy.html` — narrowly updates the bilingual local-storage disclosure because ☆ Shortlist creates a second first-party browser-local record when deliberately used.
- `README.md` — documents the v12.4.0 foundation.
- `CHANGELOG.md` — records the v12.4.0 implementation.

Packaging also removes macOS transport debris (`__MACOSX` and `.DS_Store`) from the supplied repository copy; this does not alter site behaviour.

## Public-site files touched and why

No public Featured Songs, Industry, homepage, analytics function or legacy song-data implementation was changed.

The only public-facing policy file changed is `privacy.html`, solely because the previous wording explicitly said the site stored one local-storage record. The new private shortlist would make that statement inaccurate if deployed unchanged. The update states that:

- shortlist storage is created only when the visitor deliberately uses ☆ Shortlist;
- it stores only shortlisted song/profile identifiers and an expiry date;
- maximum persistence is 180 days;
- it is not sent to Marveltonez;
- it is not linked to the visitor's catalogue-access email address;
- clearing the shortlist removes the storage record.

No consent-banner redesign and no new tracking were added.

The shared `_redirects` file is changed only to support protected Professional Catalogue deep links.

## Professional Catalogue publication data contract

The new site source is:

`/metadata/professional-catalogue.json`

The legacy source:

`/metadata/songs.json`

is deliberately not read by `professional-catalogue.js`.

The renderer applies a hard publication gate. A profile can render only if all minimum identity fields exist and:

`publication.status === "APPROVED"`

This technically enforces the governing chain:

**Approved SIHO + Approved SAO → explicitly approved Professional Catalogue Profile → Professional Secure Access Area**

Raw SIHO, raw SAO, internal NAVURRA scoring, evidence chains, CRM information and internal analysis have no route into the website unless they have first been deliberately converted into approved Professional Catalogue Profile fields.

The final `professional-catalogue.json` contains:

`"profiles": []`

so no song content is published by this build.

## Search, tags and filters

Search indexes only approved Professional Catalogue Profile fields. Supported indexed material includes approved:

- title and version;
- genre/style;
- mood;
- vocal/performance profile;
- lyrical themes;
- tempo category;
- tags and approved search terms;
- professional positioning;
- artist/profile fit;
- opportunity/use characteristics;
- adaptability and structural editability;
- BPM, key, metre and professional-facing production status;
- rights/clearance statements;
- lyrics.

Search supports multiple terms; all entered terms must be found in the approved-profile search corpus.

Visible song tags are clickable and become an active catalogue constraint.

Filter choices are derived from values actually present in approved profiles, avoiding speculative empty taxonomy options. Initial supported dimensions are:

- Genre / style
- Mood
- Vocal / performance
- Tempo
- BPM
- Theme
- Key
- Metre

Active search/filter/tag/shortlist constraints are shown as removable chips, and a global clear action is provided.

## Private ☆ Shortlist

The shortlist is intentionally implemented at the least intrusive level:

- browser-local only;
- created only after deliberate shortlist use;
- stores only approved profile IDs plus an expiry timestamp;
- maximum persistence: 180 days;
- not sent to Marveltonez;
- not stored server-side;
- not tied to Cloudflare Access identity or email;
- no play/open/replay history is created;
- clearing the shortlist removes the local storage record;
- Show Shortlist provides a shortlist-only catalogue view.

No shortlist contents are automatically placed in an email.

## Audio transport

The Professional Catalogue uses its own isolated implementation of the established Marveltonez transport conventions:

- restart;
- play/pause;
- seek/progress;
- current/duration display;
- mute/unmute;
- one-song-at-a-time playback;
- forced normal playback speed.

The public `catalogue.js` and `catalogue.css` files remain unchanged, so the Featured Songs area receives no visible or behavioural redesign from this phase.

## Reveal structure

Approved fields can appear progressively through:

- Details
- Lyrics
- Technical
- Rights & Clearance

The default card remains compact and text/audio-led. No song artwork or artwork placeholder is used.

Lyrics are supported as normal approved profile content.

Technical fields support BPM, key, metre, version and approved production/maturity wording.

Rights & Clearance supports only deliberately approved publication fields, including co-writer exception, publishing/control, master/control, clearance and restrictions.

## Song-specific enquiry

Each rendered song receives an `Enquire about this song` mail action generated client-side from the approved profile title.

The subject identifies the song and the body contains only a short neutral reference to that song plus space for the professional's own enquiry.

No shortlist data is included.

No new click-count event is added in this phase.

## Protected individual-song deep links

The architecture now supports:

`/catalogue/song/<approved-profile-slug>/`

The route remains within the existing Cloudflare Access protected `/catalogue/*` area.

The individual page reads the same approved Professional Catalogue Profile source and will display only a matching approved profile. Missing, draft or unapproved profiles return the protected "Song profile not available" state.

## Analytics / tracking boundary

`professional-catalogue.js` sends no catalogue interaction analytics.

It performs only one network data read: `/metadata/professional-catalogue.json`.

It does not send shortlist, plays, opens, searches, tags or filters to Marveltonez.

Existing first-party site analytics remain untouched.

## Verification performed

- JavaScript syntax checked successfully with Node.
- Production professional-catalogue JSON validated successfully.
- HTML structure and robots metadata parsed successfully for catalogue and individual-song shells.
- Core logic tests passed for:
  - APPROVED profile inclusion;
  - DRAFT profile exclusion;
  - approved-tag search indexing;
  - BPM search indexing;
  - multi-term search;
  - non-match exclusion;
  - genre/BPM filters;
  - non-matching filter exclusion;
  - clickable tag matching;
  - shortlist-only matching;
  - shortlist record containing song ID only;
  - shortlist expiry presence;
  - storage record removal when shortlist is cleared.
- Byte comparison confirmed these current production files remain unchanged from v12.3.2:
  - `catalogue.js`
  - `catalogue.css`
  - `unreleased.html`
  - `industry/index.html`
  - `industry.js`
  - `industry.css`
  - `functions/analytics/page.js`
  - `functions/analytics/song.js`
  - `functions/track/[[path]].js`
  - `metadata/songs.json`
  - `index.html`

A headless Chromium screenshot/DOM run was attempted in the container, but the installed Chromium process did not terminate correctly in this environment. The implementation was therefore verified through syntax, structural, logic and regression tests rather than claiming a successful browser-render test.

## Human approval / decisions still required

Before treating the visual framework as final, review it live behind Cloudflare Access and decide whether any of these need refinement:

1. Exact catalogue introduction wording.
2. Exact small professional-use / recording-status notice wording.
3. Whether the first live profile reveals feel compact enough once real approved data is present.
4. The practical tag vocabulary and filter values — these should emerge from actual approved profiles rather than be invented now.
5. Whether the 180-day browser-local shortlist persistence is the preferred duration. It is currently aligned with the existing six-month consent-preference period.

No decision is required about artwork: the implementation deliberately contains no song artwork architecture in the professional cards.

## Exact next step

Create the **first real Professional Catalogue Profile** from the current approved SIHO + approved SAO for one selected song, in readable human-review form.

Do not write it into `metadata/professional-catalogue.json` until the Professional Catalogue Profile itself has been explicitly approved for publication.

Once approved, add that single profile to the new data source and use it to perform the first real behind-access usability test of:

- card density;
- audio;
- tags;
- search;
- filters;
- lyrics;
- Technical;
- Rights & Clearance;
- ☆ Shortlist;
- protected deep link;
- song-specific enquiry.

Only after that first profile behaves correctly should the initial catalogue batch be expanded.
