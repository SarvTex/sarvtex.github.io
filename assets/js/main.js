// Site behaviour: sidebar toggle, dark mode, background images, math, art lightbox.
// No build step and no dependencies (KaTeX is loaded separately on pages with math).
(function () {
  'use strict';

  var root = document.documentElement;
  var mobile = window.matchMedia('(max-width: 768px)');

  function store(key, value) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) { /* storage blocked: the setting just won't be remembered */ }
  }

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  // ---------------------------------------------------------------
  // Sidebar
  //   desktop: collapse to a narrow strip (remembered)
  //   mobile:  slide in over the text, with a dark backdrop
  // ---------------------------------------------------------------
  var toggles = document.querySelectorAll('.menu-toggle');
  var backdrop = document.querySelector('.sidebar-backdrop');

  function syncAria() {
    var expanded = mobile.matches
      ? root.classList.contains('sidebar-open')
      : !root.classList.contains('sidebar-collapsed');
    toggles.forEach(function (b) { b.setAttribute('aria-expanded', String(expanded)); });
  }

  function setMobileOpen(open) {
    root.classList.toggle('sidebar-open', open);
    if (backdrop) backdrop.hidden = !open;
    syncAria();
  }

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (mobile.matches) {
        setMobileOpen(!root.classList.contains('sidebar-open'));
      } else {
        var collapsed = root.classList.toggle('sidebar-collapsed');
        store('sidebar', collapsed ? 'collapsed' : null);
        syncAria();
      }
    });
  });

  if (backdrop) backdrop.addEventListener('click', function () { setMobileOpen(false); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('sidebar-open')) setMobileOpen(false);
  });

  mobile.addEventListener('change', function () { setMobileOpen(false); });
  syncAria();

  // ---------------------------------------------------------------
  // Dark mode (initial value is set by the inline script in <head>)
  // ---------------------------------------------------------------
  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('theme', next);
    });
  }

  // Follow the OS setting live, unless the visitor picked a theme themselves.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!read('theme')) root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  });

  // ---------------------------------------------------------------
  // Background column: fixed / random / rotate
  // ---------------------------------------------------------------
  var panel = document.querySelector('.bg-panel');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function preload(src, done) {
    var img = new Image();
    img.onload = img.onerror = function () { done(); };
    img.src = src;
  }

  function startBackground() {
    var mode = panel.dataset.mode;
    var images = JSON.parse(panel.dataset.images || '[]');
    var layers = panel.querySelectorAll('.bg-layer');
    if (mode === 'fixed' || !images.length || layers.length < 2) return;

    var index = Math.floor(Math.random() * images.length);
    var front = 0;

    // Fade the new image in on top, then drop the old one once it's covered.
    function show(i) {
      var layer = layers[front];
      var old = layers[1 - front];
      preload(images[i], function () {
        layer.style.backgroundImage = "url('" + images[i] + "')";
        layer.style.zIndex = 1;
        old.style.zIndex = 0;
        layer.classList.add('is-visible');
        setTimeout(function () { old.classList.remove('is-visible'); }, 1700);
      });
    }

    show(index);

    if (mode === 'rotate' && images.length > 1 && !reduceMotion) {
      var seconds = Math.max(3, parseFloat(panel.dataset.interval) || 12);
      setInterval(function () {
        if (document.hidden) return;
        index = (index + 1) % images.length;
        front = 1 - front;
        show(index);
      }, seconds * 1000);
    }
  }

  // Only load images when the column is actually visible (it's hidden on small screens).
  if (panel) {
    var bgQuery = window.matchMedia('(min-width: 1025px)');
    var started = false;
    var tryStart = function () {
      if (!started && bgQuery.matches) { started = true; startBackground(); }
    };
    tryStart();
    bgQuery.addEventListener('change', tryStart);
  }

  // ---------------------------------------------------------------
  // Math: kramdown turns $$...$$ into \(...\) / \[...\]; KaTeX renders them.
  // ---------------------------------------------------------------
  if (window.renderMathInElement) {
    document.querySelectorAll('.post-body').forEach(function (el) {
      window.renderMathInElement(el, {
        delimiters: [
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    });
  }

  // ---------------------------------------------------------------
  // Art gallery lightbox
  // ---------------------------------------------------------------
  var dialog = document.querySelector('.lightbox');
  if (dialog && dialog.showModal) {
    var dImg = document.createElement('img');
    dImg.className = 'lightbox__img';
    dialog.insertBefore(dImg, dialog.querySelector('.lightbox__caption'));
    var dCap = dialog.querySelector('.lightbox__caption');

    document.querySelectorAll('.gallery__link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        dImg.src = link.href;
        dImg.alt = link.querySelector('img').alt;
        dCap.textContent = link.dataset.caption || '';
        dialog.showModal();
      });
    });

    // Click outside the image closes it.
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
  }
})();
