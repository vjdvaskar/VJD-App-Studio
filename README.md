# VJD App Studio – Website

A free, static website for showcasing your Android apps. Plain HTML, CSS and JavaScript: no build step, no database, no API keys, no paid hosting.

## 1. How it works (architecture)

```
vjd-app-studio/
  index.html            Home (hero, featured, latest, categories, why choose, call to action)
  apps.html             All Apps directory (search, category filter, sort)
  about.html            About Us
  contact.html          Contact (email/social from config; form opens your email app)
  privacy-policy.html   Privacy Policy TEMPLATE  (review before publishing!)
  terms.html            Terms and Conditions TEMPLATE  (review before publishing!)
  robots.txt  sitemap.xml
  apps/
    driving-theory.html   One small page per app (just points at its data)
    pulsesphere.html
  templates/app-page.html Copy this to create a new app page
  assets/
    js/config.js        <-- YOUR SETTINGS: domain, email, social links, ads
    js/apps.js          <-- YOUR APPS: the only file you edit to manage apps
    js/main.js          Shared code (header, footer, search, theme, cards, filters, contact form)
    js/app-details.js   Builds each app details page from apps.js
    css/style.css       All styling (light + dark mode)
    images/             logo.svg, favicon.svg, default-app-icon.svg, og-image.png
```

Every app page loads `apps.js`, finds the record whose `slug` matches the page, and builds the details. If a field is empty in `apps.js`, it is hidden. Nothing is invented.

Preview on your computer: double-click `index.html`, or run `python3 -m http.server` in this folder and open http://localhost:8000.

## 2. What you must provide (not invented)

Open `assets/js/apps.js` and search for `TODO(owner)`. Missing for **both** apps:

- Real description, features, version, file size, minimum Android version
- Release and updated dates (`'YYYY-MM-DD'`)
- App icon and screenshots (images you own)
- APK link and/or Google Play link; the app's own privacy policy link; package name
- PulseSphere's category is a **placeholder** ("Tools") – set the real one. Driving Theory's "Education" and both short descriptions are inferred from the names only.

Until a valid link exists, the app page shows "Download not available yet" and no download buttons appear.

Also in `assets/js/config.js`: your email (contact page, legal pages) and any social links. Empty = hidden.

## 3. Add, edit and remove apps

**Add:** (1) copy a `{ ... }` block in `apps.js`, add a comma, change the values, choose a unique lowercase `slug` (e.g. `my-new-app`). (2) Copy `templates/app-page.html` to `apps/my-new-app.html` and replace `YOUR-APP-SLUG` and `YOUR APP NAME`. (3) Add `<url><loc>https://YOUR-DOMAIN.example/apps/my-new-app.html</loc></url>` to `sitemap.xml`.

**Edit:** change values in `apps.js`, save, re-upload.

**Remove:** delete its block in `apps.js`, delete `apps/<slug>.html`, delete its line in `sitemap.xml`.

Images: put them in e.g. `assets/images/apps/my-new-app/` and use paths like `'assets/images/apps/my-new-app/icon.png'` (square PNG/WebP, ~512×512; screenshots under ~300 KB each).

## 4. Adding real download links

- **Google Play** (recommended): `playStoreUrl: 'https://play.google.com/store/apps/details?id=com.yourname.app'`. Only play.google.com links are accepted.
- **APK**: `apkUrl: 'https://...'` must be a public `https://` link that downloads the file. Invalid or `http://` links are hidden and an error is shown instead.

Where to host the APK: don't commit big APKs into the website repo (GitHub's browser upload limit is about 25 MB per file; Cloudflare Pages also limits file size). Good free options:
1. **GitHub Releases** – create a Release in your repo, attach the APK, copy the "download" link (`https://github.com/USER/REPO/releases/download/v1.0/app.apk`).
2. Object storage (e.g. Cloudflare R2) or another file host – check its current free tier and terms.

Only distribute apps you own or have permission to distribute. The site shows an APK safety notice next to every APK button and downloads start only on click.

## 5. Set your real domain

Your address is unknown until you deploy (e.g. `https://yourname.github.io/vjd-app-studio` or `https://vjd-app-studio.pages.dev`, or a custom domain). Then:

1. In your editor use **Find & Replace in all files** (VS Code: Ctrl+Shift+H) and replace `https://YOUR-DOMAIN.example` with your real address (no trailing slash). This updates canonical links, social previews, `robots.txt` and `sitemap.xml`.
2. Set the same address as `siteUrl` in `assets/js/config.js`.
3. Optional: submit `sitemap.xml` in Google Search Console.

## 6. Advertising (optional, off by default)

The pages contain labelled, hidden ad areas (home, apps list, app pages). No ad code runs until you set `ads.enabled: true`, a real `publisherId` and per-area slot IDs in `config.js`. Ad areas are kept away from download buttons to avoid accidental clicks. AdSense approval is **not guaranteed**; it depends on Google's current policies, your content quality and eligibility. If you serve visitors in regions that require consent (e.g. EU/UK), you must add a consent mechanism and update the Privacy Policy.

## 7. Deploy for free

### A. GitHub Pages
1. Create a free account at github.com → **New repository** → name it `vjd-app-studio`, Public → Create.
2. Click **uploading an existing file**, drag in the **contents** of this folder (so `index.html` is at the top level; include `.nojekyll`), then **Commit changes**.
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch `main`, folder `/ (root)` → Save.
4. After a minute your site is at `https://YOUR-USERNAME.github.io/vjd-app-studio/`. (All links are relative, so the sub-folder address works.)

### B. Cloudflare Pages
1. Do step A1–A2 first (code in GitHub). Create a free account at dash.cloudflare.com.
2. **Workers & Pages → Create → Pages → Connect to Git**, authorize GitHub, choose the repo.
3. Build settings: Framework preset **None**, Build command **empty**, Output directory **`/`** (or leave blank). **Save and Deploy**.
4. Your site appears at `https://PROJECT-NAME.pages.dev`. Every later GitHub commit redeploys automatically.
(Cloudflare's menu names change occasionally; follow its on-screen wording.)

### C. Test the published site
Open every page; use the search button and All Apps search/filter; toggle dark mode and reload; resize to phone width; click each app's buttons; open `/robots.txt` and `/sitemap.xml`; test a real download link from a phone.

### D. Custom domain (later)
Buy a domain from any registrar, then GitHub: **Settings → Pages → Custom domain**; Cloudflare: project → **Custom domains → Set up**. Follow the DNS instructions shown, wait for HTTPS, then redo section 5 with the new address.

## 8. Pre-publish checklist

- [ ] `apps.js`: all `TODO(owner)` items done; categories correct; dates real
- [ ] Real icons/screenshots added (or leave empty)
- [ ] At least one valid Google Play or APK link per app you want downloadable; test on a phone
- [ ] Each app has its own privacy policy link (Google Play requires one)
- [ ] `config.js`: email (and optional social links) set
- [ ] Domain replaced everywhere (section 5)
- [ ] Privacy Policy and Terms customized (all highlighted items), reviewed by you/a professional; review notice removed
- [ ] Remove from `sitemap.xml` any page you don't want public
- [ ] Every page and button tested on the live site, mobile and desktop
- [ ] Only apps you have the right to distribute are listed

Security note: the site avoids `innerHTML` for app data, validates links and uses `rel="noopener noreferrer"`; this reduces risk but is not a guarantee of complete security.
