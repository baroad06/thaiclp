const content = require('./content.json');
const catalog = require('../product/catalog-model');
const DEFAULT_ORIGIN = 'https://thaictp.com';
function configuration(env = process.env) {
  const site = new URL(env.SITE_URL || DEFAULT_ORIGIN);
  if (site.protocol !== 'https:' || site.username || site.password || site.pathname !== '/' || site.search || site.hash) {
    throw new Error('SITE_URL must be an HTTPS origin without a path, credentials or query.');
  }
  return {
    siteUrl: site.origin,
    indexable: env.SEO_INDEXABLE === 'true' || (env.SEO_INDEXABLE !== 'false' && env.NODE_ENV === 'production'),
  };
}
function resolve(originalUrl) {
  const url = new URL(originalUrl || '/', 'http://local');
  const lang = /^\/en(?:\/|$)/.test(url.pathname) ? 'en' : 'th';
  let path = url.pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '') || '/';
  const submission = path === '/send';
  if (submission) path = '/contactus';
  const queryCategory = url.searchParams.get('category');
  const categories = catalog.catalogView('', '', lang).categories;
  const category = categories.find(item => '/product/' + item.url === path || (path === '/product' && item.url === queryCategory));
  const search = url.searchParams.getAll('q').some(value => value.trim());
  if (category) path = '/product/' + category.url;
  return { lang, path, category, search, submission, url };
}
function localeUrl(origin, path, lang) { return origin + (lang === 'en' ? '/en' : '') + (path === '/' ? '/' : path); }
function createSeo(originalUrl, options = configuration()) {
  const state = resolve(originalUrl);
  const { lang, path, category } = state;
  const origin = options.siteUrl;
  const fallback = content.pages['/product'][lang];
  const page = content.pages[path] && content.pages[path][lang];
  const brand = lang === 'en' ? 'Thai Chonlatharn Plas' : 'ไทยชลธาร พลาส';
  const label = category ? category.label : (page || fallback).label;
  const title = category ? category.label + ' | ' + brand : (page || fallback).title;
  const description = category ? content.categories[category.url][lang] : (page || fallback).description;
  const canonical = localeUrl(origin, path, lang);
  const known = Boolean(category || page);
  const robots = options.indexable && known && !state.search && !state.submission ? 'index,follow' : 'noindex,follow';
  const alternates = ['th', 'en', 'x-default'].map(language => ({ language, url: localeUrl(origin, path, language === 'en' ? 'en' : 'th') }));
  const breadcrumbs = [{ label: content.pages['/'][lang].label, url: localeUrl(origin, '/', lang) }];
  if (category) breadcrumbs.push({ label: content.pages['/product'][lang].label, url: localeUrl(origin, '/product', lang) });
  if (path !== '/') breadcrumbs.push({ label, url: canonical });
  const graph = [];
  if (path === '/') {
    graph.push({
      '@type': 'Organization', '@id': origin + '/#organization', url: origin + '/',
      name: 'บริษัท ไทยชลธาร พลาส จำกัด', alternateName: 'Thai Chonlatharn Plas Co., Ltd.',
      logo: origin + '/images/logo.png', telephone: '+66-2-451-1785', email: 'boonchuay@thaictp.com',
      address: { '@type': 'PostalAddress', streetAddress: '13 Soi Thian Thale 26 Yaek 2, Tha Kham', addressLocality: 'Bang Khun Thian', addressRegion: 'Bangkok', postalCode: '10150', addressCountry: 'TH' },
    });
    graph.push({ '@type': 'WebSite', '@id': origin + '/#website', url: origin + '/', name: brand, inLanguage: ['th', 'en'], publisher: { '@id': origin + '/#organization' } });
  } else if (known) {
    graph.push({ '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: item.url })) });
  }
  return {
    title, description, heading: category ? category.label : (page || fallback).heading,
    canonical, alternates, robots, breadcrumbs, categorySummary: category ? description : '',
    image: origin + (category ? '/images/catalog/' + category.url + '/cover.jpg' : '/images/index/cover.jpg'),
    imageAlt: category ? category.label : brand,
    brand, ogLocale: lang === 'en' ? 'en_US' : 'th_TH', ogAlternate: lang === 'en' ? 'th_TH' : 'en_US',
    jsonLd: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c'),
  };
}
function canonicalPaths() { return Object.keys(content.pages).filter(path => path !== '/product').concat(catalog.categories.map(item => '/product/' + item.url)); }
function escapeXml(value) { return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;'); }
function sitemap(config = configuration()) {
  const entries = canonicalPaths().flatMap(path => ['th', 'en'].map(lang => '<url><loc>' + escapeXml(localeUrl(config.siteUrl, path, lang)) + '</loc></url>'));
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries.join('\n') + '\n</urlset>\n';
}
function robots(config = configuration()) {
  return config.indexable ? 'User-agent: *\nAllow: /\nSitemap: ' + config.siteUrl + '/sitemap.xml\n' : 'User-agent: *\nAllow: /\n';
}
function redirectTarget(originalUrl) {
  const state = resolve(originalUrl);
  const rawPath = state.url.pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '') || '/';
  if (rawPath === '/product' && !state.search) {
    const params = new URLSearchParams(state.url.search);
    params.delete('category'); params.delete('q');
    return (state.lang === 'en' ? '/en' : '') + '/product/' + (state.category || catalog.categories[0]).url + (params.size ? '?' + params.toString() : '');
  }
  // Consolidate trailing slashes; English home deliberately uses /en/.
  if (state.url.pathname === '/en') return '/en/' + state.url.search;
  if (state.url.pathname.endsWith('/') && rawPath !== '/') return state.url.pathname.replace(/\/$/, '') + state.url.search;
  return null;
}
function middleware(req, res, next) {
  const config = configuration();
  if (!config.indexable) res.set('X-Robots-Tag', 'noindex, follow');
  const requestUrl = new URL(req.originalUrl, 'http://local');
  const canonicalHost = new URL(config.siteUrl).hostname;
  if (config.indexable && req.hostname === 'www.' + canonicalHost) return res.redirect(req.method === 'GET' || req.method === 'HEAD' ? 301 : 308, config.siteUrl + requestUrl.pathname + requestUrl.search);
  if (req.method === 'GET' || req.method === 'HEAD') {
    const redirect = redirectTarget(req.originalUrl);
    if (redirect) return res.redirect(301, redirect);
  }
  next();
}
module.exports = { configuration, createSeo, sitemap, robots, redirectTarget, canonicalPaths, middleware };
