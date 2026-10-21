const { test } = require('node:test');
const assert = require('node:assert/strict');
const ejs = require('ejs');
const catalog = require('../product/catalog-model');
const { viewLocals } = require('../locales/i18n');
function render(page, url, data) {
  return new Promise((resolve, reject) => ejs.renderFile('views/pages/' + page + '.ejs', { ...viewLocals(url), ...data }, (e, html) => e ? reject(e) : resolve(html)));
}
test('English canonical is absolute, self-referencing and excludes tracking queries', async () => {
  const html = await render('product_by_cats', '/en/product/1-casters?utm_source=test', catalog.catalogView('', '1-casters', 'en'));
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.equal(canonical && canonical[1], 'https://thaictp.com/en/product/1-casters');
  assert.ok(html.includes('hreflang="th" href="https://thaictp.com/product/1-casters"'));
  assert.ok(html.includes('hreflang="en" href="https://thaictp.com/en/product/1-casters"'));
});
test('category description and social metadata are rendered once', async () => {
  const html = await render('product_by_cats', '/product/1-casters', catalog.catalogView('', '1-casters'));
  assert.equal((html.match(/<meta name="description"/g) || []).length, 1);
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.ok(html.includes('property="og:image"'));
  assert.ok(html.includes('name="twitter:card"'));
});
test('search results explicitly opt out of indexing', async () => {
  const html = await render('product_overall', '/product?q=wheel', catalog.catalogView('wheel'));
  assert.ok(html.includes('name="robots" content="noindex,follow"'));
});
test('homepage publishes valid organization JSON-LD with the confirmed origin', async () => {
  const html = await render('index', '/', catalog.catalogView());
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(json, 'missing structured data');
  const graph = JSON.parse(json[1])['@graph'];
  const org = graph.find(item => item['@type'] === 'Organization');
  assert.equal(org.url, 'https://thaictp.com/');
  assert.equal(org.address.addressLocality, 'Bang Khun Thian');
});
const { configuration, createSeo, sitemap, robots, redirectTarget } = require('../seo');
const production = { siteUrl: 'https://thaictp.com', indexable: true };
test('production indexes content but excludes searches and contact submissions', () => {
  assert.equal(createSeo('/en/product/1-casters', production).robots, 'index,follow');
  assert.equal(createSeo('/en/product?q=casters&category=1-casters', production).robots, 'noindex,follow');
  assert.equal(createSeo('/en/product?q=casters&category=1-casters', production).canonical, 'https://thaictp.com/en/product/1-casters');
  assert.equal(createSeo('/en/send', production).robots, 'noindex,follow');
  assert.equal(createSeo('/missing', production).robots, 'noindex,follow');
});
test('preview remains noindex while production indexing is configurable', () => {
  assert.equal(configuration({}).indexable, false);
  assert.equal(configuration({NODE_ENV:'production'}).indexable, true);
  assert.equal(configuration({NODE_ENV:'production',SEO_INDEXABLE:'false'}).indexable, false);
  assert.equal(createSeo('/', { ...production, indexable: false }).robots, 'noindex,follow');
  assert.equal(robots({ ...production, indexable: false }), 'User-agent: *\nAllow: /\n');
});
test('sitemap lists the 26 canonical bilingual pages, with no query or submission URLs', () => {
  const urls = [...sitemap(production).matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.equal(urls.length, 26);
  assert.equal(new Set(urls).size, 26);
  assert.ok(urls.includes('https://thaictp.com/en/product/3-furniture'));
  assert.ok(urls.every(url => url.startsWith('https://thaictp.com/') && !url.includes('?') && !url.includes('/send')));
  assert.ok(robots(production).includes('Sitemap: https://thaictp.com/sitemap.xml'));
});
test('filter and trailing slash redirects keep the language and necessary query', () => {
  assert.equal(redirectTarget('/en/product?category=1-casters&utm_source=demo'), '/en/product/1-casters?utm_source=demo');
  assert.equal(redirectTarget('/product?category=1-casters&q=wheel'), null);
  assert.equal(redirectTarget('/product?category=invalid'), null);
  assert.equal(redirectTarget('/en'), '/en/');
  assert.equal(redirectTarget('/en/contactus/?utm_source=demo'), '/en/contactus?utm_source=demo');
});
test('canonical configuration rejects insecure or non-origin URLs', () => {
  for (const SITE_URL of ['http://example.com', 'https://example.com/path', 'https://name:password@example.com', 'https://example.com?q=1']) assert.throws(() => configuration({ SITE_URL }));
  assert.equal(configuration({ SITE_URL:'https://thaictp.com' }).siteUrl, 'https://thaictp.com');
});
test('category breadcrumbs use the same locale and canonical product hierarchy', () => {
  const seo = createSeo('/en/product/1-casters?utm_source=x', production);
  const graph = JSON.parse(seo.jsonLd)['@graph'];
  assert.deepEqual(graph[0].itemListElement.map(item => item.item), ['https://thaictp.com/en/', 'https://thaictp.com/en/product', 'https://thaictp.com/en/product/1-casters']);
  assert.deepEqual(seo.alternates.map(item => item.url), ['https://thaictp.com/product/1-casters', 'https://thaictp.com/en/product/1-casters', 'https://thaictp.com/product/1-casters']);
});

test('host normalization preserves POST methods without calling the submission handler', () => {
  const previous = process.env.SEO_INDEXABLE;
  process.env.SEO_INDEXABLE = 'true';
  try {
    let status;
    let location;
    require('../seo').middleware({ originalUrl: '/send', method: 'POST', hostname: 'www.thaictp.com' }, { redirect(code, target) { status = code; location = target; } }, () => assert.fail('host normalization did not redirect'));
    assert.equal(status, 308);
    assert.equal(location, 'https://thaictp.com/send');
  } finally {
    if (previous === undefined) delete process.env.SEO_INDEXABLE; else process.env.SEO_INDEXABLE = previous;
  }
});
