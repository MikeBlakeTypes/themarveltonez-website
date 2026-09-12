# Marveltonez Professional Catalogue Data Contract v2.0 — Prototype

## Purpose

This contract is the website-facing publication/exposure boundary for the protected Marveltonez Professional Catalogue. The website is a presentation layer, not a NAVURRA analytical-object viewer.

The intended production flow is:

**SIHO / SAO → Catalogue Master Song Profiles → Professional Export → authorised machine-readable website feed → Professional Catalogue frontend**

The transport from Professional Export to the website is not frozen by this contract. A generated JSON feed is a natural fit for the current GitHub / Cloudflare Pages architecture, but the frontend should remain transport-agnostic.

The website does **not** consume raw SIHO, SAO, E2D, 2b operational reports, human-review transcripts or narrative handoff snapshots.

## Authoritative website data source in the current implementation

`/metadata/professional-catalogue.json`

The legacy `/metadata/songs.json` remains non-authoritative for the Professional Secure Access Area and is not read by the Professional Catalogue renderer.

## Production publication gate

Normal production records render only when:

```json
"publication": {
  "status": "APPROVED"
}
```

Any other publication state is non-publishable by default.

### Protected design-fixture exception

For the v12.5.0 Superstar UI prototype only, an explicit protected design fixture can render when **both** conditions are met:

1. the protected page opts in with `data-allow-design-fixtures="true"`; and
2. the record contains:

```json
"preview": {
  "status": "DESIGN_PREVIEW",
  "protectedOnly": true
}
```

This exception is deliberately separate from `publication.status`. It does not mean `NOT_SELECTED`, `DRAFT` or any other upstream state has become publication approval. Remove the fixture opt-in/record when the prototype phase ends and routine Professional Export delivery takes over.

## Structured website record

The frontend is designed around discrete approved professional fields rather than one narrative profile document. Optional fields disappear cleanly when absent.

```json
{
  "id": "MTZ-XXXX-VXX",
  "slug": "stable-professional-song-slug",
  "identity": {
    "title": "Song title",
    "compositionId": "MTZ-XXXX",
    "recordingId": "MTZ-XXXX-VXX",
    "version": "VXX",
    "recordingType": "Presentation Master"
  },
  "discovery": {
    "genreStyle": ["Approved professional genre/style terms"],
    "mood": ["Approved concise mood terms"],
    "lyricalThemes": ["Approved concise theme terms"],
    "tempoCategory": "Mid-tempo",
    "leadVocal": ["Female vocal"],
    "tags": ["Approved searchable tags"],
    "cardTags": ["Maximum four preferred browse-card tags"],
    "roles": ["Artist Pitch", "Publisher / A&R Showcase"],
    "searchTerms": ["Other approved professional retrieval terms"]
  },
  "positioning": {
    "card": "Concise professional positioning",
    "listeningDescription": "Approved professional listening description"
  },
  "professionalDetail": {
    "moodDescription": "Approved professional mood description",
    "lyricalThemeDescription": "Approved lyrical-theme description",
    "vocalPerformance": "Approved vocal/performance profile",
    "performerFit": "Approved artist/performer fit",
    "usageCharacteristics": "Approved sync/use characteristics",
    "adaptability": "Approved adaptability statement",
    "structuralEditability": "Approved editability statement",
    "titleHookIdentity": "Approved title/hook identity"
  },
  "technical": {
    "durationSeconds": 248.976,
    "bpm": 91,
    "key": "G# major",
    "timeSignature": "4/4",
    "language": "English",
    "explicitContent": false,
    "tempoDescriptor": "Mid-tempo",
    "leadVocal": "Female vocal",
    "productionSummary": "Professional-facing production summary",
    "sourceAvailability": "Higher-quality source availability where approved"
  },
  "rights": {
    "writers": [{"name": "Writer", "share": "50%"}],
    "publishingStatus": "Professional-facing publishing status",
    "masterControl": "Professional-facing master control",
    "clearanceStatus": "Professional-facing clearance status",
    "sampleStatus": "Approved sample declaration"
  },
  "provenance": {
    "disclosure": "Approved professional-facing provenance disclosure"
  },
  "considerations": {
    "opening": "Optional professional consideration",
    "dialogue": "Optional professional consideration",
    "assessmentScope": "Optional professional consideration"
  },
  "content": {
    "audioUrl": "Authorised protected or production audio URL",
    "lyricsAvailable": true,
    "lyrics": ["VERSE", "Lyric line"]
  },
  "publication": {
    "status": "APPROVED",
    "profileVersion": "1.0"
  }
}
```

## Presentation transformations

Canonical values may be transformed into familiar professional display values without changing upstream authority.

Example:

- canonical: `durationSeconds = 248.976`
- professional display: `4:09`

The renderer derives `m:ss` from the canonical seconds value. It must never show raw fractional seconds in normal Professional Catalogue UI.

Likewise, machine states such as `authoritative_lyrics_available` should be resolved upstream into website-ready exposure controls such as `lyricsAvailable: true`; the machine-state string is not visitor-facing copy.

## Component exposure hierarchy

A record can contain more approved professional fields than any one surface shows.

### Compact browse card

Designed for rapid comparison and auditioning. Typical visible fields are title, version/recording type, concise positioning, BPM, key, duration, lead-vocal presentation, a small visible tag set, role, audio, shortlist and enquiry/profile actions.

Browse-card reveals are deliberately limited to:

- Details
- Lyrics
- Rights

Only one reveal within the same card opens at a time.

### Full professional song profile

Designed for deeper evaluation. The current structure is:

- Professional Overview — visible by default
- Fit & Performance
- Use & Adaptability
- Technical
- Rights & Clearance
- Production & Provenance
- Considerations — conditional
- Lyrics — conditional

Multiple full-profile sections may remain open simultaneously.

## Search boundary

Search uses only fields present in the website-facing professional record. It may index more approved professional data than the closed card displays, including title, positioning, listening description, professional detail, discovery metadata, tags, roles, BPM/key, rights, provenance and relevant professional considerations.

Internal Opportunity / Brief Readiness intelligence, raw engine states, analytical scores, evidence chains, CRM/contact intelligence and other internal NAVURRA material must not enter this file and therefore cannot enter catalogue search.

## Dynamic filters

Filter values are derived from records actually loaded. Empty speculative categories do not appear.

Current supported dimensions:

- Genre / style
- Mood
- Vocal presentation
- Tempo
- Role
- BPM
- Theme
- Key

The filter vocabulary can evolve from real catalogue use without changing the underlying principle.

## Private shortlist

The shortlist is not part of the feed. It remains browser-local after deliberate user action, with a maximum persistence of 180 days. It is not associated with Cloudflare Access identity, not transmitted automatically and not used for behavioural profiling.

## Audio

Routine production audio should continue to use the authorised Marveltonez audio delivery architecture. The v12.5.0 Superstar prototype stores one temporary approved preview MP3 under `/catalogue/preview-fixtures/` solely so the protected design fixture can be auditioned end to end. That protected fixture path is not the proposed production delivery mechanism and must be replaced by the eventual Professional Export / production-audio arrangement when the prototype is promoted.

## Legacy separation

Do not copy or reinterpret content automatically from `/metadata/songs.json`. Information entering the protected catalogue must come through the current governed catalogue/profile exposure path.
