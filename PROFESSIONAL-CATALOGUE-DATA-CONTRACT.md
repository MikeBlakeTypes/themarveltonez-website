# Marveltonez Professional Catalogue Data Contract v1.0

## Purpose

This data contract is the publication boundary between approved NAVURRA song intelligence and the protected Marveltonez Professional Catalogue.

The governing chain is:

**Approved SIHO + Approved SAO → explicitly approved Professional Catalogue Profile → Professional Secure Access Area**

The website does not render SIHO or SAO objects directly.

## Authoritative website data source

`/metadata/professional-catalogue.json`

The legacy `/metadata/songs.json` file is not an authoritative source for the Professional Secure Access Area.

## Publication gate

A profile is eligible to render only when:

```json
"publication": {
  "status": "APPROVED"
}
```

Any profile with another status, a missing status, or malformed publication data is ignored by the renderer.

Recommended workflow statuses outside the website may include `DRAFT` and `REVIEW`, but they must never be changed to `APPROVED` until the Professional Catalogue Profile itself has received explicit human publication approval.

## Profile structure

All fields are optional unless marked **required**. Optional fields disappear cleanly from the interface when absent.

```json
{
  "id": "MTZ-XXXX-VXX",
  "slug": "stable-professional-song-slug",
  "identity": {
    "title": "Song title",
    "version": "Version label",
    "coWriterException": "Only when the global Marveltonez authorship statement does not fully apply"
  },
  "discovery": {
    "genreStyle": ["Approved genre/style terms"],
    "mood": ["Approved mood terms"],
    "vocalPerformance": ["Approved vocal/performance terms"],
    "lyricalThemes": ["Approved lyrical-theme terms"],
    "tempoCategory": "Approved tempo category",
    "tags": ["Small approved professional tag vocabulary"],
    "searchTerms": ["Approved professional search terms"]
  },
  "professionalPositioning": {
    "cardPositioning": "Concise professional card description",
    "description": "Fuller approved professional description",
    "artistProfileFit": "Approved artist/profile fit",
    "opportunityUse": "Approved opportunity/use characteristics",
    "adaptability": "Approved adaptability statement",
    "structuralEditability": "Approved structural/editability statement"
  },
  "technical": {
    "bpm": 120,
    "key": "A major",
    "metre": "4/4",
    "productionStatus": "Approved professional-facing production/maturity statement"
  },
  "rights": {
    "publishingControl": "Approved publishing/control statement",
    "masterControl": "Approved master/control statement",
    "clearanceStatus": "Approved clearance statement",
    "restrictions": "Approved restrictions, if any"
  },
  "content": {
    "audioUrl": "https://audio.themarveltonez.com/...",
    "lyrics": ["VERSE 1", "First lyric line", "Second lyric line"]
  },
  "publication": {
    "status": "APPROVED",
    "profileVersion": "1.0",
    "approvedDate": "YYYY-MM-DD"
  }
}
```

## Required fields for a catalogue-ready profile

The renderer requires these minimum fields before an approved profile can display usefully:

- `id` — stable Marveltonez catalogue/version identifier;
- `slug` — stable URL-safe professional deep-link identifier;
- `identity.title` — song title;
- `publication.status` — exactly `APPROVED`.

Audio, lyrics, technical information, rights information, discovery metadata and professional positioning are independently optional at renderer level so incomplete fields fail safely. Catalogue governance may impose a stricter human approval threshold before a profile is allowed to receive `APPROVED` status.

## Search boundary

Search indexing is built only from fields explicitly present in the approved Professional Catalogue Profile. It may include:

- title;
- version;
- co-writer exception;
- discovery metadata;
- approved tags and search terms;
- approved professional positioning;
- BPM, key, metre and professional-facing production status;
- approved rights and clearance statements;
- approved lyrics.

Raw SIHO, raw SAO, internal NAVURRA scoring, evidence chains, CRM intelligence and internal analytical notes have no place in this file and therefore cannot enter catalogue search.

## Dynamic filters

Filter choices are derived from the actual approved profiles currently loaded. Empty speculative filter values are not shown.

Initial supported dimensions:

- Genre / style
- Mood
- Vocal / performance
- Tempo
- BPM
- Theme
- Key
- Metre

## Private shortlist

The shortlist is not part of this data contract. It is stored only in the visitor's browser after the visitor deliberately stars a song, with a maximum persistence of 180 days. The site does not send shortlist contents to Marveltonez and does not associate them with the visitor's Cloudflare Access identity. Clearing the shortlist removes the shortlist storage record.

## Legacy separation

Do not copy data automatically from `/metadata/songs.json` into this file. Any information that originated in older website metadata must first be re-established through the current approved SIHO + SAO → Professional Catalogue Profile publication process before it can appear here.
