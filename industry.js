(function () {
  const menuButton = document.querySelector(".industry-menu-toggle");
  const navigation = document.getElementById("industryNavigation");

  if (!menuButton || !navigation) return;

  function setMenu(open) {
    navigation.classList.toggle("active", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuButton.textContent = open ? "×" : "☰";
  }

  menuButton.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuButton.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) setMenu(false);
  });
})();
