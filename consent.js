(function initialisePrivacyChoices() {
  "use strict";

  const STORAGE_KEY = "marveltonezConsentV1";
  const STORAGE_DAYS = 180;
  let currentPreferences = readPreferences();
  let returnFocusTo = null;

  function readPreferences() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored || stored.version !== 1 || stored.expiresAt < Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return {
        essential: true,
        media: stored.media === true,
        analytics: false,
        version: 1,
        expiresAt: stored.expiresAt
      };
    } catch (_error) {
      return null;
    }
  }

  function savePreferences(preferences) {
    currentPreferences = {
      essential: true,
      media: preferences.media === true,
      analytics: false,
      version: 1,
      expiresAt: Date.now() + STORAGE_DAYS * 24 * 60 * 60 * 1000
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPreferences));
    } catch (_error) {
      // The visitor's choice still applies for this page view if storage is unavailable.
    }
    hideBanner();
    closePreferences();
    window.dispatchEvent(new CustomEvent("marveltonez:consent", {
      detail: { ...currentPreferences }
    }));
  }

  function allows(category) {
    if (category === "essential") return true;
    return Boolean(currentPreferences && currentPreferences[category] === true);
  }

  function createInterface() {
    const container = document.createElement("div");
    container.innerHTML = `
      <section class="consent-banner" id="consentBanner" aria-labelledby="consentTitle" role="region">
        <div class="consent-banner-copy">
          <p class="consent-kicker">Privacy choices · The Marveltonez</p>
          <h2 id="consentTitle">Cookies &amp; embedded media</h2>
          <p>We use essential local storage to remember your choice. With your consent, YouTube videos can load and YouTube may set cookies or process device data. You can change your choice at any time.</p>
          <a href="privacy.html">Privacy &amp; Datenschutz</a>
        </div>
        <div class="consent-banner-actions">
          <button class="consent-button" data-consent="accept" type="button"><span>Accept videos</span><small>Videos erlauben</small></button>
          <button class="consent-button" data-consent="reject" type="button"><span>Reject optional</span><small>Optional ablehnen</small></button>
          <button class="consent-button consent-button-secondary" data-consent="preferences" type="button"><span>Preferences</span><small>Einstellungen</small></button>
        </div>
      </section>
      <div class="consent-modal" id="consentModal" hidden>
        <div class="consent-modal-backdrop" data-consent-close></div>
        <section class="consent-dialog" role="dialog" aria-modal="true" aria-labelledby="preferencesTitle">
          <button class="consent-close" type="button" aria-label="Close cookie preferences" data-consent-close>×</button>
          <p class="consent-kicker">Your privacy</p>
          <h2 id="preferencesTitle">Cookie &amp; media preferences</h2>
          <p>Optional services remain off unless you choose otherwise. Consent is voluntary and can be withdrawn here at any time.</p>
          <div class="consent-category">
            <div><strong>Essential storage</strong><span>Remembers your privacy choice for up to six months.</span></div>
            <input aria-label="Essential storage is always enabled" checked disabled type="checkbox" />
          </div>
          <label class="consent-category" for="mediaConsent">
            <div><strong>Embedded media</strong><span>Allows YouTube videos to load inside this website.</span></div>
            <input id="mediaConsent" type="checkbox" />
          </label>
          <div class="consent-category consent-category-disabled">
            <div><strong>Analytics</strong><span>Not currently used on this website.</span></div>
            <input aria-label="Analytics is not currently used" disabled type="checkbox" />
          </div>
          <div class="consent-dialog-actions">
            <button class="consent-button" data-consent="save" type="button">Save choices</button>
            <button class="consent-button" data-consent="reject" type="button">Reject optional</button>
          </div>
          <p class="consent-fine-print">Details in our <a href="privacy.html">Privacy &amp; Datenschutz policy</a>.</p>
        </section>
      </div>`;
    document.body.append(...container.children);
  }

  function showBanner() {
    const banner = document.getElementById("consentBanner");
    if (banner) banner.hidden = false;
  }

  function hideBanner() {
    const banner = document.getElementById("consentBanner");
    if (banner) banner.hidden = true;
  }

  function openPreferences(trigger) {
    returnFocusTo = trigger || document.activeElement;
    const modal = document.getElementById("consentModal");
    const mediaCheckbox = document.getElementById("mediaConsent");
    mediaCheckbox.checked = allows("media");
    modal.hidden = false;
    document.body.classList.add("consent-open");
    modal.querySelector(".consent-close").focus();
  }

  function closePreferences() {
    const modal = document.getElementById("consentModal");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("consent-open");
    if (returnFocusTo && typeof returnFocusTo.focus === "function") returnFocusTo.focus();
  }

  function handleAction(button) {
    const action = button.dataset.consent;
    if (action === "accept") savePreferences({ media: true });
    if (action === "reject") savePreferences({ media: false });
    if (action === "preferences") openPreferences(button);
    if (action === "save") {
      savePreferences({ media: document.getElementById("mediaConsent").checked });
    }
  }

  createInterface();
  document.querySelectorAll("[data-consent]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button));
  });
  document.querySelectorAll("[data-open-consent]").forEach((button) => {
    button.addEventListener("click", () => openPreferences(button));
  });
  document.querySelectorAll("[data-consent-close]").forEach((button) => {
    button.addEventListener("click", closePreferences);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePreferences();
  });

  window.MarveltonezConsent = {
    allows,
    open: openPreferences,
    grantMedia: function grantMedia() { savePreferences({ media: true }); },
    get: function getPreferences() {
      return currentPreferences ? { ...currentPreferences } : null;
    }
  };

  if (currentPreferences) hideBanner();
  else showBanner();
})();
