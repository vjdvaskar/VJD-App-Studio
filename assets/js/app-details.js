/* ==========================================================================
   VJD App Studio – app-details.js
   Builds an app details page from the matching record in apps.js.
   Each page in /apps/ only needs <body data-page="app" data-app="THE-SLUG">.
   Fields that are empty in apps.js are simply not shown.
   ========================================================================== */
(function () {
  'use strict';
  var V = window.VJD;
  if (!V) return;
  var h = V.h, icon = V.icon;
  var SITE = V.CFG.siteName || 'VJD App Studio';

  var SCHEMA_CATEGORY = {
    'education': 'EducationalApplication', 'health & fitness': 'HealthApplication', 'productivity': 'BusinessApplication',
    'tools': 'UtilitiesApplication', 'lifestyle': 'LifestyleApplication', 'entertainment': 'EntertainmentApplication'
  };

  function pageUrl(app) {
    return V.isConfigured(V.CFG.siteUrl) ? V.CFG.siteUrl.replace(/\/+$/, '') + '/apps/' + app.slug + '.html' : '';
  }

  function updateMeta(app) {
    var title = app.name + ' – Android App | ' + SITE;
    var desc = (app.shortDescription || (app.name + ' is an Android app by ' + SITE + '.')).slice(0, 200);
    document.title = title;
    V.setMeta('meta[name="description"]', 'content', desc);
    V.setMeta('meta[property="og:title"]', 'content', title);
    V.setMeta('meta[property="og:description"]', 'content', desc);
    var url = pageUrl(app);
    if (url) {
      V.setMeta('link[rel="canonical"]', 'href', url);
      V.setMeta('meta[property="og:url"]', 'content', url);
    }
  }

  function addStructuredData(app) {
    var data = {
      '@context': 'https://schema.org',
      '@type': 'MobileApplication',
      name: app.name,
      operatingSystem: 'ANDROID',
      author: { '@type': 'Organization', name: SITE }
    };
    var cat = SCHEMA_CATEGORY[String(app.category || '').toLowerCase()];
    if (cat) data.applicationCategory = cat;
    if (app.shortDescription) data.description = app.shortDescription;
    if (app.version) data.softwareVersion = app.version;
    if (app.fileSize) data.fileSize = app.fileSize;
    if (app.minAndroidVersion) data.requirements = app.minAndroidVersion;
    if (V.formatDate(app.releaseDate)) data.datePublished = app.releaseDate;
    if (V.formatDate(app.updatedDate)) data.dateModified = app.updatedDate;
    if (V.hasApk(app)) data.downloadUrl = app.apkUrl.trim();
    if (V.hasPlay(app)) data.installUrl = app.playStoreUrl.trim();
    var url = pageUrl(app);
    if (url) data.url = url;
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.append(script);
  }

  function adSlot(name) {
    return h('aside', { class: 'ad-slot', 'data-ad-slot': name, 'aria-label': 'Advertisement', hidden: true });
  }

  /* ---- Download section: Google Play and/or APK, with safety notice ---- */
  function downloadBox(app) {
    var apk = V.hasApk(app), play = V.hasPlay(app);
    var box = h('section', { class: 'panel download-box', id: 'download', 'aria-labelledby': 'download-title' }, h('h2', { id: 'download-title' }, 'Download'));

    if (!apk && !play) {
      var invalid = (app.apkUrl && !apk) || (app.playStoreUrl && !play);
      box.append(h('div', { class: 'notice notice--error', role: 'alert' }, icon('alert'),
        h('div', null,
          h('p', null, h('strong', null, 'Download not available yet.')),
          h('p', null, invalid
            ? 'A download link was added for this app, but it is not a valid link, so it has been hidden for your safety.'
            : 'No download link has been added for this app yet. Please check back soon.'))));
      return box;
    }

    if (play) {
      box.append(h('div', { class: 'actions' },
        h('div', null,
          h('a', { class: 'btn btn--primary btn--lg btn--block', href: app.playStoreUrl.trim(), target: '_blank', rel: 'noopener noreferrer' },
            icon('play', 20), 'Get it on Google Play', h('span', { class: 'visually-hidden' }, ' (opens in a new tab)')),
          h('small', null, 'Recommended: installs and updates through Google Play.'))));
    }

    if (apk) {
      var notice = h('div', { class: 'notice notice--warn', role: 'note' }, icon('shield'),
        h('div', null,
          h('p', null, h('strong', null, 'APK safety notice')),
          h('ul', null,
            h('li', null, 'Only install APK files from sources you trust. This file is provided by ' + SITE + ' and may be hosted on an external file service.'),
            h('li', null, 'Android may ask you to allow “Install unknown apps” for your browser or file manager. Allow it only for the app you are using, and turn it off again after installing.'),
            app.packageName ? h('li', null, 'After installing, the app’s package name should be ' + app.packageName + '.') : null,
            play ? h('li', null, 'Google Play (above) is the recommended way to install this app.') : h('li', null, 'If this app becomes available on Google Play, installing from there is recommended.')
          )));
      var label = 'Download APK' + (app.fileSize ? ' (' + app.fileSize + ')' : '');
      box.append(notice, h('div', { class: 'actions' },
        h('div', null,
          h('a', { class: 'btn btn--lg btn--block ' + (play ? 'btn--secondary' : 'btn--primary'), href: app.apkUrl.trim(), target: '_blank', rel: 'noopener noreferrer' },
            icon('download', 20), label, h('span', { class: 'visually-hidden' }, ' (opens in a new tab)')),
          h('small', null, 'The download starts only when you click this button.'))));
    }
    return box;
  }

  /* ---- Screenshots with simple lightbox ---- */
  function screenshots(app) {
    var urls = (Array.isArray(app.screenshots) ? app.screenshots : []).map(V.assetUrl).filter(Boolean);
    if (!urls.length) return null;
    var dialog = h('dialog', { class: 'lightbox', 'aria-label': app.name + ' screenshot' });
    var big = h('img', { alt: '' });
    var closeBtn = h('button', { class: 'btn btn--light btn--sm', type: 'button' }, icon('close', 16), 'Close');
    dialog.append(big, closeBtn);
    function close() { if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open'); }
    closeBtn.addEventListener('click', close);
    dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); });

    var gallery = h('div', { class: 'gallery', role: 'list', 'aria-label': app.name + ' screenshots' }, urls.map(function (u, i) {
      var alt = app.name + ' screenshot ' + (i + 1);
      var img = h('img', { src: u, alt: alt, loading: 'lazy', decoding: 'async' });
      img.addEventListener('error', function () { img.closest('button').hidden = true; });
      var btn = h('button', { type: 'button', role: 'listitem', 'aria-label': 'Enlarge ' + alt }, img);
      btn.addEventListener('click', function () {
        big.src = u; big.alt = alt;
        if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
      });
      return btn;
    }));
    return h('section', { class: 'panel', 'aria-labelledby': 'shots-title' }, h('h2', { id: 'shots-title' }, 'Screenshots'), gallery, dialog);
  }

  function infoPanel(app) {
    var priv = V.isHttpsUrl(app.privacyPolicyUrl)
      ? h('a', { href: app.privacyPolicyUrl.trim(), target: '_blank', rel: 'noopener noreferrer' }, 'Privacy Policy ↗')
      : h('a', { href: V.BASE + 'privacy-policy.html' }, 'Website privacy policy');
    var rows = [
      ['Developer', SITE],
      ['Category', app.category],
      ['Version', app.version],
      ['File size', app.fileSize],
      ['Requires', app.minAndroidVersion],
      ['Package', app.packageName],
      ['Released', V.formatDate(app.releaseDate)],
      ['Last updated', V.formatDate(app.updatedDate)],
      ['Privacy', priv]
    ].filter(function (r) { return r[1]; });
    return h('section', { class: 'panel', 'aria-labelledby': 'info-title' }, h('h2', { id: 'info-title' }, 'App information'),
      h('dl', { class: 'spec-list' }, rows.map(function (r) { return h('div', null, h('dt', null, r[0]), h('dd', null, r[1])); })),
      V.isHttpsUrl(app.privacyPolicyUrl) ? null : h('p', { class: 'muted', style: 'font-size:.85rem;margin-top:12px' }, 'An app-specific privacy policy has not been added yet.'));
  }

  V.pages.app = function () {
    var root = document.getElementById('app-root');
    if (!root) return;
    var slug = document.body.getAttribute('data-app');
    var app = V.APPS.filter(function (a) { return a.slug === slug; })[0];

    if (!app) {
      document.title = 'App not found | ' + SITE;
      root.replaceChildren(V.emptyState('App not found', 'This app is not listed in assets/js/apps.js (or the page name does not match its slug).',
        h('a', { class: 'btn btn--primary', href: V.BASE + 'apps.html' }, 'Browse all apps')));
      return;
    }

    updateMeta(app);
    addStructuredData(app);

    var paragraphs = String(app.fullDescription || app.shortDescription || '').split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
    var features = (Array.isArray(app.features) ? app.features : []).filter(function (f) { return typeof f === 'string' && f.trim(); });

    var heroActions = [];
    if (V.hasDownload(app)) heroActions.push(h('a', { class: 'btn btn--primary btn--lg', href: '#download' }, icon('download', 20), 'Download'));
    heroActions.push(h('a', { class: 'btn btn--secondary btn--lg', href: V.BASE + 'apps.html' }, 'Browse all apps'));

    var shots = screenshots(app);

    root.replaceChildren(
      h('nav', { class: 'breadcrumb', 'aria-label': 'Breadcrumb' }, h('ol', null,
        h('li', null, h('a', { href: V.BASE + 'index.html' }, 'Home')),
        h('li', null, h('a', { href: V.BASE + 'apps.html' }, 'All Apps')),
        h('li', { 'aria-current': 'page' }, app.name))),
      h('header', { class: 'app-hero' },
        V.appIcon(app, 112),
        h('div', { class: 'app-hero__body' },
          h('h1', null, app.name),
          app.shortDescription ? h('p', null, app.shortDescription) : null,
          h('div', { class: 'chip-row' },
            app.category ? h('span', { class: 'chip' }, icon(V.categoryIcon(app.category), 14), app.category) : null,
            app.version ? h('span', { class: 'chip' }, 'Version ' + app.version) : null,
            app.featured ? h('span', { class: 'badge badge--featured' }, icon('star', 13), 'Featured') : null),
          h('div', { class: 'app-hero__actions' }, heroActions))),
      h('div', { class: 'app-layout' },
        h('div', null,
          h('section', { class: 'panel', 'aria-labelledby': 'about-title' }, h('h2', { id: 'about-title' }, 'About this app'),
            paragraphs.length ? paragraphs.map(function (p) { return h('p', null, p); }) : h('p', { class: 'muted' }, 'A full description has not been added yet.')),
          features.length ? h('section', { class: 'panel', 'aria-labelledby': 'features-title' }, h('h2', { id: 'features-title' }, 'Key features'),
            h('ul', { class: 'feature-list' }, features.map(function (f) { return h('li', null, icon('check', 18), h('span', null, f)); }))) : null,
          adSlot('app-mid'),
          shots,
          downloadBox(app)),
        h('aside', { 'aria-label': 'App information' }, infoPanel(app), adSlot('app-sidebar')))
    );
  };
})();
