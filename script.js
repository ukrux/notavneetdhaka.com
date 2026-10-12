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

// Photo viewer for the Gallery page: click a photo to see it large, with Prev / Next
(function () {
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot.zoom'));
  if (!shots.length) return;

  var box = document.createElement('div');
  box.className = 'viewer';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Photo viewer');
  box.innerHTML =
    '<div class="viewer-bar"><span class="viewer-count"></span>' +
    '<button type="button" class="viewer-btn viewer-close" aria-label="Close">Close ✕</button></div>' +
    '<button type="button" class="viewer-btn viewer-prev" aria-label="Previous photo">←</button>' +
    '<figure class="viewer-stage"><img alt=""></figure>' +
    '<button type="button" class="viewer-btn viewer-next" aria-label="Next photo">→</button>';
  document.body.appendChild(box);

  var pic = box.querySelector('img');
  var count = box.querySelector('.viewer-count');
  var group = [], idx = 0, opener = null;

  function show() {
    var t = group[idx];
    pic.src = t.getAttribute('data-full');
    var thumb = t.querySelector('img');
    pic.alt = thumb ? thumb.alt : '';
    count.textContent = (idx + 1) + ' / ' + group.length;
    // preload neighbours so Next / Prev feel instant
    [idx + 1, idx - 1].forEach(function (n) {
      var g = group[(n + group.length) % group.length];
      if (g) { var im = new Image(); im.src = g.getAttribute('data-full'); }
    });
  }
  function open(t) {
    var g = t.getAttribute('data-group');
    group = shots.filter(function (x) { return x.getAttribute('data-group') === g; });
    idx = group.indexOf(t);
    opener = t;
    show();
    box.hidden = false;
    document.documentElement.classList.add('viewer-open');
    box.querySelector('.viewer-close').focus();
  }
  function close() {
    box.hidden = true;
    pic.removeAttribute('src');
    document.documentElement.classList.remove('viewer-open');
    if (opener) opener.focus();
  }
  function step(d) { idx = (idx + d + group.length) % group.length; show(); }

  shots.forEach(function (t) { t.addEventListener('click', function () { open(t); }); });
  box.querySelector('.viewer-close').addEventListener('click', close);
  box.querySelector('.viewer-prev').addEventListener('click', function () { step(-1); });
  box.querySelector('.viewer-next').addEventListener('click', function () { step(1); });
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.classList.contains('viewer-stage')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
  // swipe on phones
  var x0 = null;
  box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    x0 = null;
  });
})();

// Copy email button
document.querySelectorAll('.copy-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var text = btn.getAttribute('data-copy');
    function done(ok) {
      btn.textContent = ok ? 'Copied ✓' : 'Select & copy';
      setTimeout(function () { btn.textContent = 'Copy'; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      var el = document.getElementById('email');
      var r = document.createRange(); r.selectNodeContents(el);
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      done(ok);
    }
  });
});
