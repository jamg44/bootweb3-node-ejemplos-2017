'use strict';
const i18n = require('i18n');
const path = require('path');

module.exports = function(defaultLocale) {

  defaultLocale = defaultLocale || process.env.NODE_LANG || 'en';
  
  i18n.configure({
    directory: path.join(__dirname, '..', 'locales'),
    locales: ['en', 'es'],
    defaultLocale: defaultLocale,
    syncFiles: true,
    //objectNotation: true,
    queryParameter: 'lang',
    register: global,
    cookie: 'nodeapi-lang'
  });
  i18n.setLocale(defaultLocale);
  return i18n;
}
