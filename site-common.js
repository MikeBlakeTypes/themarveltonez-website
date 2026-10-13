/** Marveltonez Website v12.7.4 — shared unobtrusive page behaviour. */
(() => {
  "use strict";

  function initialiseCommonMenu() {
    const button = document.querySelector(".common-menu-toggle");
    if (!button) return;
    const navigationId = button.getAttribute("aria-controls");
    const navigation = navigationId ? document.getElementById(navigationId) : null;
    if (!navigation) return;

    const setMenu = (open) => {
      navigation.classList.toggle("active", open);
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      button.textContent = open ? "×" : "☰";
    };

    button.addEventListener("click", () => setMenu(button.getAttribute("aria-expanded") !== "true"));
    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        button.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) setMenu(false);
    });
  }

  function initialiseBackToTop() {
    document.querySelectorAll("[data-back-to-top]").forEach((button) => {
      button.addEventListener("click", () => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
  }

  function recordTrackedPath(path) {
    const endpoint = String(path || "").trim();
    if (!endpoint.startsWith("/track/")) return;

    try {
      if (navigator.sendBeacon) {
        const queued = navigator.sendBeacon(
          endpoint,
          new Blob([], { type: "text/plain;charset=UTF-8" })
        );
        if (queued) return;
      }

      fetch(endpoint, {
        method: "POST",
        keepalive: true,
        credentials: "same-origin",
        cache: "no-store"
      }).catch(() => {});
    } catch (error) {
      // Analytics must never interrupt the visitor's chosen action.
    }
  }

  function initialiseTrackedLinks() {
    document.addEventListener("click", (event) => {
      const target = event.target;
      const link = target && typeof target.closest === "function"
        ? target.closest("a[data-track-path]")
        : null;

      if (!link) return;
      recordTrackedPath(link.getAttribute("data-track-path"));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initialiseCommonMenu();
    initialiseBackToTop();
    initialiseTrackedLinks();
  });
})();
