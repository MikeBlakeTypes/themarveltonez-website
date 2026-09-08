/**
 * Marveltonez Professional Catalogue — v12.4.0
 *
 * IMPORTANT PUBLICATION BOUNDARY:
 * Reads only /metadata/professional-catalogue.json.
 * Profiles render only when publication.status === "APPROVED".
 * Legacy /metadata/songs.json is deliberately not read here.
 * No catalogue interaction analytics are sent by this module.
 */
(() => {
  "use strict";

  const DATA_URL = "/metadata/professional-catalogue.json";
  const SHORTLIST_KEY = "marveltonez-professional-shortlist-v1";
  const SHORTLIST_DAYS = 180;
  const CONTACT_EMAIL = "mikeblake@themarveltonez.com";

  const FILTERS = [
    { key: "genreStyle", label: "Genre / style", getter: (profile) => profile.discovery?.genreStyle },
    { key: "mood", label: "Mood", getter: (profile) => profile.discovery?.mood },
    { key: "vocalPerformance", label: "Vocal / performance", getter: (profile) => profile.discovery?.vocalPerformance },
    { key: "tempoCategory", label: "Tempo", getter: (profile) => profile.discovery?.tempoCategory },
    { key: "bpm", label: "BPM", getter: (profile) => profile.technical?.bpm, format: (value) => `${value} BPM` },
    { key: "lyricalThemes", label: "Theme", getter: (profile) => profile.discovery?.lyricalThemes },
    { key: "key", label: "Key", getter: (profile) => profile.technical?.key },
    { key: "metre", label: "Metre", getter: (profile) => profile.technical?.metre }
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
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
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
      // The feature must fail quietly if browser storage is unavailable.
    }
  }

  function isApprovedProfile(profile) {
    return Boolean(
      profile &&
      profile.id &&
      profile.slug &&
      profile.identity &&
      profile.identity.title &&
      profile.publication &&
      profile.publication.status === "APPROVED"
    );
  }

  async function fetchProfiles() {
    const response = await fetch(DATA_URL, { cache: "no-store", credentials: "same-origin" });
    if (!response.ok) throw new Error(`Catalogue data request failed (${response.status})`);
    const payload = await response.json();
    const profiles = Array.isArray(payload.profiles) ? payload.profiles : [];
    return profiles.filter(isApprovedProfile);
  }

  function profileTitle(profile) {
    return profile.identity?.title || "Untitled";
  }

  function profileSearchText(profile) {
    const discovery = profile.discovery || {};
    const positioning = profile.professionalPositioning || {};
    const technical = profile.technical || {};
    const rights = profile.rights || {};
    const content = profile.content || {};

    const values = [
      profile.id,
      profile.slug,
      profileTitle(profile),
      profile.identity?.version,
      profile.identity?.coWriterException,
      ...asArray(discovery.genreStyle),
      ...asArray(discovery.mood),
      ...asArray(discovery.vocalPerformance),
      ...asArray(discovery.lyricalThemes),
      discovery.tempoCategory,
      ...asArray(discovery.tags),
      ...asArray(discovery.searchTerms),
      positioning.cardPositioning,
      positioning.description,
      positioning.artistProfileFit,
      positioning.opportunityUse,
      positioning.adaptability,
      positioning.structuralEditability,
      technical.bpm,
      technical.key,
      technical.metre,
      technical.productionStatus,
      rights.publishingControl,
      rights.masterControl,
      rights.clearanceStatus,
      rights.restrictions,
      ...asArray(content.lyrics)
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
    const tags = asArray(profile.discovery?.tags);
    return tags.some((tag) => normalise(tag) === normalise(state.tag));
  }

  function profileMatchesShortlist(profile) {
    if (!state.shortlistOnly) return true;
    return state.shortlist.has(String(profile.id));
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

      return `
        <div class="professional-filter-control">
          <label for="professional-filter-${escapeHTML(definition.key)}">${escapeHTML(definition.label)}</label>
          <select id="professional-filter-${escapeHTML(definition.key)}" data-filter-key="${escapeHTML(definition.key)}">
            <option value="">All</option>
            ${options}
          </select>
        </div>`;
    }).join("");

    grid.querySelectorAll("select[data-filter-key]").forEach((select) => {
      select.value = state.filters[select.dataset.filterKey] || "";
      select.addEventListener("change", () => {
        const key = select.dataset.filterKey;
        state.filters[key] = select.value;
        renderAll();
      });
    });
  }

  function renderTagButtons(profile) {
    const tags = asArray(profile.discovery?.tags).slice(0, 3);
    if (!tags.length) return "";
    return `<div class="professional-song-tags" aria-label="Song tags">${tags.map((tag) => {
      const active = normalise(state.tag) === normalise(tag);
      return `<button class="professional-tag" type="button" data-tag="${escapeHTML(tag)}" aria-pressed="${active}">${escapeHTML(tag)}</button>`;
    }).join("")}</div>`;
  }

  function renderProfileField(label, value) {
    const values = asArray(value);
    if (!values.length) return "";
    const content = values.length === 1
      ? `<p>${escapeHTML(values[0])}</p>`
      : `<ul>${values.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
    return `<div class="professional-profile-field"><h4>${escapeHTML(label)}</h4>${content}</div>`;
  }

  function renderDetails(profile) {
    const discovery = profile.discovery || {};
    const positioning = profile.professionalPositioning || {};
    const parts = [
      renderProfileField("Professional positioning", positioning.description),
      renderProfileField("Genre / style", discovery.genreStyle),
      renderProfileField("Mood", discovery.mood),
      renderProfileField("Vocal / performance", discovery.vocalPerformance),
      renderProfileField("Lyrical themes", discovery.lyricalThemes),
      renderProfileField("Artist / profile fit", positioning.artistProfileFit),
      renderProfileField("Opportunity / use", positioning.opportunityUse),
      renderProfileField("Adaptability", positioning.adaptability),
      renderProfileField("Structural editability", positioning.structuralEditability)
    ].filter(Boolean);
    if (!parts.length) return "";
    return `<details class="professional-reveal"><summary>Details</summary><div class="professional-reveal-body">${parts.join("")}</div></details>`;
  }

  function renderLyrics(profile) {
    const lyrics = asArray(profile.content?.lyrics);
    if (!lyrics.length) return "";

    const lines = lyrics.map((line) => {
      const text = String(line);
      const trimmed = text.trim();
      if (!trimmed) return '<div aria-hidden="true" style="height:8px"></div>';
      if (trimmed === trimmed.toUpperCase() && trimmed.length <= 50) {
        return `<h5 class="professional-lyrics-section">${escapeHTML(text)}</h5>`;
      }
      return `<p class="professional-lyrics-line">${escapeHTML(text)}</p>`;
    }).join("");

    return `<details class="professional-reveal"><summary>Lyrics</summary><div class="professional-reveal-body professional-lyrics-text">${lines}</div></details>`;
  }

  function renderTechnical(profile) {
    const technical = profile.technical || {};
    const parts = [
      renderProfileField("BPM", technical.bpm ? `${technical.bpm} BPM` : ""),
      renderProfileField("Key", technical.key),
      renderProfileField("Metre", technical.metre),
      renderProfileField("Version", profile.identity?.version),
      renderProfileField("Production / maturity", technical.productionStatus)
    ].filter(Boolean);
    if (!parts.length) return "";
    return `<details class="professional-reveal"><summary>Technical</summary><div class="professional-reveal-body">${parts.join("")}</div></details>`;
  }

  function renderRights(profile) {
    const rights = profile.rights || {};
    const parts = [
      renderProfileField("Co-writer exception", profile.identity?.coWriterException),
      renderProfileField("Publishing / control", rights.publishingControl),
      renderProfileField("Master / control", rights.masterControl),
      renderProfileField("Clearance", rights.clearanceStatus),
      renderProfileField("Restrictions", rights.restrictions)
    ].filter(Boolean);
    if (!parts.length) return "";
    return `<details class="professional-reveal"><summary>Rights &amp; Clearance</summary><div class="professional-reveal-body">${parts.join("")}</div></details>`;
  }

  function renderAudio(profile) {
    const audioUrl = profile.content?.audioUrl;
    if (!audioUrl) return '<div class="professional-song-no-audio">Audio not currently included in this approved profile.</div>';
    const title = profileTitle(profile);

    return `
      <div class="professional-audio-transport" data-custom-audio-player>
        <button class="professional-restart-button" type="button" aria-label="Restart ${escapeHTML(title)}" title="Restart">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
            <path class="professional-restart-line" d="M6 5v14"></path>
            <path class="professional-restart-triangle" d="M18 6.5 9.5 12 18 17.5Z"></path>
          </svg>
        </button>
        <div class="professional-custom-player" role="group" aria-label="Audio player for ${escapeHTML(title)}">
          <button class="professional-player-button professional-play-toggle" type="button" aria-label="Play ${escapeHTML(title)}" title="Play">
            <svg class="professional-player-play-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M8 5.5 18 12 8 18.5Z"></path></svg>
            <svg class="professional-player-pause-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"></path></svg>
          </button>
          <span class="professional-player-time professional-player-current" aria-hidden="true">0:00</span>
          <input class="professional-player-seek" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek through ${escapeHTML(title)}"/>
          <span class="professional-player-time professional-player-duration" aria-hidden="true">0:00</span>
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
    const body = encodeURIComponent(
      `Hi Mike and Mike,\n\nI am getting in touch about “${title}” from the Marveltonez Professional Catalogue.\n\nMy enquiry is:\n\nBest regards,`
    );
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  function renderCard(profile, singleSong = false) {
    const id = String(profile.id);
    const title = profileTitle(profile);
    const shortlisted = state.shortlist.has(id);
    const positioning = profile.professionalPositioning?.cardPositioning || "";
    const version = profile.identity?.version || "";
    const deepLink = `/catalogue/song/${encodeURIComponent(profile.slug)}/`;

    return `
      <article class="professional-song-card" data-profile-id="${escapeHTML(id)}" data-profile-slug="${escapeHTML(profile.slug)}">
        <div class="professional-song-card-head">
          <div>
            <h3><a class="professional-song-title-link" href="${escapeHTML(deepLink)}">${escapeHTML(title)}</a></h3>
            ${version ? `<p class="professional-song-version">${escapeHTML(version)}</p>` : ""}
          </div>
          <button class="professional-shortlist-button" type="button" data-shortlist-id="${escapeHTML(id)}" aria-pressed="${shortlisted}">
            <span class="professional-star" aria-hidden="true">${shortlisted ? "★" : "☆"}</span>
            <span>${shortlisted ? "Shortlisted" : "Shortlist"}</span>
          </button>
        </div>
        ${positioning ? `<p class="professional-song-positioning">${escapeHTML(positioning)}</p>` : '<p class="professional-song-positioning">Professional profile available.</p>'}
        ${renderTagButtons(profile)}
        ${renderAudio(profile)}
        <div class="professional-song-actions">
          ${renderDetails(profile)}
          ${renderLyrics(profile)}
          ${renderTechnical(profile)}
          ${renderRights(profile)}
        </div>
        <div class="professional-song-footer-actions">
          <a class="professional-enquiry-link" href="${escapeHTML(enquiryHref(profile))}">Enquire about this song →</a>
          ${singleSong ? "" : `<a class="professional-deep-link" href="${escapeHTML(deepLink)}">Open song</a>`}
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
    const title = profileTitle(state.profiles.find((profile) => String(profile.id) === String(audio.dataset.songId)) || {});

    if (playButton) {
      const isPlaying = !audio.paused && !audio.ended;
      playButton.classList.toggle("is-playing", isPlaying);
      playButton.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} ${title}`);
      playButton.title = isPlaying ? "Pause" : "Play";
    }

    if (seek) {
      seek.value = total > 0 ? String(Math.round((audio.currentTime / total) * 1000)) : "0";
      seek.setAttribute("aria-valuetext", `${formatPlayerTime(audio.currentTime)} of ${formatPlayerTime(total)}`);
    }
    if (current) current.textContent = formatPlayerTime(audio.currentTime);
    if (duration) duration.textContent = formatPlayerTime(total);
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
      audio.addEventListener("ratechange", () => {
        if (audio.playbackRate !== 1) audio.playbackRate = 1;
      });

      playButton?.addEventListener("click", async () => {
        if (audio.paused || audio.ended) {
          try {
            await audio.play();
          } catch (error) {
            // Browser playback restrictions should not break the catalogue.
          }
        } else {
          audio.pause();
        }
      });

      seek?.addEventListener("input", () => {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
        audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
        updatePlayer(audio);
      });

      muteButton?.addEventListener("click", () => {
        audio.muted = !audio.muted;
        updatePlayer(audio);
      });

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

  function bindRenderedCardActions(root) {
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
        renderAll();
      });
    });

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

    container.innerHTML = items.map((item) => `
      <button class="professional-active-filter" type="button" data-remove-type="${escapeHTML(item.type)}" data-remove-key="${escapeHTML(item.key)}">
        ${escapeHTML(item.label)} <span aria-hidden="true">×</span>
      </button>`).join("");

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
      const titleElement = root.querySelector("[data-single-song-title]");
      if (profile) {
        if (titleElement) titleElement.textContent = profileTitle(profile);
        document.title = `${profileTitle(profile)} | Professional Catalogue | The Marveltonez`;
        grid.innerHTML = renderCard(profile, true);
        grid.hidden = false;
        if (empty) empty.hidden = true;
        bindRenderedCardActions(grid);
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
      if (count) count.textContent = "No approved Professional Catalogue Profiles are published yet.";
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
    if (count) count.textContent = `${visible.length} of ${state.profiles.length} approved ${state.profiles.length === 1 ? "song" : "songs"} shown.`;

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
    grid.innerHTML = visible.map((profile) => renderCard(profile, false)).join("");
    bindRenderedCardActions(grid);
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

    search?.addEventListener("input", () => {
      state.search = search.value;
      renderAll();
    });

    shortlistToggle?.addEventListener("click", () => {
      state.shortlistOnly = !state.shortlistOnly;
      renderAll();
    });

    root.querySelectorAll("[data-clear-all], [data-empty-clear]").forEach((button) => {
      button.addEventListener("click", clearControls);
    });

    try {
      state.profiles = await fetchProfiles();
      const approvedIds = new Set(state.profiles.map((profile) => String(profile.id)));
      state.shortlist = new Set(Array.from(state.shortlist).filter((id) => approvedIds.has(String(id))));
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
