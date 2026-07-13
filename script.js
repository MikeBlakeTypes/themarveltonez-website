// Version 11.1: reset genuine fresh opens while preserving browser-back position.
(function forceInitialTop(){
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
  }
  const navigation = performance.getEntriesByType?.('navigation')?.[0];
  if (navigation?.type === 'back_forward') return;
  if (window.location.hash) return;
  const reset = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  reset();
  window.addEventListener('DOMContentLoaded', reset, { once: true });
  window.addEventListener('load', reset, { once: true });
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) reset();
  });
  setTimeout(reset, 0);
  setTimeout(reset, 120);
  setTimeout(reset, 450);
})();

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
  });
}

// Version 9 premium: subtle section reveal as the page scrolls.
const revealTargets = document.querySelectorAll('.section, .contact-cta, .site-footer');
revealTargets.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => observer.observe(el));

// Version 9.2: cinematic video viewer for Selected Works.
const lightbox = document.getElementById('videoLightbox');
const videoFrame = document.getElementById('videoFrame');
const videoTitle = document.getElementById('videoTitle');
const videoArtist = document.getElementById('videoArtist');
const youtubeLink = document.getElementById('youtubeLink');
const frameWrap = document.querySelector('.video-frame-wrap');
const workCards = document.querySelectorAll('.work-card[data-video-id]');

function openVideo(card) {
  const id = card.dataset.videoId;
  const title = card.dataset.videoTitle || 'Selected Work';
  const artist = card.dataset.videoArtist || '';
  const type = card.dataset.videoType || '';
  const orientation = card.dataset.videoOrientation || 'wide';

  videoTitle.textContent = title;
  videoArtist.textContent = [artist, type].filter(Boolean).join(' · ');
  youtubeLink.href = `https://www.youtube.com/watch?v=${id}&cc_load_policy=0`;
  frameWrap.classList.toggle('short', orientation === 'short');
  videoFrame.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=0&cc_lang_pref=en&iv_load_policy=3`;

  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('video-open');
  lightbox.querySelector('.video-close').focus();
}

function closeVideo() {
  if (!lightbox.classList.contains('active')) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('video-open');
  videoFrame.src = '';
}

workCards.forEach(card => {
  card.addEventListener('click', () => openVideo(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openVideo(card);
    }
  });
});

document.querySelectorAll('[data-close-video]').forEach(el => el.addEventListener('click', closeVideo));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeVideo();
});
