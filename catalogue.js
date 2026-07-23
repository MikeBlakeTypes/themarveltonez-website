/**
 * Marveltonez Catalogue Module v1.2
 * Reads metadata/songs.json and creates reusable, expandable song cards.
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

  function renderActions(song) {
    const lyricsAction = song.lyrics
      ? `<a class="catalogue-action" href="${escapeHTML(song.lyrics)}">Lyrics</a>`
      : `<span class="catalogue-action catalogue-action-disabled" aria-disabled="true">Lyrics soon</span>`;

    const subject = encodeURIComponent(`Enquiry about “${song.title}”`);
    const body = encodeURIComponent(`Hi Mike and Mike,\n\nI am interested in your song “${song.title}”.\n\nName:\nCompany / role:\n\nMy enquiry is:\n\nBest regards,`);
    return `
      <div class="catalogue-song-actions">
        ${lyricsAction}
        <a class="catalogue-action catalogue-action-enquire" href="mailto:${enquiryAddress}?subject=${subject}&body=${body}">Enquire about this song</a>
      </div>`;
  }

  function renderSongCard(song) {
    const writers = Array.isArray(song.writers)
      ? song.writers.join(" · ")
      : (song.writers || "");

    const badge = song.priority || song.status || "Demo";

    return `
      <article class="catalogue-song-card" data-song-id="${escapeHTML(song.id)}">
        <div class="catalogue-song-card-head">
          <span class="catalogue-song-status">${escapeHTML(badge)}</span>
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

        ${renderProfile(song)}
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

        grid.querySelectorAll(".catalogue-profile-close").forEach((button) => {
          button.addEventListener("click", () => {
            const details = button.closest("details");
            const card = button.closest(".catalogue-song-card");
            if (details) details.open = false;
            requestAnimationFrame(() => {
              if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
            });
          });
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
