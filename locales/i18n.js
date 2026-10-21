const messages = require('./messages.en.json');
const { createSeo } = require('../seo');
function viewLocals(originalUrl) {
  const url = new URL(originalUrl || '/', 'http://local');
  const lang = /^\/en(?:\/|$)/.test(url.pathname) ? 'en' : 'th';
  const routePath = url.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  const pathname = routePath === '/send' ? '/contactus' : routePath;
  const prefix = lang === 'en' ? '/en' : '';
  return {
    lang, prefix, seo: createSeo(originalUrl), categoryImages: require('../seo/image-manifest.json'),
    countProducts: function (count) { return count + ' ' + (lang === 'en' ? (count === 1 ? 'product' : 'products') : 'รายการ'); },
    t: function (text) { return lang === 'en' && Object.prototype.hasOwnProperty.call(messages, text) ? messages[text] : text; },
    localePath: function (path) { return prefix + path; },
    languageUrl: function (target) { return (target === 'en' ? '/en' : '') + pathname + url.search; },
  };
}
function middleware(req, res, next) {
  const locals = viewLocals(req.originalUrl);
  Object.assign(res.locals, locals);
  if (locals.lang === 'en') req.url = req.url.replace(/^\/en(?=\/|\?|$)/, '') || '/';
  if (req.url[0] === '?') req.url = '/' + req.url;
  next();
}
module.exports = { viewLocals, middleware };
