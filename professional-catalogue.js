/**
 * Marveltonez Professional Catalogue — v12.6.0
 *
 * PUBLICATION / PREVIEW BOUNDARY
 * - Reads only /catalogue/data/professional-catalogue.json, inside the Cloudflare Access-protected /catalogue/* surface.
 * - Production profiles render only when publication.status === "APPROVED".
 * - A protected design fixture may render only when the page explicitly opts in
 *   with data-allow-design-fixtures="true" AND preview.status === "DESIGN_PREVIEW"
 *   AND preview.protectedOnly === true.
 * - Legacy /metadata/songs.json is deliberately not read here.
 * - No catalogue interaction analytics are sent by this module.
 */
(() => {
  "use strict";

  const DATA_URL = "/catalogue/data/professional-catalogue.json";
  const SHORTLIST_KEY = "marveltonez-professional-shortlist-v1";
  const SHORTLIST_DAYS = 180;
  const CONTACT_EMAIL = "mikeblake@themarveltonez.com";

  const FILTERS = [
    { key: "genreStyle", label: "Genre / style", getter: (profile) => profile.discovery?.genreStyle },
    { key: "mood", label: "Mood", getter: (profile) => profile.discovery?.mood },
    { key: "leadVocal", label: "Vocal presentation", getter: (profile) => profile.discovery?.leadVocal },
    { key: "tempoCategory", label: "Tempo", getter: (profile) => profile.discovery?.tempoCategory },
    { key: "role", label: "Role", getter: (profile) => profile.discovery?.roles },
    { key: "bpm", label: "BPM", getter: (profile) => profile.technical?.bpm, format: (value) => `${value} BPM` },
    { key: "lyricalThemes", label: "Theme", getter: (profile) => profile.discovery?.lyricalThemes },
    { key: "key", label: "Key", getter: (profile) => profile.technical?.key }
  ];

  const state = {
    profiles: [],
    search: "",
    filters: {},
    tag: "",
    shortlistOnly: false,
    shortlist: loadShortlist()
  };

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[character]);
  }

  function asArray(value) {
    if (Array.isArray(value)) return value.filter((item) => item !== null && item !== undefined && String(item).trim() !== "");
    if (value === null || value === undefined || String(value).trim() === "") return [];
    return [value];
  }

  function normalise(value) {
    return String(value ?? "").trim().toLocaleLowerCase("en");
  }

  function loadShortlist() {
    try {
      const stored = JSON.parse(localStorage.getItem(SHORTLIST_KEY) || "null");
      if (!stored || !Array.isArray(stored.ids) || !Number.isFinite(stored.expiresAt)) return new Set();
      if (Date.now() >= stored.expiresAt) {
        localStorage.removeItem(SHORTLIST_KEY);
        return new Set();
      }
      return new Set(stored.ids.map(String));
    } catch (error) {
      return new Set();
    }
  }

  function saveShortlist() {
    try {
      if (!state.shortlist.size) {
        localStorage.removeItem(SHORTLIST_KEY);
        return;
      }
      localStorage.setItem(SHORTLIST_KEY, JSON.stringify({
        ids: Array.from(state.shortlist),
        expiresAt: Date.now() + SHORTLIST_DAYS * 24 * 60 * 60 * 1000
      }));
    } catch (error) {
      // Feature must fail quietly when browser storage is unavailable.
    }
  }

  function productionApproved(profile) {
    return Boolean(profile?.publication?.status === "APPROVED");
  }

  function protectedDesignFixture(profile, root) {
    return Boolean(
      root?.dataset.allowDesignFixtures === "true" &&
      profile?.preview?.status === "DESIGN_PREVIEW" &&
      profile?.preview?.protectedOnly === true
    );
  }

  function isRenderableProfile(profile, root) {
    const minimumIdentity = Boolean(profile?.id && profile?.slug && profile?.identity?.title);
    return minimumIdentity && (productionApproved(profile) || protectedDesignFixture(profile, root));
  }

  async function fetchProfiles(root) {
    const response = await fetch(DATA_URL, { cache: "no-store", credentials: "same-origin" });
    if (!response.ok) throw new Error(`Catalogue data request failed (${response.status})`);
    const payload = await response.json();
    const profiles = Array.isArray(payload.profiles) ? payload.profiles : [];
    return profiles.filter((profile) => isRenderableProfile(profile, root));
  }

  function profileTitle(profile) {
    return profile.identity?.title || "Untitled";
  }

  function versionLine(profile) {
    return [profile.identity?.version, profile.identity?.recordingType].filter(Boolean).join(" · ");
  }

  function formatDisplayDuration(seconds) {
    const numeric = Number(seconds);
    if (!Number.isFinite(numeric) || numeric < 0) return "";
    const rounded = Math.round(numeric);
    const minutes = Math.floor(rounded / 60);
    const remainder = rounded % 60;
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
  }

  function primaryFacts(profile, includeMetre = false) {
    const technical = profile.technical || {};
    const items = [];
    if (technical.bpm) items.push(`${technical.bpm} BPM`);
    if (technical.key) items.push(technical.key);
    if (includeMetre && technical.timeSignature) items.push(technical.timeSignature);
    const duration = formatDisplayDuration(technical.durationSeconds);
    if (duration) items.push(duration);
    if (technical.leadVocal) items.push(technical.leadVocal);
    return items;
  }

  function profileSearchText(profile) {
    const discovery = profile.discovery || {};
    const positioning = profile.positioning || {};
    const detail = profile.professionalDetail || {};
    const technical = profile.technical || {};
    const rights = profile.rights || {};
    const provenance = profile.provenance || {};
    const considerations = profile.considerations || {};
    const values = [
      profile.id,
      profile.slug,
      profileTitle(profile),
      profile.identity?.compositionId,
      profile.identity?.recordingId,
      profile.identity?.version,
      profile.identity?.recordingType,
      ...asArray(discovery.genreStyle),
      ...asArray(discovery.mood),
      ...asArray(discovery.leadVocal),
      ...asArray(discovery.lyricalThemes),
      discovery.tempoCategory,
      ...asArray(discovery.tags),
      ...asArray(discovery.searchTerms),
      ...asArray(discovery.roles),
      positioning.card,
      positioning.listeningDescription,
      detail.moodDescription,
      detail.lyricalThemeDescription,
      detail.vocalPerformance,
      detail.performerFit,
      detail.usageCharacteristics,
      detail.adaptability,
      detail.structuralEditability,
      detail.titleHookIdentity,
      technical.bpm,
      technical.key,
      technical.timeSignature,
      technical.language,
      technical.tempoDescriptor,
      technical.leadVocal,
      technical.productionSummary,
      rights.publishingStatus,
      rights.masterControl,
      rights.clearanceStatus,
      rights.sampleStatus,
      provenance.disclosure,
      considerations.opening,
      considerations.dialogue,
      considerations.assessmentScope,
      considerations.evidenceScope,
      considerations.knownLimitations,
      considerations.intendedRemediation
    ];
    return normalise(values.filter(Boolean).join(" "));
  }

  function profileMatchesSearch(profile) {
    const query = normalise(state.search);
    if (!query) return true;
    const haystack = profileSearchText(profile);
    return query.split(/\s+/).filter(Boolean).every((term) => haystack.includes(term));
  }

  function profileMatchesFilters(profile) {
    return FILTERS.every((definition) => {
      const selected = state.filters[definition.key];
      if (!selected) return true;
      return asArray(definition.getter(profile)).some((value) => normalise(value) === normalise(selected));
    });
  }

  function profileMatchesTag(profile) {
    if (!state.tag) return true;
    return asArray(profile.discovery?.tags).some((tag) => normalise(tag) === normalise(state.tag));
  }

  function profileMatchesShortlist(profile) {
    return !state.shortlistOnly || state.shortlist.has(String(profile.id));
  }

  function filteredProfiles() {
    return state.profiles.filter((profile) =>
      profileMatchesSearch(profile) &&
      profileMatchesFilters(profile) &&
      profileMatchesTag(profile) &&
      profileMatchesShortlist(profile)
    );
  }

  function uniqueValues(getter) {
    const values = state.profiles.flatMap((profile) => asArray(getter(profile)));
    const map = new Map();
    values.forEach((value) => {
      const label = String(value).trim();
      if (!label) return;
      const key = normalise(label);
      if (!map.has(key)) map.set(key, value);
    });
    return Array.from(map.values()).sort((a, b) => {
      const aNumber = Number(a);
      const bNumber = Number(b);
      if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) return aNumber - bNumber;
      return String(a).localeCompare(String(b), "en", { sensitivity: "base" });
    });
  }

  function renderFilterControls(grid) {
    if (!grid) return;
    grid.innerHTML = FILTERS.map((definition) => {
      const values = uniqueValues(definition.getter);
      if (!values.length) return "";
      const options = values.map((value) => {
        const raw = String(value);
        const label = definition.format ? definition.format(value) : raw;
        return `<option value="${escapeHTML(raw)}">${escapeHTML(label)}</option>`;
      }).join("");
      return `<div class="professional-filter-control">
        <label for="professional-filter-${escapeHTML(definition.key)}">${escapeHTML(definition.label)}</label>
        <select id="professional-filter-${escapeHTML(definition.key)}" data-filter-key="${escapeHTML(definition.key)}">
          <option value="">All</option>${options}
        </select>
      </div>`;
    }).join("");

    grid.querySelectorAll("select[data-filter-key]").forEach((select) => {
      select.value = state.filters[select.dataset.filterKey] || "";
      select.addEventListener("change", () => {
        state.filters[select.dataset.filterKey] = select.value;
        renderAll();
      });
    });
  }

  function renderTagButtons(profile, { all = false } = {}) {
    const source = all ? asArray(profile.discovery?.tags) : asArray(profile.discovery?.cardTags || profile.discovery?.tags).slice(0, 4);
    if (!source.length) return "";
    return `<div class="professional-song-tags" aria-label="Song tags">${source.map((tag) => {
      const active = normalise(state.tag) === normalise(tag);
      return `<button class="professional-tag" type="button" data-tag="${escapeHTML(tag)}" aria-pressed="${active}">${escapeHTML(tag)}</button>`;
    }).join("")}</div>`;
  }

  function renderRoles(profile) {
    const roles = asArray(profile.discovery?.roles);
    if (!roles.length) return "";
    return `<p class="professional-song-role">${roles.map(escapeHTML).join(" · ")}</p>`;
  }

  function renderField(label, value, className = "") {
    const values = asArray(value);
    if (!values.length) return "";
    const body = values.length === 1
      ? `<p>${escapeHTML(values[0])}</p>`
      : `<ul>${values.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
    return `<div class="professional-profile-field ${escapeHTML(className)}"><h4>${escapeHTML(label)}</h4>${body}</div>`;
  }

  function renderCardDetails(profile) {
    const detail = profile.professionalDetail || {};
    const listening = profile.positioning?.listeningDescription || "";
    const parts = [
      listening ? `<p class="professional-listening-description">${escapeHTML(listening)}</p>` : "",
      renderField("Mood", detail.moodDescription),
      renderField("Theme", detail.lyricalThemeDescription),
      renderField("Performer fit", detail.performerFit),
      renderField("Use characteristics", detail.usageCharacteristics),
      renderField("Adaptability", detail.adaptability),
      renderField("Edit potential", detail.structuralEditability)
    ].filter(Boolean);
    return parts.join("");
  }

  function renderLyricsLines(profile, fullProfile = false) {
    const lyrics = asArray(profile.content?.lyrics);
    if (!profile.content?.lyricsAvailable || !lyrics.length) return "";
    return lyrics.map((line) => {
      const text = String(line);
      const trimmed = text.trim();
      if (!trimmed) return '<div class="professional-lyrics-gap" aria-hidden="true"></div>';
      if (trimmed === trimmed.toUpperCase() && trimmed.length <= 50) {
        return `<h5 class="professional-lyrics-section">${escapeHTML(text)}</h5>`;
      }
      return `<p class="professional-lyrics-line">${escapeHTML(text)}</p>`;
    }).join("");
  }

  function renderCardLyrics(profile) {
    const lines = renderLyricsLines(profile, false);
    if (!lines) return "";
    return `<div class="professional-lyrics-text">${lines}</div>`;
  }

  function writersText(profile) {
    const writers = asArray(profile.rights?.writers);
    return writers.map((writer) => {
      if (typeof writer === "string") return writer;
      return [writer?.name, writer?.share].filter(Boolean).join(" ");
    }).filter(Boolean).join(" · ");
  }

  function renderCardRights(profile) {
    const rights = profile.rights || {};
    const parts = [
      renderField("Writers / ownership", writersText(profile)),
      renderField("Publishing", rights.publishingStatus),
      renderField("Master", rights.masterControl),
      renderField("Clearance", [rights.clearanceStatus, rights.sampleStatus].filter(Boolean).join(" "))
    ].filter(Boolean);
    return parts.join("");
  }

  function renderCardReveals(profile) {
    const entries = [
      { key: "details", label: "Details", body: renderCardDetails(profile) },
      { key: "lyrics", label: "Lyrics", body: renderCardLyrics(profile) },
      { key: "rights", label: "Rights", body: renderCardRights(profile) }
    ].filter((entry) => Boolean(entry.body));
    if (!entries.length) return "";
    const baseId = `professional-card-reveal-${profile.slug}`;
    const buttons = entries.map((entry) => `<button class="professional-reveal-trigger" type="button" data-card-reveal-button="${escapeHTML(entry.key)}" aria-expanded="false" aria-controls="${escapeHTML(baseId)}-${escapeHTML(entry.key)}">${escapeHTML(entry.label)}</button>`).join("");
    const contents = entries.map((entry) => `<div class="professional-card-reveal-content" id="${escapeHTML(baseId)}-${escapeHTML(entry.key)}" data-card-reveal-content="${escapeHTML(entry.key)}" hidden>${entry.body}</div>`).join("");
    return `<div class="professional-song-actions" role="group" aria-label="Song information">${buttons}</div><div class="professional-card-reveal-panel" data-card-reveal-panel hidden>${contents}</div>`;
  }

  function professionalAudioUrl(profile) {
    return profile.content?.audio?.url || profile.content?.audioUrl || "";
  }

  function renderAudio(profile, variant = "card") {
    const audioUrl = professionalAudioUrl(profile);
    if (!audioUrl) return '<div class="professional-song-no-audio">Audio not currently available.</div>';
    const title = profileTitle(profile);
    return `<div class="professional-audio-transport ${variant === "profile" ? "professional-audio-transport-profile" : ""}" data-custom-audio-player>
      <button class="professional-restart-button" type="button" aria-label="Restart ${escapeHTML(title)}" title="Restart">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path class="professional-restart-line" d="M6 5v14"></path><path class="professional-restart-triangle" d="M18 6.5 9.5 12 18 17.5Z"></path></svg>
      </button>
      <div class="professional-custom-player" role="group" aria-label="Audio player for ${escapeHTML(title)}">
        <button class="professional-player-button professional-play-toggle" type="button" aria-label="Play ${escapeHTML(title)}" title="Play">
          <svg class="professional-player-play-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M8 5.5 18 12 8 18.5Z"></path></svg>
          <svg class="professional-player-pause-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"></path></svg>
        </button>
        <span class="professional-player-time professional-player-current" aria-hidden="true">0:00</span>
        <input class="professional-player-seek" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek through ${escapeHTML(title)}"/>
        <span class="professional-player-time professional-player-duration" data-governed-duration="${escapeHTML(formatDisplayDuration(profile.technical?.durationSeconds) || "")}" aria-hidden="true">${escapeHTML(formatDisplayDuration(profile.technical?.durationSeconds) || "0:00")}</span>
        <button class="professional-player-button professional-mute-toggle" type="button" aria-label="Mute ${escapeHTML(title)}" title="Mute">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path class="professional-volume-speaker" d="M4 9h4l5-4v14l-5-4H4z"></path><path class="professional-volume-wave" d="M16 8.5c1.2 1 1.8 2.2 1.8 3.5s-.6 2.5-1.8 3.5"></path></svg>
        </button>
      </div>
      <audio class="professional-audio" preload="metadata" data-song-id="${escapeHTML(profile.id)}">
        <source src="${escapeHTML(audioUrl)}" type="audio/mpeg"/>
        Your browser does not support audio playback.
      </audio>
    </div>`;
  }

  function enquiryHref(profile) {
    const title = profileTitle(profile);
    const subject = encodeURIComponent(`Professional catalogue enquiry — “${title}”`);
    const body = encodeURIComponent(`Hi Mike and Mike,\n\nI am getting in touch about “${title}” from the Marveltonez Professional Catalogue.\n\nMy enquiry is:\n\nBest regards,`);
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  function renderShortlistButton(profile, profileVariant = false) {
    const id = String(profile.id);
    const shortlisted = state.shortlist.has(id);
    return `<button class="professional-shortlist-button ${profileVariant ? "professional-shortlist-button-profile" : ""}" type="button" data-shortlist-id="${escapeHTML(id)}" aria-pressed="${shortlisted}">
      <span class="professional-star" aria-hidden="true">${shortlisted ? "★" : "☆"}</span>
      <span>${shortlisted ? "Shortlisted" : "Shortlist"}</span>
    </button>`;
  }

  function renderCard(profile) {
    const title = profileTitle(profile);
    const positioning = profile.positioning?.card || "";
    const deepLink = `/catalogue/song/${encodeURIComponent(profile.slug)}/`;
    const facts = primaryFacts(profile, false);
    return `<article class="professional-song-card" data-profile-id="${escapeHTML(profile.id)}" data-profile-slug="${escapeHTML(profile.slug)}">
      <div class="professional-song-card-head">
        <div>
          <h3><a class="professional-song-title-link" href="${escapeHTML(deepLink)}">${escapeHTML(title)}</a></h3>
          ${versionLine(profile) ? `<p class="professional-song-version">${escapeHTML(versionLine(profile))}</p>` : ""}
        </div>
        ${renderShortlistButton(profile, false)}
      </div>
      ${positioning ? `<p class="professional-song-positioning">${escapeHTML(positioning)}</p>` : ""}
      ${facts.length ? `<p class="professional-primary-facts">${facts.map(escapeHTML).join(" · ")}</p>` : ""}
      ${renderTagButtons(profile)}
      ${renderRoles(profile)}
      ${renderAudio(profile, "card")}
      ${renderCardReveals(profile)}
      <div class="professional-song-footer-actions">
        <a class="professional-enquiry-link" href="${escapeHTML(enquiryHref(profile))}">Enquire →</a>
        <a class="professional-deep-link" href="${escapeHTML(deepLink)}">Full Profile →</a>
      </div>
    </article>`;
  }

  function renderOverviewTerms(label, values) {
    const items = asArray(values);
    if (!items.length) return "";
    return `<div class="professional-overview-term"><h3>${escapeHTML(label)}</h3><p>${items.map(escapeHTML).join(" · ")}</p></div>`;
  }

  function renderExpandableSection(title, body, extraClass = "") {
    if (!body) return "";
    return `<details class="professional-profile-section ${escapeHTML(extraClass)}"><summary aria-expanded="false">${escapeHTML(title)}</summary><div class="professional-profile-section-body">${body}</div></details>`;
  }

  function renderTechnicalTable(profile) {
    const t = profile.technical || {};
    const rows = [
      ["Recording", profile.identity?.recordingType],
      ["Version", profile.identity?.version],
      ["Duration", formatDisplayDuration(t.durationSeconds)],
      ["Tempo", t.bpm ? `${t.bpm} BPM${t.tempoDescriptor ? ` · ${t.tempoDescriptor}` : ""}` : t.tempoDescriptor],
      ["Key", t.key],
      ["Time signature", t.timeSignature],
      ["Lead vocal", t.leadVocal],
      ["Language", t.language],
      ["Explicit content", t.explicitContent === false ? "No" : t.explicitContent === true ? "Yes" : ""]
    ].filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "");
    if (!rows.length) return "";
    return `<dl class="professional-technical-grid">${rows.map(([label, value]) => `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join("")}</dl>
      ${profile.identity?.recordingId ? `<p class="professional-catalogue-reference">Catalogue reference: ${escapeHTML(profile.identity.recordingId)}</p>` : ""}`;
  }

  function renderFullRights(profile) {
    const rights = profile.rights || {};
    return [
      renderField("Writers / ownership", writersText(profile)),
      renderField("Publishing", rights.publishingStatus),
      renderField("Master owner", rights.masterControl),
      renderField("Clearance", rights.clearanceStatus),
      renderField("Samples", rights.sampleStatus)
    ].filter(Boolean).join("");
  }

  function renderProductionAndProvenance(profile) {
    const t = profile.technical || {};
    const p = profile.provenance || {};
    return [
      renderField("Production status", t.productionSummary),
      renderField("Source availability", t.sourceAvailability),
      renderField("Provenance", p.disclosure)
    ].filter(Boolean).join("");
  }

  function renderConsiderations(profile) {
    const c = profile.considerations || {};
    return [
      renderField("Opening", c.opening),
      renderField("Dialogue", c.dialogue),
      renderField("Assessment scope", c.assessmentScope)
    ].filter(Boolean).join("");
  }

  function renderFullProfile(profile) {
    const title = profileTitle(profile);
    const detail = profile.professionalDetail || {};
    const positioning = profile.positioning || {};
    const facts = primaryFacts(profile, true);
    const fitBody = [
      renderField("Current vocal presentation", detail.vocalPerformance),
      renderField("Performer fit", detail.performerFit),
      renderField("Title & hook", detail.titleHookIdentity)
    ].filter(Boolean).join("");
    const adaptabilityBody = [
      renderField("Use characteristics", detail.usageCharacteristics),
      renderField("Adaptability", detail.adaptability),
      renderField("Edit potential", detail.structuralEditability)
    ].filter(Boolean).join("");
    const lyrics = renderLyricsLines(profile, true);
    const considerations = renderConsiderations(profile);

    return `<article class="professional-song-profile" data-profile-id="${escapeHTML(profile.id)}">
      <div class="professional-profile-topline">
        <a class="professional-song-back-link" href="/catalogue/">← Professional Catalogue</a>
        <p class="professional-profile-eyebrow">Professional Song Profile</p>
      </div>
      <header class="professional-profile-header">
        <div class="professional-profile-title-row">
          <div>
            <h1>${escapeHTML(title)}</h1>
            ${versionLine(profile) ? `<p class="professional-song-version professional-profile-version">${escapeHTML(versionLine(profile))}</p>` : ""}
          </div>
          ${renderShortlistButton(profile, true)}
        </div>
        ${positioning.card ? `<p class="professional-profile-positioning">${escapeHTML(positioning.card)}</p>` : ""}
        ${facts.length ? `<p class="professional-primary-facts professional-profile-facts">${facts.map(escapeHTML).join(" · ")}</p>` : ""}
        ${renderTagButtons(profile)}
        ${renderRoles(profile)}
        ${renderAudio(profile, "profile")}
        <div class="professional-profile-actions">
          <a class="btn btn-primary" href="${escapeHTML(enquiryHref(profile))}">Enquire about ${escapeHTML(title)}</a>
          <p class="professional-profile-shortlist-note">Your shortlist is private and stored only in this browser.</p>
        </div>
      </header>

      <section class="professional-profile-overview" aria-labelledby="professional-overview-heading">
        <p class="professional-profile-section-kicker">Professional Overview</p>
        <h2 id="professional-overview-heading">Listen first. Explore when useful.</h2>
        ${positioning.listeningDescription ? `<p class="professional-listening-description professional-listening-description-profile">${escapeHTML(positioning.listeningDescription)}</p>` : ""}
        <div class="professional-overview-terms">
          ${renderOverviewTerms("Mood", profile.discovery?.mood)}
          ${renderOverviewTerms("Theme", profile.discovery?.lyricalThemes)}
        </div>
      </section>

      <div class="professional-profile-sections">
        ${renderExpandableSection("Fit & Performance", fitBody)}
        ${renderExpandableSection("Use & Adaptability", adaptabilityBody)}
        ${renderExpandableSection("Technical", renderTechnicalTable(profile))}
        ${renderExpandableSection("Rights & Clearance", renderFullRights(profile))}
        ${renderExpandableSection("Production & Provenance", renderProductionAndProvenance(profile))}
        ${considerations ? renderExpandableSection("Considerations", considerations) : ""}
        ${lyrics ? renderExpandableSection("Lyrics", `<div class="professional-profile-lyrics">${lyrics}</div>`) : ""}
      </div>
    </article>`;
  }

  function formatPlayerTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
  }

  function updatePlayer(audio) {
    const transport = audio.closest(".professional-audio-transport");
    if (!transport) return;
    const playButton = transport.querySelector(".professional-play-toggle");
    const seek = transport.querySelector(".professional-player-seek");
    const current = transport.querySelector(".professional-player-current");
    const duration = transport.querySelector(".professional-player-duration");
    const muteButton = transport.querySelector(".professional-mute-toggle");
    const total = Number.isFinite(audio.duration) ? audio.duration : 0;
    const profile = state.profiles.find((item) => String(item.id) === String(audio.dataset.songId)) || {};
    const title = profileTitle(profile);
    const governedDuration = duration?.dataset.governedDuration || "";
    const displayedDuration = governedDuration || formatPlayerTime(total);

    if (playButton) {
      const isPlaying = !audio.paused && !audio.ended;
      playButton.classList.toggle("is-playing", isPlaying);
      playButton.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} ${title}`);
      playButton.title = isPlaying ? "Pause" : "Play";
    }
    const atPlaybackEnd = Boolean(governedDuration && total > 0 && (audio.ended || audio.currentTime >= total - 0.25));
    const displayedCurrent = atPlaybackEnd ? governedDuration : formatPlayerTime(audio.currentTime);
    if (seek) {
      seek.value = total > 0 ? String(Math.round((audio.currentTime / total) * 1000)) : "0";
      seek.setAttribute("aria-valuetext", `${displayedCurrent} of ${displayedDuration}`);
    }
    if (current) current.textContent = displayedCurrent;
    if (duration && (total > 0 || governedDuration)) duration.textContent = displayedDuration;
    if (muteButton) {
      muteButton.classList.toggle("is-muted", audio.muted);
      muteButton.setAttribute("aria-label", `${audio.muted ? "Unmute" : "Mute"} ${title}`);
      muteButton.title = audio.muted ? "Unmute" : "Mute";
    }
  }

  function initialisePlayers(root) {
    root.querySelectorAll(".professional-audio").forEach((audio) => {
      const transport = audio.closest(".professional-audio-transport");
      if (!transport) return;
      const playButton = transport.querySelector(".professional-play-toggle");
      const seek = transport.querySelector(".professional-player-seek");
      const muteButton = transport.querySelector(".professional-mute-toggle");
      const restartButton = transport.querySelector(".professional-restart-button");

      audio.defaultPlaybackRate = 1;
      audio.playbackRate = 1;
      audio.addEventListener("ratechange", () => { if (audio.playbackRate !== 1) audio.playbackRate = 1; });
      playButton?.addEventListener("click", async () => {
        if (audio.paused || audio.ended) {
          try { await audio.play(); } catch (error) { /* browser restriction: no-op */ }
        } else audio.pause();
      });
      seek?.addEventListener("input", () => {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
        audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
        updatePlayer(audio);
      });
      muteButton?.addEventListener("click", () => { audio.muted = !audio.muted; updatePlayer(audio); });
      restartButton?.addEventListener("click", () => {
        audio.pause();
        try { audio.currentTime = 0; } catch (error) { /* no-op */ }
        updatePlayer(audio);
      });
      ["loadedmetadata", "durationchange", "timeupdate", "play", "pause", "ended", "volumechange"].forEach((eventName) => {
        audio.addEventListener(eventName, () => updatePlayer(audio));
      });
      audio.addEventListener("play", () => {
        root.querySelectorAll(".professional-audio").forEach((otherAudio) => {
          if (otherAudio !== audio && !otherAudio.paused) otherAudio.pause();
        });
      });
      updatePlayer(audio);
    });
  }

  function bindRevealStates(root) {
    root.querySelectorAll("[data-card-reveal-button]").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".professional-song-card");
        if (!card) return;
        const panel = card.querySelector("[data-card-reveal-panel]");
        if (!panel) return;
        const key = button.dataset.cardRevealButton || "";
        const wasOpen = button.getAttribute("aria-expanded") === "true";
        card.querySelectorAll("[data-card-reveal-button]").forEach((other) => other.setAttribute("aria-expanded", "false"));
        panel.querySelectorAll("[data-card-reveal-content]").forEach((content) => { content.hidden = true; });
        if (wasOpen) {
          panel.hidden = true;
          return;
        }
        const content = panel.querySelector(`[data-card-reveal-content="${CSS.escape(key)}"]`);
        if (!content) {
          panel.hidden = true;
          return;
        }
        button.setAttribute("aria-expanded", "true");
        content.hidden = false;
        panel.hidden = false;
      });
    });
    root.querySelectorAll("details.professional-profile-section").forEach((details) => {
      const summary = details.querySelector(":scope > summary");
      const update = () => summary?.setAttribute("aria-expanded", String(details.open));
      update();
      details.addEventListener("toggle", update);
    });
  }

  function bindRenderedActions(root) {
    root.querySelectorAll("[data-shortlist-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = String(button.dataset.shortlistId);
        if (state.shortlist.has(id)) state.shortlist.delete(id);
        else state.shortlist.add(id);
        saveShortlist();
        renderAll();
      });
    });
    root.querySelectorAll("[data-tag]").forEach((button) => {
      button.addEventListener("click", () => {
        const tag = button.dataset.tag || "";
        state.tag = normalise(state.tag) === normalise(tag) ? "" : tag;
        if (document.querySelector("[data-professional-catalogue]")?.dataset.singleSong === "true") {
          window.location.href = `/catalogue/?tag=${encodeURIComponent(tag)}`;
          return;
        }
        renderAll();
      });
    });
    bindRevealStates(root);
    initialisePlayers(root);
  }

  function renderActiveFilters(root) {
    const container = root.querySelector("[data-active-tags]");
    if (!container) return;
    const items = [];
    if (state.search) items.push({ type: "search", key: "search", label: `Search: ${state.search}` });
    if (state.tag) items.push({ type: "tag", key: "tag", label: `Tag: ${state.tag}` });
    FILTERS.forEach((definition) => {
      if (state.filters[definition.key]) {
        const value = state.filters[definition.key];
        const formatted = definition.format ? definition.format(value) : value;
        items.push({ type: "filter", key: definition.key, label: `${definition.label}: ${formatted}` });
      }
    });
    if (state.shortlistOnly) items.push({ type: "shortlist", key: "shortlist", label: "Shortlist only" });
    container.innerHTML = items.map((item) => `<button class="professional-active-filter" type="button" data-remove-type="${escapeHTML(item.type)}" data-remove-key="${escapeHTML(item.key)}">${escapeHTML(item.label)} <span aria-hidden="true">×</span></button>`).join("");
    container.querySelectorAll("[data-remove-type]").forEach((button) => {
      button.addEventListener("click", () => {
        const type = button.dataset.removeType;
        const key = button.dataset.removeKey;
        if (type === "search") state.search = "";
        if (type === "tag") state.tag = "";
        if (type === "filter") state.filters[key] = "";
        if (type === "shortlist") state.shortlistOnly = false;
        renderAll();
      });
    });
  }

  function currentDeepLinkSlug() {
    const match = window.location.pathname.match(/^\/catalogue\/song\/([^/]+)\/?$/i);
    if (!match) return "";
    try { return decodeURIComponent(match[1]); } catch (error) { return match[1]; }
  }

  function hydrateQueryState() {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get("tag");
    if (tag) state.tag = tag;
  }

  function renderAll() {
    const root = document.querySelector("[data-professional-catalogue]");
    if (!root) return;
    const grid = root.querySelector("[data-catalogue-grid]");
    const empty = root.querySelector("[data-catalogue-empty]");
    const pending = root.querySelector("[data-catalogue-pending]");
    const toolbar = root.querySelector("[data-catalogue-toolbar]");
    const filterPanel = root.querySelector("[data-filter-panel]");
    const filterGrid = root.querySelector("[data-filter-grid]");
    const count = root.querySelector("[data-catalogue-count]");
    const shortlistToggle = root.querySelector("[data-shortlist-toggle]");
    const shortlistCount = root.querySelector("[data-shortlist-count]");
    const shortlistNote = root.querySelector("[data-shortlist-note]");
    const clearAll = root.querySelector("[data-clear-all]");
    const search = root.querySelector("[data-catalogue-search]");
    const activeFilterCount = root.querySelector("[data-active-filter-count]");
    const singleSong = root.dataset.singleSong === "true";
    if (!grid) return;

    if (singleSong) {
      const slug = currentDeepLinkSlug();
      const profile = state.profiles.find((item) => item.slug === slug);
      if (profile) {
        document.title = `${profileTitle(profile)} | Professional Catalogue | The Marveltonez`;
        grid.innerHTML = renderFullProfile(profile);
        grid.hidden = false;
        if (empty) empty.hidden = true;
        bindRenderedActions(grid);
      } else {
        grid.innerHTML = "";
        grid.hidden = true;
        if (empty) empty.hidden = false;
      }
      return;
    }

    const hasProfiles = state.profiles.length > 0;
    if (toolbar) toolbar.hidden = !hasProfiles;
    if (filterPanel) filterPanel.hidden = !hasProfiles;
    if (pending) pending.hidden = hasProfiles;
    if (shortlistNote) shortlistNote.hidden = !hasProfiles;
    if (!hasProfiles) {
      grid.innerHTML = "";
      grid.hidden = true;
      if (empty) empty.hidden = true;
      if (count) count.textContent = "No Professional Catalogue Profiles are currently available.";
      return;
    }

    if (search && search.value !== state.search) search.value = state.search;
    if (shortlistToggle) shortlistToggle.setAttribute("aria-pressed", String(state.shortlistOnly));
    if (shortlistCount) shortlistCount.textContent = String(state.shortlist.size);
    renderFilterControls(filterGrid);
    renderActiveFilters(root);
    const activeCount = Object.values(state.filters).filter(Boolean).length + (state.tag ? 1 : 0);
    if (activeFilterCount) activeFilterCount.textContent = activeCount ? `(${activeCount} active)` : "";

    const visible = filteredProfiles();
    if (count) count.textContent = `${visible.length} of ${state.profiles.length} ${state.profiles.length === 1 ? "song" : "songs"} shown.`;
    const hasConstraints = Boolean(state.search || state.tag || state.shortlistOnly || Object.values(state.filters).some(Boolean));
    if (clearAll) clearAll.hidden = !hasConstraints;
    if (!visible.length) {
      grid.innerHTML = "";
      grid.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    grid.hidden = false;
    grid.innerHTML = visible.map(renderCard).join("");
    bindRenderedActions(grid);
  }

  function clearControls() {
    state.search = "";
    state.filters = {};
    state.tag = "";
    state.shortlistOnly = false;
    renderAll();
  }

  async function initialise() {
    const root = document.querySelector("[data-professional-catalogue]");
    if (!root) return;
    const unavailable = root.querySelector("[data-catalogue-unavailable]");
    const search = root.querySelector("[data-catalogue-search]");
    const shortlistToggle = root.querySelector("[data-shortlist-toggle]");
    hydrateQueryState();

    search?.addEventListener("input", () => { state.search = search.value; renderAll(); });
    shortlistToggle?.addEventListener("click", () => { state.shortlistOnly = !state.shortlistOnly; renderAll(); });
    root.querySelectorAll("[data-clear-all], [data-empty-clear]").forEach((button) => button.addEventListener("click", clearControls));

    try {
      state.profiles = await fetchProfiles(root);
      const renderableIds = new Set(state.profiles.map((profile) => String(profile.id)));
      state.shortlist = new Set(Array.from(state.shortlist).filter((id) => renderableIds.has(String(id))));
      saveShortlist();
      if (unavailable) unavailable.hidden = true;
      renderAll();
    } catch (error) {
      console.error("Professional Catalogue unavailable", error);
      const pending = root.querySelector("[data-catalogue-pending]");
      const grid = root.querySelector("[data-catalogue-grid]");
      const toolbar = root.querySelector("[data-catalogue-toolbar]");
      const filterPanel = root.querySelector("[data-filter-panel]");
      if (pending) pending.hidden = true;
      if (grid) grid.hidden = true;
      if (toolbar) toolbar.hidden = true;
      if (filterPanel) filterPanel.hidden = true;
      if (unavailable) unavailable.hidden = false;
    }
  }

  document.addEventListener("DOMContentLoaded", initialise);
})();
