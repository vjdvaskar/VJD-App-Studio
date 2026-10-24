/* ==========================================================================
   VJD App Studio – APP DATA  (this is the only file you edit to manage apps)

   HOW TO ADD AN APP
   1. Copy one of the blocks below, paste it after the last one (keep the comma between blocks).
   2. Change the values. Leave anything you don't know as '' (text), null (dates) or [] (lists).
      Empty fields are simply hidden on the website – nothing is invented.
   3. Copy templates/app-page.html to apps/<your-slug>.html and replace the word YOUR-APP-SLUG inside it
      (the file name and the slug below must match exactly).
   4. Add the new page to sitemap.xml.

   HOW TO EDIT: change the values and save.
   HOW TO REMOVE: delete the whole block, delete apps/<slug>.html, and delete its line in sitemap.xml.

   FIELD GUIDE
   id                 Unique number or text, e.g. 'driving-theory'
   name               App name shown everywhere
   slug               Lowercase letters, numbers and hyphens only. Becomes apps/<slug>.html
   shortDescription   1 sentence, shown on cards
   fullDescription    Longer text. Use a blank line between paragraphs.
   icon               Path relative to the site root, e.g. 'assets/images/apps/driving-theory/icon.png'
                      ('' = a coloured letter tile is shown instead)
   screenshots        List of image paths, e.g. ['assets/images/apps/driving-theory/shot-1.png']
   category           Education, Health & Fitness, Productivity, Tools, Lifestyle, Entertainment (or your own)
   version            e.g. '1.0.0'
   fileSize           e.g. '12.4 MB'  (only if you know it)
   minAndroidVersion  e.g. 'Android 8.0'
   releaseDate        'YYYY-MM-DD' or null
   updatedDate        'YYYY-MM-DD' or null
   features           List of short feature sentences
   apkUrl             Public HTTPS link to the APK file, or ''
   playStoreUrl       Official Google Play link (https://play.google.com/store/apps/details?id=...), or ''
   privacyPolicyUrl   The app's own privacy policy (HTTPS link), or ''
   featured           true shows the app in "Featured Apps" on the home page
   packageName        e.g. 'com.yourname.drivingtheory', or ''
   ========================================================================== */
window.VJD_APPS = [
  {
    id: 'driving-theory',
    name: 'Driving Theory',
    slug: 'driving-theory',
    // TODO(owner): replace with your real description. This short line is only inferred from the app name.
    shortDescription: 'An Android app by VJD App Studio for learning and practising driving theory.',
    fullDescription: '',   // TODO(owner): write the full description
    icon: '',              // TODO(owner): e.g. 'assets/images/apps/driving-theory/icon.png'
    screenshots: [],       // TODO(owner): add real screenshots when you have them
    category: 'Education', // TODO(owner): confirm the category
    version: '',           // TODO(owner)
    fileSize: '',
    minAndroidVersion: '',
    releaseDate: null,     // TODO(owner): 'YYYY-MM-DD'
    updatedDate: null,     // TODO(owner): 'YYYY-MM-DD'
    features: [],          // TODO(owner): list the real features
    apkUrl: '',            // TODO(owner): public HTTPS link to your APK (see README)
    playStoreUrl: '',      // TODO(owner): official Google Play link, if published
    privacyPolicyUrl: '',  // TODO(owner): the app's own privacy policy link
    featured: true,
    packageName: ''        // TODO(owner): e.g. 'com.yourname.drivingtheory'
  },
  {
    id: 'pulsesphere',
    name: 'PulseSphere',
    slug: 'pulsesphere',
    // TODO(owner): describe what PulseSphere does. Nothing has been assumed here.
    shortDescription: 'An Android app by VJD App Studio.',
    fullDescription: '',
    icon: '',
    screenshots: [],
    category: 'Tools',     // TODO(owner): PLACEHOLDER category – change to the real one
    version: '',
    fileSize: '',
    minAndroidVersion: '',
    releaseDate: null,
    updatedDate: null,
    features: [],
    apkUrl: '',
    playStoreUrl: '',
    privacyPolicyUrl: '',
    featured: true,
    packageName: ''
  }
];
