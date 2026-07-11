/**
 * Marveltonez Catalogue Module v1.1
 * Reads metadata/songs.json and creates reusable song cards.
 */
(() => {
  "use strict";

  const DEFAULT_JSON_SOURCES = [
    "metadata/songs.json",
    "https://pub-e1b8c12f934c46b8946890b4523c1bf9.r2.dev/metadata/songs.json"
  ];

  const escapeHTML = (value = "") =>
    String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);

  const enquiryAddress = "mikeblake@themarveltonez.com";

  function renderMetadata(song) {
    const details = [
      song.genre,
      song.mood,
      song.vocal,
      song.bpm ? `${song.bpm} BPM` : "",
      song.key
    ].filter(Boolean);

    return details.length
      ? `<p class="catalogue-song-meta">${details.map(escapeHTML).join(" · ")}</p>`
      : "";
  }

  function renderActions(song) {
    const lyricsAction = song.lyrics
      ? `<a class="catalogue-action" href="${escapeHTML(song.lyrics)}">Lyrics</a>`
      : `<span class="catalogue-action catalogue-action-disabled" aria-disabled="true">Lyrics soon</span>`;

    const subject = encodeURIComponent(`Song enquiry: ${song.title}`);
    return `
      <div class="catalogue-song-actions">
        ${lyricsAction}
        <a class="catalogue-action" href="mailto:${enquiryAddress}?subject=${subject}">Enquire</a>
      </div>`;
  }

  function renderSongCard(song) {
    const writers = Array.isArray(song.writers)
      ? song.writers.join(" · ")
      : (song.writers || "");

    return `
      <article class="catalogue-song-card" data-song-id="${escapeHTML(song.id)}">
        <div class="catalogue-song-card-head">
          <span class="catalogue-song-status">${escapeHTML(song.status || "Demo")}</span>
          <span class="catalogue-song-index">${escapeHTML(song.id.replaceAll("-", " "))}</span>
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

        ${renderActions(song)}
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
        );

        grid.innerHTML = visibleSongs.map(renderSongCard).join("");

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
