/* ==========================================================================
   VJD App Studio – SITE SETTINGS
   Edit the values below. Leave a value as '' (empty) to hide that feature.
   Nothing here is secret: this file is public once the site is published.
   ========================================================================== */
window.VJD_CONFIG = {
  siteName: 'VJD App Studio',

  // Your real website address, WITHOUT a trailing slash.
  // Example: 'https://vjdappstudio.pages.dev'  or  'https://yourname.github.io/vjd-app-studio'
  // Used for canonical links and structured data. Keep the placeholder until you know your address.
  siteUrl: 'https://YOUR-DOMAIN.example',

  // Your public contact email. Left empty on purpose – add your own.
  // Example: 'hello@yourdomain.com'
  email: '',

  // Social profile links. Only filled-in links are shown. Must start with https://
  social: {
    github: '',
    youtube: '',
    x: '',
    facebook: '',
    instagram: '',
    telegram: '',
    linkedin: ''
  },

  // Google AdSense (OFF by default – the site works fully without ads).
  // To turn on later: set enabled to true, add your publisher ID (looks like 'ca-pub-1234567890123456')
  // and the numeric ad-unit ID for each placement you want. See README.md > "Advertising".
  ads: {
    enabled: false,
    publisherId: '',
    slots: {
      'home-mid': '',
      'apps-bottom': '',
      'app-mid': '',
      'app-sidebar': ''
    }
  }
};
