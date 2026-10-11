// Mobile menu
(function () {
  var btn = document.querySelector('.menu-btn');
  var nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
    });
  }
})();

// If a resized image fails, fall back to the original file
document.querySelectorAll('img[data-orig]').forEach(function (img) {
  img.addEventListener('error', function () {
    if (img.src !== img.dataset.orig) img.src = img.dataset.orig;
  }, { once: true });
});

// On touch screens (no hover), swap the game tile image when it scrolls into the middle of the screen
(function () {
  if (!window.matchMedia || !window.matchMedia('(hover: none)').matches || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { e.target.classList.toggle('swap', e.isIntersecting); });
  }, { rootMargin: '-40% 0px -40% 0px' });
  document.querySelectorAll('.tile').forEach(function (t) { io.observe(t); });
})();
