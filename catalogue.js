/**
 * Marveltonez Catalogue Module v1.5
 * Reads metadata/songs.json and creates reusable, expandable song cards.
 */
(() => {
  "use strict";

  const DEFAULT_JSON_SOURCES = [
    "metadata/songs.json"
  ];

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
        <summary>View song profile</summary>
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

  function setLyricsButtonState(button, isOpen) {
    if (!button) return;

    button.setAttribute("aria-expanded", String(isOpen));

    const label = button.querySelector(".catalogue-action-label");
    const symbol = button.querySelector(".catalogue-action-symbol");

    if (label) label.textContent = isOpen ? "Close Lyrics" : "View Lyrics";
    if (symbol) symbol.textContent = isOpen ? "−" : "+";
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
      </div>`;
  }

  function renderSongCard(song) {
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

        <h3>${escapeHTML(song.title)}</h3>
        <p class="catalogue-song-writers">Written by ${escapeHTML(writers)}</p>
        <p class="catalogue-song-description">${escapeHTML(
          song.description || "Unreleased Marveltonez demo."
        )}</p>

        ${renderMetadata(song)}

        <audio class="catalogue-audio" controls preload="none">
          <source src="${escapeHTML(song.audio)}" type="audio/mpeg">
          Your browser does not support audio playback.
        </audio>

        ${renderProfile(song)}
        ${renderActions(song)}
        ${renderLyricsPanel(song)}
      </article>`;
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

    try {
      const catalogue = await fetchCatalogue();

      grids.forEach((grid) => {
        const category = grid.dataset.catalogueCategory || "unreleased";
        const visibleSongs = catalogue.songs.filter(
          (song) => song.category === category && song.hidden !== true
        ).sort((firstSong, secondSong) => {
          const firstOrder = Number(firstSong.publicDisplayOrder);
          const secondOrder = Number(secondSong.publicDisplayOrder);
          return firstOrder - secondOrder;
        });

        grid.innerHTML = visibleSongs.map(renderSongCard).join("");

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
          audio.addEventListener("play", () => {
            grid.querySelectorAll(".catalogue-audio").forEach((otherAudio) => {
              if (otherAudio === audio) return;
              otherAudio.pause();
              try {
                otherAudio.currentTime = 0;
              } catch (error) {
                // Ignore browsers that temporarily reject seeking before metadata loads.
              }
            });
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
            element.textContent = `${visibleSongs.length} demos`;
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

  document.addEventListener("DOMContentLoaded", initialiseCatalogue);
})();
