// Version 10: prevent mobile browsers reopening the page at an old scroll position.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('pageshow', () => {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
});

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
  youtubeLink.href = `https://www.youtube.com/watch?v=${id}`;
  frameWrap.classList.toggle('short', orientation === 'short');
  videoFrame.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

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
