/** Marveltonez Website v12.0 — shared unobtrusive page behaviour. */
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

  document.addEventListener("DOMContentLoaded", () => {
    initialiseCommonMenu();
    initialiseBackToTop();
  });
})();
