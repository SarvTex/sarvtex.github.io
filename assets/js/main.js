// Site behaviour: sidebar toggle, dark mode, image column, math, art lightbox.
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
  // Image column: a strip of images scrolling upward in a loop
  // ---------------------------------------------------------------
  var bgColumn = document.querySelector('.bg-column');

  if (bgColumn) {
    var panel = bgColumn.querySelector('.bg-panel');
    var bgToggle = bgColumn.querySelector('.bg-toggle');
    // Pages that start closed (bg_closed: true) don't change the remembered setting.
    var closedPage = bgColumn.hasAttribute('data-closed');

    var syncBgToggle = function () {
      var hidden = root.classList.contains('bg-hidden');
      var label = hidden ? 'Show images' : 'Hide images';
      bgToggle.setAttribute('aria-expanded', String(!hidden));
      bgToggle.setAttribute('aria-label', label);
      bgToggle.title = label;
    };

    bgToggle.addEventListener('click', function () {
      var hidden = root.classList.toggle('bg-hidden');
      if (!closedPage) store('bg', hidden ? 'hidden' : null);
      syncBgToggle();
    });
    syncBgToggle();

    // Keep a constant speed (px/s) whatever the strip's length.
    var track = panel.querySelector('.bg-track');
    var speed = Math.max(1, parseFloat(panel.dataset.speed) || 20);
    var setDuration = function () {
      var distance = track.offsetHeight / 2; // one copy of the list
      if (distance > 0) track.style.setProperty('--bg-duration', (distance / speed) + 's');
    };
    if (window.ResizeObserver) new ResizeObserver(setDuration).observe(track);
    else setDuration();
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
