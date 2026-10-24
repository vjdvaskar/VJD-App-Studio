/* ==========================================================================
   VJD App Studio – main.js
   Shared code for every page: header, footer, theme, search, app cards,
   home page, All Apps page (search / filter / sort) and the contact form.
   No libraries, no network requests. All text is inserted with textContent
   (never innerHTML) so app data cannot inject HTML or scripts.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.VJD_CONFIG || {};
  var SITE_NAME = CFG.siteName || 'VJD App Studio';
  var BASE = document.body.getAttribute('data-base') || '';   // '' on root pages, '../' inside /apps/
  var PAGE = document.body.getAttribute('data-page') || '';
  var THEME_KEY = 'vjd-theme';
  var SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  /* ---------------- Icons (trusted constants – simple 24px line icons) ---------------- */
  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    download: '<path d="M12 3v12m0 0-4-4m4 4 4-4M4 19h16"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    alert: '<path d="M12 3 2.5 20h19z"/><path d="M12 10v4M12 17h.01"/>',
    shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    book: '<path d="M4 19.5V5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8 6.2 21l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M16 4v16M3 9h5M16 9h5M3 15h5M16 15h5"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    code: '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
  };
  var CATEGORY_ICONS = {
    'education': 'book', 'health & fitness': 'heart', 'productivity': 'briefcase',
    'tools': 'tool', 'lifestyle': 'smile', 'entertainment': 'film'
  };
  var SOCIALS = [
    ['github', 'GitHub'], ['youtube', 'YouTube'], ['x', 'X (Twitter)'], ['facebook', 'Facebook'],
    ['instagram', 'Instagram'], ['telegram', 'Telegram'], ['linkedin', 'LinkedIn']
  ];

  /* ---------------- Small helpers ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /** Safe element builder: strings become text nodes, never HTML. */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    var key;
    attrs = attrs || {};
    for (key in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, key)) continue;
      var val = attrs[key];
      if (val === null || val === undefined || val === false) continue;
      if (key === 'class') el.className = val;
      else if (key.slice(0, 2) === 'on' && typeof val === 'function') el.addEventListener(key.slice(2), val);
      else el.setAttribute(key, val === true ? '' : String(val));
    }
    for (var i = 2; i < arguments.length; i++) appendKids(el, arguments[i]);
    return el;
  }
  function appendKids(el, kid) {
    if (kid === null || kid === undefined || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { appendKids(el, k); }); return; }
    el.append(typeof kid === 'object' && kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  function icon(name, size) {
    var s = size || 20;
    var span = document.createElement('span');
    span.className = 'icon';
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">' +
      (ICONS[name] || ICONS.folder) + '</svg>';
    return span;
  }
  function categoryIcon(cat) { return CATEGORY_ICONS[String(cat || '').toLowerCase()] || 'folder'; }

  /* ---------------- Validation ---------------- */
  function isHttpsUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return false;
    try {
      var u = new URL(value.trim());
      return u.protocol === 'https:' && u.hostname.indexOf('.') > 0 && !u.username && !u.password;
    } catch (e) { return false; }
  }
  function isPlayStoreUrl(value) {
    if (!isHttpsUrl(value)) return false;
    var u = new URL(value.trim());
    return u.hostname === 'play.google.com' && u.pathname.indexOf('/store/apps/details') === 0 && !!u.searchParams.get('id');
  }
  function isEmail(value) { return typeof value === 'string' && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/.test(value.trim()); }
  function isConfigured(url) { return typeof url === 'string' && url && url.indexOf('YOUR-DOMAIN') === -1; }

  /** Turns an icon/screenshot path from apps.js into a safe URL (https:// or a relative site path). */
  function assetUrl(path) {
    if (typeof path !== 'string') return null;
    var p = path.trim();
    if (!p) return null;
    if (/^https:\/\//i.test(p)) return isHttpsUrl(p) ? p : null;
    if (/^[\w\-./ ]+$/.test(p) && p.charAt(0) !== '/' && p.indexOf('..') === -1) return BASE + p.split('/').map(encodeURIComponent).join('/');
    return null;
  }

  /* ---------------- App data ---------------- */
  function cleanApps(raw) {
    var seen = {};
    var list = [];
    (Array.isArray(raw) ? raw : []).forEach(function (a, i) {
      if (!a || typeof a !== 'object') return;
      if (typeof a.name !== 'string' || !a.name.trim() || typeof a.slug !== 'string' || !SLUG_RE.test(a.slug)) {
        console.warn('[VJD] apps.js entry #' + (i + 1) + ' skipped: it needs a name and a slug (lowercase letters, numbers, hyphens).');
        return;
      }
      if (seen[a.slug]) { console.warn('[VJD] Duplicate slug "' + a.slug + '" skipped.'); return; }
      seen[a.slug] = true;
      if (a.apkUrl && !isHttpsUrl(a.apkUrl)) console.warn('[VJD] ' + a.name + ': apkUrl is not a valid https:// link, so it is hidden.');
      if (a.playStoreUrl && !isPlayStoreUrl(a.playStoreUrl)) console.warn('[VJD] ' + a.name + ': playStoreUrl is not a valid Google Play link, so it is hidden.');
      list.push(a);
    });
    return list;
  }
  var APPS = cleanApps(window.VJD_APPS);

  function hasApk(app) { return isHttpsUrl(app.apkUrl); }
  function hasPlay(app) { return isPlayStoreUrl(app.playStoreUrl); }
  function hasDownload(app) { return hasApk(app) || hasPlay(app); }
  function appUrl(app) { return BASE + 'apps/' + encodeURIComponent(app.slug) + '.html'; }

  function parseDate(str) {
    if (typeof str !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
    var d = new Date(str + 'T00:00:00Z');
    return isNaN(d.getTime()) ? null : d;
  }
  function formatDate(str) {
    var d = parseDate(str);
    return d ? new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(d) : '';
  }
  function appTimestamp(app) {
    var d = parseDate(app.updatedDate) || parseDate(app.releaseDate);
    return d ? d.getTime() : -Infinity;
  }
  function byName(a, b) { return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }); }
  function byLatest(a, b) {
    var ta = appTimestamp(a), tb = appTimestamp(b);
    if (ta === tb) return byName(a, b);
    return tb > ta ? 1 : -1;
  }
  function norm(s) { return String(s === null || s === undefined ? '' : s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, ''); }

  function categoriesOf(apps) {
    var map = {};
    apps.forEach(function (a) { var c = (a.category || '').trim(); if (c) map[c] = (map[c] || 0) + 1; });
    return Object.keys(map).sort(function (x, y) { return x.localeCompare(y, 'en'); }).map(function (n) { return { name: n, count: map[n] }; });
  }

  /** Search + category filter + sort. Pure function (easy to test). */
  function filterApps(apps, opts) {
    opts = opts || {};
    var terms = norm(opts.q).split(/\s+/).filter(Boolean);
    var out = apps.filter(function (a) {
      if (opts.category && a.category !== opts.category) return false;
      if (!terms.length) return true;
      var hay = norm([a.name, a.shortDescription, a.fullDescription, a.category].join(' '));
      return terms.every(function (t) { return hay.indexOf(t) !== -1; });
    });
    var sort = opts.sort || 'latest';
    out.sort(sort === 'name-asc' ? byName : sort === 'name-desc' ? function (a, b) { return byName(b, a); } : byLatest);
    return out;
  }

  /* ---------------- Reusable UI pieces ---------------- */
  function hashStr(s) { var x = 0; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0; return x; }
  function initials(name) {
    var words = String(name).trim().split(/\s+/).filter(Boolean);
    return ((words[0] || '?').charAt(0) + (words.length > 1 ? words[1].charAt(0) : '')).toUpperCase();
  }
  function monogram(app) {
    return h('span', { class: 'app-icon__mono', 'aria-hidden': 'true', style: 'background:hsl(' + (hashStr(app.name) % 360) + ' 62% 38%)' }, initials(app.name));
  }
  /** App icon: real image when configured, a coloured letter tile otherwise. */
  function appIcon(app, size) {
    var wrap = h('span', { class: 'app-icon', style: '--size:' + Number(size || 60) + 'px' });
    var src = assetUrl(app.icon);
    if (src) {
      var img = h('img', { src: src, alt: app.name + ' app icon', width: size, height: size, loading: 'lazy', decoding: 'async' });
      img.addEventListener('error', function () {
        if (img.getAttribute('data-fallback')) return;
        img.setAttribute('data-fallback', '1');
        img.src = BASE + 'assets/images/default-app-icon.svg';
      });
      wrap.append(img);
    } else {
      wrap.append(monogram(app));
    }
    return wrap;
  }

  function appCard(app) {
    var chips = h('div', { class: 'chip-row' },
      app.category ? h('span', { class: 'chip' }, icon(categoryIcon(app.category), 14), app.category) : null,
      app.version ? h('span', { class: 'chip' }, 'Version ' + app.version) : null
    );
    return h('article', { class: 'app-card' },
      app.featured ? h('span', { class: 'badge badge--featured' }, icon('star', 13), 'Featured') : null,
      h('div', { class: 'app-card__top' },
        appIcon(app, 60),
        h('div', null, h('h3', { class: 'app-card__title' }, h('a', { href: appUrl(app) }, app.name)), chips)
      ),
      app.shortDescription ? h('p', { class: 'app-card__desc' }, app.shortDescription) : h('p', { class: 'app-card__desc' }),
      h('div', { class: 'app-card__actions' },
        h('a', { class: 'btn btn--secondary btn--sm', href: appUrl(app), 'aria-label': 'View details for ' + app.name }, 'View Details'),
        hasDownload(app)
          ? h('a', { class: 'btn btn--primary btn--sm', href: appUrl(app) + '#download', 'aria-label': 'Download options for ' + app.name }, icon('download', 16), 'Download')
          : null
      )
    );
  }

  function emptyState(title, text, button) {
    return h('div', { class: 'state', role: 'status' }, h('h3', null, title), h('p', null, text), button || null);
  }

  /* ---------------- Meta tag helper (used by app detail pages too) ---------------- */
  function setMeta(selector, attr, value) {
    var el = $(selector);
    if (el && value) el.setAttribute(attr, value);
  }

  /* ---------------- Theme ---------------- */
  function currentTheme() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function storedTheme() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
  function applyTheme(theme, save) {
    document.documentElement.setAttribute('data-theme', theme);
    if (save) { try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage blocked – ignore */ } }
    var btn = $('#theme-toggle');
    if (btn) {
      btn.replaceChildren(icon(theme === 'dark' ? 'sun' : 'moon'));
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }
  function initTheme() {
    applyTheme(currentTheme(), false);
    var btn = $('#theme-toggle');
    if (btn) btn.addEventListener('click', function () { applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true); });
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function (e) { if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light', false); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
    }
  }

  /* ---------------- Header & footer ---------------- */
  function socialLinks() {
    var s = CFG.social || {};
    return SOCIALS.filter(function (p) { return isHttpsUrl(s[p[0]]); }).map(function (p) { return { label: p[1], url: s[p[0]].trim() }; });
  }

  function buildHeader() {
    var host = $('#site-header');
    if (!host) return;
    var active = PAGE === 'app' ? 'apps' : PAGE;
    var links = [
      ['home', 'Home', BASE + 'index.html'],
      ['apps', 'All Apps', BASE + 'apps.html'],
      ['categories', 'Categories', BASE + 'index.html#categories'],
      ['about', 'About', BASE + 'about.html'],
      ['contact', 'Contact', BASE + 'contact.html']
    ];
    var nav = h('nav', { class: 'nav', id: 'primary-nav', 'aria-label': 'Main navigation' },
      h('ul', { class: 'nav__list' }, links.map(function (l) {
        return h('li', null, h('a', { class: 'nav__link', href: l[2], 'aria-current': l[0] === active ? 'page' : null }, l[1]));
      }))
    );
    var menuBtn = h('button', { class: 'icon-btn menu-toggle', type: 'button', 'aria-controls': 'primary-nav', 'aria-expanded': 'false', 'aria-label': 'Open menu' }, icon('menu'));
    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menuBtn.replaceChildren(icon(open ? 'close' : 'menu'));
    }
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 880) setMenu(false); });

    var searchBtn = h('button', { class: 'icon-btn', type: 'button', id: 'search-open', 'aria-label': 'Search apps', title: 'Search apps' }, icon('search'));
    var themeBtn = h('button', { class: 'icon-btn', type: 'button', id: 'theme-toggle' });

    host.replaceChildren(h('div', { class: 'container header-inner' },
      h('a', { class: 'brand', href: BASE + 'index.html', 'aria-label': SITE_NAME + ' – home' },
        h('img', { src: BASE + 'assets/images/logo.svg', alt: '', width: 38, height: 38 }), h('span', null, 'VJD ', h('b', null, 'App Studio'))),
      nav,
      h('div', { class: 'header-actions' }, searchBtn, themeBtn, menuBtn)
    ));
  }

  function buildFooter() {
    var host = $('#site-footer');
    if (!host) return;
    var socials = socialLinks();
    host.replaceChildren(h('div', { class: 'container' },
      h('div', { class: 'footer-grid' },
        h('div', null,
          h('a', { class: 'footer-brand', href: BASE + 'index.html' }, h('img', { src: BASE + 'assets/images/logo.svg', alt: '', width: 34, height: 34 }), SITE_NAME),
          h('p', { class: 'footer-about' }, 'An independent Android app brand focused on useful, simple, user-friendly applications.')
        ),
        h('nav', { 'aria-label': 'Explore' }, h('h2', null, 'Explore'), h('ul', null,
          h('li', null, h('a', { href: BASE + 'apps.html' }, 'All Apps')),
          h('li', null, h('a', { href: BASE + 'index.html#categories' }, 'Categories')))),
        h('nav', { 'aria-label': 'Company' }, h('h2', null, 'Company'), h('ul', null,
          h('li', null, h('a', { href: BASE + 'about.html' }, 'About Us')),
          h('li', null, h('a', { href: BASE + 'contact.html' }, 'Contact Us')))),
        h('nav', { 'aria-label': 'Legal' }, h('h2', null, 'Legal'), h('ul', null,
          h('li', null, h('a', { href: BASE + 'privacy-policy.html' }, 'Privacy Policy')),
          h('li', null, h('a', { href: BASE + 'terms.html' }, 'Terms and Conditions'))))
      ),
      socials.length ? h('nav', { 'aria-label': 'Social links', style: 'margin-top:28px' }, h('h2', { class: 'visually-hidden' }, 'Social links'),
        h('ul', { class: 'chip-row', style: 'list-style:none;padding:0;margin:0' }, socials.map(function (s) {
          return h('li', null, h('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer' }, s.label, ' ↗'));
        }))) : null,
      h('div', { class: 'footer-bottom' },
        h('p', null, '© ' + new Date().getFullYear() + ' ' + SITE_NAME + '. All rights reserved.'),
        h('p', null, 'Android and Google Play are trademarks of Google LLC. ' + SITE_NAME + ' is not affiliated with or endorsed by Google.')
      )
    ));
  }

  /* ---------------- Search dialog ---------------- */
  function buildSearch() {
    var openBtn = $('#search-open');
    if (!openBtn) return;
    var input = h('input', { type: 'search', id: 'site-search', name: 'q', placeholder: 'Search apps by name or description', autocomplete: 'off', maxlength: 80 });
    var list = h('ul', { class: 'search-results', id: 'search-results' });
    var seeAll = h('a', { href: BASE + 'apps.html' }, 'See all results');
    var closeBtn = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Close search' }, icon('close'));
    var form = h('form', { role: 'search', action: BASE + 'apps.html', method: 'get', class: 'search-dialog__head' },
      h('div', { class: 'field' }, h('label', { for: 'site-search', class: 'visually-hidden' }, 'Search apps'), input), closeBtn);
    var dialog = h('dialog', { class: 'search-dialog', 'aria-label': 'Search apps' },
      h('div', { class: 'search-dialog__inner' }, form, list,
        h('div', { class: 'search-dialog__foot' }, h('span', { 'aria-live': 'polite', id: 'search-count' }), seeAll)));
    document.body.append(dialog);

    function update() {
      var q = input.value.trim().slice(0, 80);
      var found = filterApps(APPS, { q: q, sort: q ? 'latest' : 'name-asc' });
      seeAll.setAttribute('href', BASE + 'apps.html' + (q ? '?q=' + encodeURIComponent(q) : ''));
      $('#search-count', dialog).textContent = found.length + (found.length === 1 ? ' app' : ' apps');
      if (!found.length) { list.replaceChildren(h('li', { class: 'search-empty' }, 'No apps match “' + q + '”.')); return; }
      list.replaceChildren.apply(list, found.slice(0, 6).map(function (a) {
        return h('li', null, h('a', { href: appUrl(a) }, appIcon(a, 40), h('span', null, a.name, h('small', null, a.category || 'App'))));
      }));
    }
    function open() {
      if (typeof dialog.showModal === 'function') { if (!dialog.open) dialog.showModal(); } else dialog.setAttribute('open', '');
      update(); input.focus(); input.select();
    }
    function close() { if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open'); openBtn.focus(); }
    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    input.addEventListener('input', update);
    dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim().slice(0, 80);
      window.location.href = BASE + 'apps.html' + (q ? '?q=' + encodeURIComponent(q) : '');
    });
  }

  /* ---------------- Config placeholders & ads ---------------- */
  function fillConfig() {
    $$('[data-config="email"]').forEach(function (el) {
      if (isEmail(CFG.email)) { el.textContent = CFG.email.trim(); el.classList.remove('todo'); }
      else { el.textContent = '[add your contact email in assets/js/config.js]'; el.classList.add('todo'); }
    });
    $$('[data-config="siteName"]').forEach(function (el) { el.textContent = SITE_NAME; });
  }

  function initAds() {
    var ads = CFG.ads || {};
    var pub = String(ads.publisherId || '');
    if (!ads.enabled || !/^ca-pub-\d{10,20}$/.test(pub)) return;
    var active = $$('.ad-slot[data-ad-slot]').filter(function (el) { return /^\d{6,}$/.test(String((ads.slots || {})[el.getAttribute('data-ad-slot')] || '')); });
    if (!active.length) return;
    var s = document.createElement('script');
    s.async = true; s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(pub);
    document.head.append(s);
    active.forEach(function (el) {
      var ins = h('ins', { class: 'adsbygoogle', style: 'display:block', 'data-ad-client': pub, 'data-ad-slot': String(ads.slots[el.getAttribute('data-ad-slot')]), 'data-ad-format': 'auto', 'data-full-width-responsive': 'true' });
      el.append(h('span', { class: 'ad-slot__label' }, 'Advertisement'), ins);
      el.hidden = false;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }

  /* ---------------- PAGE: home ---------------- */
  var pages = {};

  pages.home = function () {
    // Hero visual – built from the real app list (no fake screenshots)
    var screen = $('#hero-screen');
    if (screen) {
      var rows = APPS.slice().sort(byLatest).slice(0, 3).map(function (a) {
        return h('div', { class: 'phone__row' }, appIcon(a, 40), h('div', null, h('strong', null, a.name), h('small', null, a.category || 'Android app')));
      });
      screen.replaceChildren.apply(screen, [
        h('div', { class: 'phone__bar' }),
        h('div', { class: 'phone__title' }, h('img', { src: BASE + 'assets/images/logo.svg', alt: '', width: 22, height: 22 }), SITE_NAME),
        h('p', { class: 'phone__sub' }, APPS.length ? 'Apps from our studio' : 'Apps coming soon')
      ].concat(rows, [h('div', { class: 'phone__ghost' }), h('div', { class: 'phone__ghost' })]));
    }

    // Featured
    var featured = APPS.filter(function (a) { return a.featured; }).sort(byName);
    var fSec = $('#featured'), fGrid = $('#featured-grid');
    if (fSec && fGrid) {
      if (featured.length) fGrid.replaceChildren.apply(fGrid, featured.map(appCard)); else fSec.hidden = true;
    }

    // Latest
    var lSec = $('#latest'), lList = $('#latest-list');
    if (lSec && lList) {
      var latest = APPS.slice().sort(byLatest).slice(0, 6);
      if (!latest.length) {
        lList.replaceChildren(emptyState('No apps published yet', 'New apps will appear here as soon as they are added.'));
      } else {
        lList.replaceChildren.apply(lList, latest.map(function (a) {
          var d = formatDate(a.updatedDate) || formatDate(a.releaseDate);
          var label = d ? (a.updatedDate && formatDate(a.updatedDate) ? 'Updated ' : 'Released ') + d : (a.category || '');
          return h('li', null, h('a', { class: 'latest-item', href: appUrl(a) },
            appIcon(a, 48),
            h('span', { class: 'latest-item__body' }, h('strong', null, a.name), h('span', null, a.shortDescription || '')),
            h('span', { class: 'latest-item__meta' }, label), icon('arrow', 18)));
        }));
      }
    }

    // Categories (only those used by real apps)
    var cSec = $('#categories'), cGrid = $('#categories-grid');
    if (cSec && cGrid) {
      var cats = categoriesOf(APPS);
      if (!cats.length) { cGrid.replaceChildren(emptyState('No categories yet', 'Categories appear automatically once apps are added.')); }
      else cGrid.replaceChildren.apply(cGrid, cats.map(function (c) {
        return h('a', { class: 'cat-card', href: BASE + 'apps.html?category=' + encodeURIComponent(c.name) },
          h('span', { class: 'cat-card__icon' }, icon(categoryIcon(c.name), 24)),
          h('span', null, h('strong', null, c.name), h('span', { class: 'count' }, c.count + (c.count === 1 ? ' app' : ' apps'))));
      }));
    }
  };

  /* ---------------- PAGE: all apps ---------------- */
  pages.apps = function () {
    var grid = $('#apps-grid'), form = $('#filters'), qIn = $('#q'), catSel = $('#category'), sortSel = $('#sort');
    var clearBtn = $('#clear-filters'), count = $('#results-count');
    if (!grid || !form) return;
    var cats = categoriesOf(APPS);
    cats.forEach(function (c) { catSel.append(h('option', { value: c.name }, c.name + ' (' + c.count + ')')); });

    var params = new URLSearchParams(window.location.search);
    var q0 = (params.get('q') || '').slice(0, 80);
    var c0 = params.get('category') || '';
    var s0 = params.get('sort') || 'latest';
    qIn.value = q0;
    catSel.value = cats.some(function (c) { return c.name === c0; }) ? c0 : '';
    sortSel.value = ['latest', 'name-asc', 'name-desc'].indexOf(s0) !== -1 ? s0 : 'latest';

    function state() { return { q: qIn.value.trim().slice(0, 80), category: catSel.value, sort: sortSel.value }; }

    function render() {
      var st = state();
      var found = filterApps(APPS, st);
      var filtered = !!(st.q || st.category);
      clearBtn.hidden = !filtered && st.sort === 'latest';

      var qs = new URLSearchParams();
      if (st.q) qs.set('q', st.q);
      if (st.category) qs.set('category', st.category);
      if (st.sort !== 'latest') qs.set('sort', st.sort);
      try { window.history.replaceState(null, '', window.location.pathname + (qs.toString() ? '?' + qs.toString() : '')); } catch (e) { /* not allowed on file:// – ignore */ }

      if (!APPS.length) {
        count.textContent = '';
        grid.replaceChildren(emptyState('No apps published yet', 'Check back soon – new Android apps will be listed here.'));
        return;
      }
      count.textContent = 'Showing ' + found.length + ' of ' + APPS.length + (APPS.length === 1 ? ' app' : ' apps');
      if (!found.length) {
        var btn = h('button', { class: 'btn btn--secondary', type: 'button' }, 'Clear filters');
        btn.addEventListener('click', clearAll);
        grid.replaceChildren(emptyState('No apps match your search', 'Try a different word, or remove the category filter.', btn));
        return;
      }
      grid.replaceChildren.apply(grid, found.map(appCard));
    }
    function clearAll() { qIn.value = ''; catSel.value = ''; sortSel.value = 'latest'; render(); qIn.focus(); }

    form.addEventListener('submit', function (e) { e.preventDefault(); render(); });
    qIn.addEventListener('input', render);
    catSel.addEventListener('change', render);
    sortSel.addEventListener('change', render);
    clearBtn.addEventListener('click', clearAll);
    render();
  };

  /* ---------------- PAGE: contact ---------------- */
  pages.contact = function () {
    var email = isEmail(CFG.email) ? CFG.email.trim() : '';
    var list = $('#contact-methods');
    var items = [];
    if (email) items.push(h('li', null, h('a', { href: 'mailto:' + email }, icon('mail', 20), email)));
    socialLinks().forEach(function (s) {
      items.push(h('li', null, h('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer' }, icon('link', 20), s.label, h('span', { class: 'visually-hidden' }, ' (opens in a new tab)'))));
    });
    if (list) {
      if (items.length) list.replaceChildren.apply(list, items);
      else list.replaceWith(h('div', { class: 'notice notice--warn' }, icon('alert'), h('p', null, 'Contact details have not been set up yet. The site owner can add an email address and social links in assets/js/config.js.')));
    }

    var form = $('#contact-form'), status = $('#form-status');
    if (!form) return;
    var fieldset = $('fieldset', form);
    if (!email) {
      fieldset.disabled = true;
      status.replaceChildren(h('div', { class: 'notice notice--warn' }, icon('alert'), h('p', null, 'The contact form is switched off until an email address is added in assets/js/config.js.')));
    }
    function clean(v, max, multiline) {
      var s = String(v || '').replace(multiline ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, ' ').trim();
      return s.slice(0, max);
    }
    function setErr(id, msg) {
      var input = $('#' + id), err = $('#' + id + '-error');
      err.textContent = msg || '';
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
      return !msg;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!email) return;
      var name = clean($('#cf-name').value, 80), from = clean($('#cf-email').value, 120), subject = clean($('#cf-subject').value, 100), message = clean($('#cf-message').value, 2000, true);
      var ok = [
        setErr('cf-name', name ? '' : 'Please enter your name.'),
        setErr('cf-email', isEmail(from) ? '' : 'Please enter a valid email address.'),
        setErr('cf-message', message.length >= 10 ? '' : 'Please write a message of at least 10 characters.')
      ].every(Boolean);
      if (!ok) { var firstBad = $('[aria-invalid="true"]', form); if (firstBad) firstBad.focus(); return; }
      var body = message + '\n\n— ' + name + ' (' + from + ')';
      var href = 'mailto:' + email + '?subject=' + encodeURIComponent('[' + SITE_NAME + '] ' + (subject || 'Website message')) + '&body=' + encodeURIComponent(body);
      status.replaceChildren(h('div', { class: 'notice notice--ok', role: 'status' }, icon('check'),
        h('p', null, 'Your email app should open with the message ready to send. If nothing happens, write to us directly at ', h('a', { href: 'mailto:' + email }, email), '.')));
      window.location.href = href;
    });
  };

  /* ---------------- Start ---------------- */
  function init() {
    buildHeader();
    buildFooter();
    initTheme();
    buildSearch();
    fillConfig();
    if (pages[PAGE]) pages[PAGE]();
    initAds();
  }

  window.VJD = {
    CFG: CFG, APPS: APPS, BASE: BASE, pages: pages,
    h: h, $: $, $$: $$, icon: icon, categoryIcon: categoryIcon,
    isHttpsUrl: isHttpsUrl, isPlayStoreUrl: isPlayStoreUrl, isConfigured: isConfigured, assetUrl: assetUrl,
    hasApk: hasApk, hasPlay: hasPlay, hasDownload: hasDownload, formatDate: formatDate, appIcon: appIcon, appCard: appCard,
    appUrl: appUrl, emptyState: emptyState, setMeta: setMeta, filterApps: filterApps, categoriesOf: categoriesOf
  };

  // Scripts are loaded with "defer", so wait for DOMContentLoaded (it fires after app-details.js has registered itself).
  if (document.readyState === 'complete') init(); else document.addEventListener('DOMContentLoaded', init);
})();
