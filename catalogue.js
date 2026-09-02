/**
 * Marveltonez Catalogue Module v2.0 — Website v12.0
 * Reads metadata/songs.json and creates reusable, expandable song cards.
 */
(() => {
  "use strict";

  const DEFAULT_JSON_SOURCES = [
    "/metadata/songs.json"
  ];


  const playedSongsThisPageSession = new Set();
  const countedCurrentStarts = new WeakMap();

  let artworkViewer = null;
  let artworkViewerTrigger = null;
  let artworkViewerTransport = null;
  let artworkViewerPlaceholder = null;
  let artworkViewerScrollPosition = 0;
  let artworkViewerClosing = false;
  let artworkViewerBackgroundState = [];
  let artworkViewerBodyStyleState = null;

  function recordSongAction(slug, eventType) {
    const body = JSON.stringify({ slug, eventType });

    try {
      if (navigator.sendBeacon) {
        const queued = navigator.sendBeacon(
          "/analytics/song",
          new Blob([body], { type: "text/plain;charset=UTF-8" })
        );
        if (queued) return;
      }

      fetch("/analytics/song", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body,
        keepalive: true,
        credentials: "same-origin",
        cache: "no-store"
      }).catch(() => {
        // Analytics must never interrupt or report errors to the visitor.
      });
    } catch (error) {
      // Analytics must never interrupt or report errors to the visitor.
    }
  }

  function recordDeliberateSongStart(audio) {
    if (countedCurrentStarts.get(audio) === true) return;

    const card = audio.closest(".catalogue-song-card");
    const slug = audio.dataset.songId || (card && card.dataset.songId);
    if (!slug) return;

    const eventType = playedSongsThisPageSession.has(slug) ? "replay" : "play";
    playedSongsThisPageSession.add(slug);
    countedCurrentStarts.set(audio, true);
    recordSongAction(slug, eventType);
  }

  const escapeHTML = (value = "") =>
    String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);

  function compactMood(mood = "") {
    return String(mood)
      .split("•")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 3)
      .join(" · ");
  }

  function renderMetadata(song) {
    const details = [
      song.genre,
      compactMood(song.mood),
      song.vocal,
      song.bpm ? `${song.bpm} BPM` : "",
      song.key
    ].filter(Boolean);

    return details.length
      ? `<p class="catalogue-song-meta">${details.map(escapeHTML).join(" · ")}</p>`
      : "";
  }

  function renderProfileField(label, value) {
    if (!value) return "";
    return `
      <div class="catalogue-profile-field">
        <h4>${escapeHTML(label)}</h4>
        <p>${escapeHTML(value)}</p>
      </div>`;
  }

  function renderProfile(song) {
    const profile = song.profile || {};
    const hasProfile = Object.values(profile).some(Boolean);
    if (!hasProfile) return "";

    return `
      <details class="catalogue-profile">
        <summary><span class="catalogue-profile-label">View song profile</span><span class="catalogue-profile-symbol" aria-hidden="true">+</span></summary>
        <div class="catalogue-profile-body">
          ${renderProfileField("Overview", profile.overview)}
          ${renderProfileField("Themes", profile.themes)}
          ${renderProfileField("Musical style", profile.musicalStyle)}
          ${renderProfileField("For listeners who enjoy", profile.artistComparisons)}
          ${renderProfileField("Perfect for", profile.perfectFor)}
          ${renderProfileField("Sync potential", profile.syncPotential)}
          <button class="catalogue-profile-close" type="button">Close song profile ↑</button>
        </div>
      </details>`;
  }

  function renderSupplementaryBadges(song) {
    const badges = [];

    if (song.explicit === true) {
      badges.push(
        '<span class="catalogue-song-flag catalogue-song-flag-explicit">Explicit</span>'
      );
    }

    return badges.join("");
  }

  function renderLyricParagraph(paragraph) {
    const text = String(paragraph);
    const trimmed = text.trim();

    if (!trimmed) {
      return '<div class="catalogue-lyrics-spacer" aria-hidden="true"></div>';
    }

    if (trimmed === trimmed.toUpperCase() && trimmed.length <= 40) {
      return `<h5 class="catalogue-lyrics-section">${escapeHTML(text)}</h5>`;
    }

    const isCopyright =
      trimmed.startsWith("© ") || trimmed === "A Marveltonez composition";

    return `<p class="catalogue-lyrics-line${isCopyright ? " catalogue-lyrics-copyright" : ""}">${escapeHTML(text)}</p>`;
  }

  function renderLyricsPanel(song) {
    const paragraphs = song.lyrics && Array.isArray(song.lyrics.paragraphs)
      ? song.lyrics.paragraphs
      : [];

    if (!paragraphs.length) return "";

    const panelId = `lyrics-${song.id}`;
    const titleId = `${panelId}-title`;

    return `
      <section class="catalogue-lyrics-panel" id="${escapeHTML(panelId)}" aria-labelledby="${escapeHTML(titleId)}" hidden>
        <div class="catalogue-lyrics-body">
          <h4 id="${escapeHTML(titleId)}">${escapeHTML(song.title)} — Lyrics</h4>
          ${paragraphs.map(renderLyricParagraph).join("")}
          <button class="catalogue-lyrics-close" type="button">Close Lyrics ↑</button>
        </div>
      </section>`;
  }

  function setProfileButtonState(details) {
    if (!details) return;

    const label = details.querySelector(".catalogue-profile-label");
    const symbol = details.querySelector(".catalogue-profile-symbol");
    const isOpen = details.open === true;

    if (label) label.textContent = isOpen ? "Close song profile" : "View song profile";
    if (symbol) symbol.textContent = isOpen ? "−" : "+";
  }

  function setLyricsButtonState(button, isOpen) {
    if (!button) return;

    button.setAttribute("aria-expanded", String(isOpen));

    const label = button.querySelector(".catalogue-action-label");
    const symbol = button.querySelector(".catalogue-action-symbol");

    if (label) label.textContent = isOpen ? "Close Lyrics" : "View Lyrics";
    if (symbol) symbol.textContent = isOpen ? "−" : "+";
  }

  function renderArtwork(song) {
    if (!song.artwork) return "";

    const thumbnail = song.artworkThumbnail || song.artwork;
    const thumbnailLarge = song.artworkThumbnailLarge || song.artwork;
    const title = String(song.title || "this song");
    const flipHorizontal = ["just-sayin", "i-didnt-mean-to-turn-out-bad"].includes(song.id);

    return `
      <button
        class="catalogue-song-artwork-button"
        type="button"
        aria-label="Open artwork and player for ${escapeHTML(title)}"
        aria-haspopup="dialog"
        aria-controls="catalogue-artwork-viewer"
        aria-expanded="false"
        data-artwork-full="${escapeHTML(song.artwork)}"
        data-song-title="${escapeHTML(title)}"
        data-artwork-flip="${flipHorizontal ? "horizontal" : "none"}"
      >
        <img
          class="catalogue-song-artwork-image${flipHorizontal ? " catalogue-song-artwork-image--flipped" : ""}"
          src="${escapeHTML(thumbnail)}"
          srcset="${escapeHTML(thumbnail)} 400w, ${escapeHTML(thumbnailLarge)} 800w"
          sizes="(max-width: 700px) 42vw, (max-width: 1080px) 30vw, 18vw"
          width="600"
          height="400"
          loading="lazy"
          decoding="async"
          alt="Artwork for ${escapeHTML(title)}"
        >
      </button>`;
  }

  function renderActions(song) {
    const hasLyrics =
      song.lyrics &&
      Array.isArray(song.lyrics.paragraphs) &&
      song.lyrics.paragraphs.length > 0;
    const panelId = `lyrics-${song.id}`;

    const lyricsAction = hasLyrics
      ? `<button class="catalogue-action catalogue-lyrics-toggle" type="button" aria-controls="${escapeHTML(panelId)}" aria-expanded="false"><span class="catalogue-action-label">View Lyrics</span><span class="catalogue-action-symbol" aria-hidden="true">+</span></button>`
      : `<span class="catalogue-action catalogue-action-disabled" aria-disabled="true"><span class="catalogue-action-label">Lyrics soon</span></span>`;

    return `
      <div class="catalogue-song-actions">
        ${lyricsAction}
        <a class="catalogue-action catalogue-action-enquire" href="/track/song-enquiry/${encodeURIComponent(song.id)}">Enquire about this song</a>
        <button class="catalogue-action catalogue-action-share" type="button" data-share-song="${escapeHTML(song.id)}" data-share-title="${escapeHTML(song.title)}">Share song link</button>
      </div>`;
  }

  function renderSongCard(song, options = {}) {
    const writers = Array.isArray(song.writers)
      ? song.writers.join(" · ")
      : (song.writers || "");

    const badge = song.priority || song.status || "Demo";
    const supplementaryBadges = renderSupplementaryBadges(song);

    return `
      <article class="catalogue-song-card" data-song-id="${escapeHTML(song.id)}">
        <div class="catalogue-song-card-head">
          <div class="catalogue-song-badges">
            <span class="catalogue-song-status">${escapeHTML(badge)}</span>
            ${supplementaryBadges}
          </div>
        </div>

        ${options.singleSong ? "" : `<h3>${escapeHTML(song.title)}</h3><p class="catalogue-song-writers">Written by ${escapeHTML(writers)}</p><p class="catalogue-song-description">${escapeHTML(song.description || "Unreleased Marveltonez demo.")}</p>`}

        ${renderMetadata(song)}

        <div class="catalogue-audio-transport" data-custom-audio-player>
          <button class="catalogue-go-start-button" type="button" aria-label="Restart ${escapeHTML(song.title)}" title="Restart">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
              <path class="catalogue-go-start-line" d="M6 5v14"></path>
              <path class="catalogue-go-start-triangle" d="M18 6.5 9.5 12 18 17.5Z"></path>
            </svg>
          </button>
          <div class="catalogue-custom-player" role="group" aria-label="Audio player for ${escapeHTML(song.title)}">
            <button class="catalogue-play-toggle" type="button" aria-label="Play ${escapeHTML(song.title)}" title="Play">
              <svg class="catalogue-player-play-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M8 5.5 18 12 8 18.5Z"></path></svg>
              <svg class="catalogue-player-pause-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"></path></svg>
            </button>
            <span class="catalogue-player-time catalogue-player-current" aria-hidden="true">0:00</span>
            <input class="catalogue-player-seek" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek through ${escapeHTML(song.title)}">
            <span class="catalogue-player-time catalogue-player-duration" aria-hidden="true">0:00</span>
            <button class="catalogue-mute-toggle" type="button" aria-label="Mute ${escapeHTML(song.title)}" title="Mute">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path class="catalogue-volume-speaker" d="M4 9h4l5-4v14l-5-4H4z"></path><path class="catalogue-volume-wave" d="M16 8.5c1.2 1 1.8 2.2 1.8 3.5s-.6 2.5-1.8 3.5"></path></svg>
            </button>
          </div>
          <audio class="catalogue-audio" preload="metadata" data-song-id="${escapeHTML(song.id)}">
            <source src="${escapeHTML(song.audio)}" type="audio/mpeg">
            Your browser does not support audio playback.
          </audio>
        </div>

        <div class="catalogue-song-lower">
          ${renderProfile(song)}
          <div class="catalogue-song-action-artwork-row">
            ${renderActions(song)}
            ${renderArtwork(song)}
          </div>
        </div>
        ${renderLyricsPanel(song)}
      </article>`;
  }

  function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), audio[controls], [tabindex]:not([tabindex="-1"])'
    )).filter((element) => {
      const style = window.getComputedStyle(element);
      return style.visibility !== "hidden" && style.display !== "none";
    });
  }

  function setBackgroundInert(modalRoot, makeInert) {
    if (makeInert) {
      artworkViewerBackgroundState = [];

      Array.from(document.body.children).forEach((element) => {
        if (element === modalRoot || element.tagName === "SCRIPT") return;

        artworkViewerBackgroundState.push({
          element,
          inert: element.inert === true,
          ariaHidden: element.getAttribute("aria-hidden")
        });

        element.inert = true;
        element.setAttribute("aria-hidden", "true");
      });
      return;
    }

    artworkViewerBackgroundState.forEach(({ element, inert, ariaHidden }) => {
      element.inert = inert;
      if (ariaHidden === null) {
        element.removeAttribute("aria-hidden");
      } else {
        element.setAttribute("aria-hidden", ariaHidden);
      }
    });
    artworkViewerBackgroundState = [];
  }

  function createArtworkViewer() {
    if (artworkViewer) return artworkViewer;

    const root = document.createElement("div");
    root.className = "catalogue-artwork-viewer";
    root.id = "catalogue-artwork-viewer";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Visual listening mode");
    root.innerHTML = `
      <div class="catalogue-artwork-viewer-panel" role="document">
        <button class="catalogue-artwork-viewer-close" type="button" aria-label="Close visual listening mode" title="Close">
          <span aria-hidden="true">×</span>
        </button>
        <img class="catalogue-artwork-viewer-image" alt="" width="1536" height="1024">
        <div class="catalogue-artwork-viewer-player" aria-label="Song player"></div>
      </div>`;

    document.body.appendChild(root);

    const closeButton = root.querySelector(".catalogue-artwork-viewer-close");
    const image = root.querySelector(".catalogue-artwork-viewer-image");
    const playerSlot = root.querySelector(".catalogue-artwork-viewer-player");

    closeButton.addEventListener("click", closeArtworkViewer);

    root.addEventListener("click", (event) => {
      if (event.target === root) closeArtworkViewer();
    });

    root.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;

      const focusable = getFocusableElements(root);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    artworkViewer = { root, closeButton, image, playerSlot };
    return artworkViewer;
  }

  function openArtworkViewer(button) {
    const card = button.closest(".catalogue-song-card");
    const transport = card && card.querySelector(":scope > .catalogue-audio-transport");
    const fullSource = button.dataset.artworkFull;
    const songTitle = button.dataset.songTitle || "this song";

    if (!card || !transport || !fullSource) return;

    const viewer = createArtworkViewer();
    artworkViewerTrigger = button;
    artworkViewerTransport = transport;
    artworkViewerPlaceholder = document.createElement("div");
    artworkViewerPlaceholder.className = "catalogue-audio-transport-placeholder";
    artworkViewerPlaceholder.setAttribute("aria-hidden", "true");

    const transportRect = transport.getBoundingClientRect();
    const transportStyle = window.getComputedStyle(transport);
    artworkViewerPlaceholder.style.height = `${transportRect.height}px`;
    artworkViewerPlaceholder.style.marginTop = transportStyle.marginTop;
    artworkViewerPlaceholder.style.marginBottom = transportStyle.marginBottom;

    artworkViewerScrollPosition = window.scrollY;
    artworkViewerClosing = false;
    button.setAttribute("aria-expanded", "true");

    transport.parentNode.insertBefore(artworkViewerPlaceholder, transport);
    transport.classList.add("catalogue-audio-transport-modal");
    viewer.playerSlot.appendChild(transport);

    viewer.image.src = fullSource;
    viewer.image.alt = `Artwork for ${songTitle}`;
    viewer.image.classList.toggle("catalogue-artwork-viewer-image--flipped", button.dataset.artworkFlip === "horizontal");
    viewer.root.setAttribute("aria-label", `Visual listening mode for ${songTitle}`);

    artworkViewerBodyStyleState = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width
    };

    viewer.root.hidden = false;
    viewer.closeButton.focus({ preventScroll: true });
    setBackgroundInert(viewer.root, true);

    document.body.classList.add("catalogue-artwork-viewer-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${artworkViewerScrollPosition}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    requestAnimationFrame(() => {
      viewer.root.classList.add("is-open");
    });
  }

  function finishClosingArtworkViewer() {
    if (!artworkViewer) return;

    if (artworkViewerTransport && artworkViewerPlaceholder) {
      artworkViewerTransport.classList.remove("catalogue-audio-transport-modal");
      artworkViewerPlaceholder.replaceWith(artworkViewerTransport);
    }

    artworkViewer.root.hidden = true;
    artworkViewer.image.removeAttribute("src");
    artworkViewer.image.alt = "";
    artworkViewer.image.classList.remove("catalogue-artwork-viewer-image--flipped");

    setBackgroundInert(artworkViewer.root, false);
    document.body.classList.remove("catalogue-artwork-viewer-open");

    if (artworkViewerBodyStyleState) {
      document.body.style.position = artworkViewerBodyStyleState.position;
      document.body.style.top = artworkViewerBodyStyleState.top;
      document.body.style.left = artworkViewerBodyStyleState.left;
      document.body.style.right = artworkViewerBodyStyleState.right;
      document.body.style.width = artworkViewerBodyStyleState.width;
    }

    window.scrollTo(0, artworkViewerScrollPosition);

    const trigger = artworkViewerTrigger;
    artworkViewerTrigger = null;
    artworkViewerTransport = null;
    artworkViewerPlaceholder = null;
    artworkViewerBodyStyleState = null;
    artworkViewerClosing = false;

    if (trigger && document.contains(trigger)) {
      trigger.setAttribute("aria-expanded", "false");
      trigger.focus({ preventScroll: true });
    }
  }

  function closeArtworkViewer() {
    if (!artworkViewer || artworkViewer.root.hidden || artworkViewerClosing) return;

    artworkViewerClosing = true;
    artworkViewer.root.classList.remove("is-open");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(finishClosingArtworkViewer, reduceMotion ? 0 : 180);
  }

  function handleArtworkViewerEscape(event) {
    if (event.key !== "Escape") return;
    if (!artworkViewer || artworkViewer.root.hidden) return;

    event.preventDefault();
    closeArtworkViewer();
  }

  function showShareConfirmation(message) {
    let status = document.getElementById("catalogueShareStatus");
    if (!status) {
      status = document.createElement("div");
      status.id = "catalogueShareStatus";
      status.className = "catalogue-share-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.setAttribute("aria-atomic", "true");
      document.body.appendChild(status);
    }
    status.textContent = message;
    status.classList.add("is-visible");
    window.clearTimeout(showShareConfirmation.hideTimer);
    showShareConfirmation.hideTimer = window.setTimeout(() => status.classList.remove("is-visible"), 1800);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("Copy command was not available");
  }

  async function shareSongLink(button) {
    const slug = button.dataset.shareSong;
    if (!slug) return;
    const url = `${window.location.origin}/song/${encodeURIComponent(slug)}/`;
    try {
      await copyText(url);
      showShareConfirmation("Song link copied.");
    } catch (_error) {
      showShareConfirmation("Copy unavailable — use the page address.");
    }
  }

  async function fetchCatalogue(sources = DEFAULT_JSON_SOURCES) {
    let lastError;

    for (const source of sources) {
      try {
        const response = await fetch(source, { cache: "no-store" });
        if (!response.ok) throw new Error(`${source}: HTTP ${response.status}`);

        const catalogue = await response.json();
        if (!catalogue || !Array.isArray(catalogue.songs)) {
          throw new Error(`${source}: invalid catalogue structure`);
        }

        return catalogue;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("Unable to load catalogue.");
  }

  function isInteractivePanelTarget(target) {
    return Boolean(
      target &&
      target.closest(
        "a, button, input, select, textarea, audio, video, summary, [role='button'], [contenteditable='true']"
      )
    );
  }

  function closeProfilePanel(details, card, returnFocus = false) {
    if (!details || !details.open) return;
    details.open = false;

    if (returnFocus) {
      const summary = details.querySelector("summary");
      if (summary) summary.focus();
    }

    requestAnimationFrame(() => {
      if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function closeLyricsPanel(panel, card, returnFocus = false) {
    if (!panel || panel.hidden) return;

    panel.hidden = true;
    const toggle = card && card.querySelector(".catalogue-lyrics-toggle");

    if (toggle) {
      setLyricsButtonState(toggle, false);
      if (returnFocus) toggle.focus();
    }

    requestAnimationFrame(() => {
      if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function initialiseCatalogue() {
    const grids = document.querySelectorAll("[data-catalogue-grid]");
    if (!grids.length) return;

    const countElements = document.querySelectorAll("[data-catalogue-count]");

    function formatPlayerTime(seconds) {
      if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
      const whole = Math.floor(seconds);
      const minutes = Math.floor(whole / 60);
      const remainder = String(whole % 60).padStart(2, "0");
      return `${minutes}:${remainder}`;
    }

    function updateCustomPlayer(audio) {
      const transport = audio.closest(".catalogue-audio-transport");
      if (!transport) return;

      const playButton = transport.querySelector(".catalogue-play-toggle");
      const seek = transport.querySelector(".catalogue-player-seek");
      const current = transport.querySelector(".catalogue-player-current");
      const duration = transport.querySelector(".catalogue-player-duration");
      const muteButton = transport.querySelector(".catalogue-mute-toggle");
      const songTitle = playButton ? playButton.getAttribute("aria-label").replace(/^(Play|Pause)\s+/, "") : "song";
      const total = Number.isFinite(audio.duration) ? audio.duration : 0;

      if (playButton) {
        const isPlaying = !audio.paused && !audio.ended;
        playButton.classList.toggle("is-playing", isPlaying);
        playButton.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} ${songTitle}`);
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
        muteButton.setAttribute("aria-label", `${audio.muted ? "Unmute" : "Mute"} ${songTitle}`);
        muteButton.title = audio.muted ? "Unmute" : "Mute";
      }
    }

    function initialiseCustomPlayer(audio, grid) {
      const transport = audio.closest(".catalogue-audio-transport");
      if (!transport) return;
      const playButton = transport.querySelector(".catalogue-play-toggle");
      const seek = transport.querySelector(".catalogue-player-seek");
      const muteButton = transport.querySelector(".catalogue-mute-toggle");

      if (playButton) {
        playButton.addEventListener("click", async () => {
          if (audio.paused || audio.ended) {
            try {
              await audio.play();
            } catch (error) {
              console.warn("Audio playback could not start", error);
            }
          } else {
            audio.pause();
          }
        });
      }

      if (seek) {
        seek.addEventListener("input", () => {
          if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
          audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
          updateCustomPlayer(audio);
        });
      }

      if (muteButton) {
        muteButton.addEventListener("click", () => {
          audio.muted = !audio.muted;
          updateCustomPlayer(audio);
        });
      }

      ["loadedmetadata", "durationchange", "timeupdate", "play", "pause", "ended", "volumechange"].forEach((eventName) => {
        audio.addEventListener(eventName, () => updateCustomPlayer(audio));
      });

      updateCustomPlayer(audio);
    }

    try {
      const catalogue = await fetchCatalogue();

      grids.forEach((grid) => {
        const category = grid.dataset.catalogueCategory || "unreleased";
        const requestedSongId = grid.dataset.songId || "";
        const visibleSongs = catalogue.songs.filter(
          (song) => song.category === category && song.hidden !== true && (!requestedSongId || song.id === requestedSongId)
        ).sort((firstSong, secondSong) => {
          const firstOrder = Number(firstSong.publicDisplayOrder);
          const secondOrder = Number(secondSong.publicDisplayOrder);
          return firstOrder - secondOrder;
        });

        grid.innerHTML = visibleSongs.map((song) => renderSongCard(song, { singleSong: Boolean(requestedSongId) })).join("");

        grid.querySelectorAll(".catalogue-song-card").forEach((card) => {
          const head = card.querySelector(".catalogue-song-card-head");
          const mainTitle = card.querySelector(":scope > h3");
          if (!head || !mainTitle) return;

          let sibling = head.nextElementSibling;
          while (sibling && sibling !== mainTitle) {
            const nextSibling = sibling.nextElementSibling;
            sibling.remove();
            sibling = nextSibling;
          }
        });

        grid.querySelectorAll(".catalogue-audio").forEach((audio) => {
          countedCurrentStarts.set(audio, false);
          audio.defaultPlaybackRate = 1;
          audio.playbackRate = 1;
          audio.addEventListener("ratechange", () => {
            if (audio.playbackRate !== 1) audio.playbackRate = 1;
          });
          initialiseCustomPlayer(audio, grid);

          audio.addEventListener("play", () => {
            grid.querySelectorAll(".catalogue-audio").forEach((otherAudio) => {
              if (otherAudio === audio) return;
              otherAudio.pause();
              try {
                otherAudio.currentTime = 0;
                countedCurrentStarts.set(otherAudio, false);
              } catch (error) {
                // Ignore browsers that temporarily reject seeking before metadata loads.
              }
            });

            // Native audio controls emit "play" after both a fresh start and a
            // pause/resume. Count only a not-yet-counted start at the beginning.
            if (audio.currentTime <= 0.25) {
              recordDeliberateSongStart(audio);
            }
          });

          audio.addEventListener("ended", () => {
            countedCurrentStarts.set(audio, false);
          });

          audio.addEventListener("seeked", () => {
            if (audio.paused && audio.currentTime <= 0.25) {
              countedCurrentStarts.set(audio, false);
            }
          });
        });

        grid.querySelectorAll(".catalogue-action-share").forEach((button) => {
          button.addEventListener("click", () => shareSongLink(button));
        });

        grid.querySelectorAll(".catalogue-go-start-button").forEach((button) => {
          button.addEventListener("click", () => {
            const transport = button.closest(".catalogue-audio-transport");
            const audio = transport && transport.querySelector(".catalogue-audio");
            if (!audio) return;

            audio.pause();

            try {
              audio.currentTime = 0;
              countedCurrentStarts.set(audio, false);
            } catch (error) {
              // Ignore browsers that temporarily reject seeking before metadata loads.
            }
          });
        });

        grid.querySelectorAll(".catalogue-song-artwork-button").forEach((button) => {
          button.addEventListener("click", () => openArtworkViewer(button));
        });

        grid.querySelectorAll(".catalogue-profile").forEach((details) => {
          setProfileButtonState(details);
          details.addEventListener("toggle", () => {
            setProfileButtonState(details);
          });
        });

        grid.querySelectorAll(".catalogue-profile-close").forEach((button) => {
          button.addEventListener("click", () => {
            const details = button.closest("details");
            const card = button.closest(".catalogue-song-card");
            closeProfilePanel(details, card, true);
          });
        });

        grid.querySelectorAll(".catalogue-profile-body").forEach((body) => {
          body.addEventListener("click", (event) => {
            if (isInteractivePanelTarget(event.target)) return;
            const details = body.closest("details");
            const card = body.closest(".catalogue-song-card");
            closeProfilePanel(details, card, false);
          });
        });

        grid.querySelectorAll(".catalogue-lyrics-toggle").forEach((button) => {
          button.addEventListener("click", () => {
            const card = button.closest(".catalogue-song-card");
            const panel = card && card.querySelector(".catalogue-lyrics-panel");
            if (!panel) return;

            const willOpen = panel.hidden;

            grid.querySelectorAll(".catalogue-lyrics-panel:not([hidden])").forEach((openPanel) => {
              if (openPanel === panel) return;
              openPanel.hidden = true;
              const openCard = openPanel.closest(".catalogue-song-card");
              const openButton = openCard && openCard.querySelector(".catalogue-lyrics-toggle");
              if (openButton) setLyricsButtonState(openButton, false);
            });

            panel.hidden = !willOpen;
            setLyricsButtonState(button, willOpen);
          });
        });

        grid.querySelectorAll(".catalogue-lyrics-close").forEach((button) => {
          button.addEventListener("click", () => {
            const panel = button.closest(".catalogue-lyrics-panel");
            const card = button.closest(".catalogue-song-card");
            closeLyricsPanel(panel, card, true);
          });
        });

        grid.querySelectorAll(".catalogue-lyrics-body").forEach((body) => {
          body.addEventListener("click", (event) => {
            if (isInteractivePanelTarget(event.target)) return;
            const panel = body.closest(".catalogue-lyrics-panel");
            const card = body.closest(".catalogue-song-card");
            closeLyricsPanel(panel, card, false);
          });
        });

        grid.addEventListener("keydown", (event) => {
          if (event.key !== "Escape") return;

          const openLyrics = grid.querySelector(".catalogue-lyrics-panel:not([hidden])");
          if (openLyrics) {
            const card = openLyrics.closest(".catalogue-song-card");
            closeLyricsPanel(openLyrics, card, true);
            return;
          }

          const openProfile = grid.querySelector(".catalogue-profile[open]");
          if (openProfile) {
            const card = openProfile.closest(".catalogue-song-card");
            closeProfilePanel(openProfile, card, true);
          }
        });

        countElements.forEach((element) => {
          if ((element.dataset.catalogueCategory || "unreleased") === category) {
            element.textContent = requestedSongId ? "Featured song" : `${visibleSongs.length} demos`;
          }
        });
      });
    } catch (error) {
      console.error("Marveltonez catalogue:", error);
      grids.forEach((grid) => {
        grid.innerHTML = `
          <p class="catalogue-load-error">
            The catalogue is temporarily unavailable. Please try again shortly.
          </p>`;
      });
      countElements.forEach((element) => {
        element.textContent = "Catalogue unavailable";
      });
    }
  }

  document.addEventListener("keydown", handleArtworkViewerEscape);
  document.addEventListener("DOMContentLoaded", initialiseCatalogue);
})();
