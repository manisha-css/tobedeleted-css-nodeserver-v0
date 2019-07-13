const i18n = require('i18n');
// i18n
i18n.configure({
  // setup some locales - other locales default to en silently
  locales: ['en', 'fr'],

  // where to store json files - defaults to './locales' relative to modules directory
  directory: 'i18n/locales',

  defaultLocale: 'en'
});

module.exports = i18n;
