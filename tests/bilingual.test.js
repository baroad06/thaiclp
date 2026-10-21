const { test } = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../product/catalog-model');

test('English catalogue translates category and product names', () => {
  const view = catalog.catalogView('', '1-casters', 'en');
  assert.equal(view.activeCategory.label, 'Casters');
  assert.equal(view.matches[0].name, '1.5-inch caster');
});
test('English catalogue finds products using their Thai names', () => {
  const view = catalog.catalogView('ล้อ 1.5', '', 'en');
  assert.equal(view.matches.length, 1);
  assert.equal(view.matches[0].name, '1.5-inch caster');
});
test('Thai catalogue finds products using English names and categories', () => {
  const view = catalog.catalogView('1.5-inch caster', '', 'th');
  assert.equal(view.matches.length, 1);
  assert.equal(view.matches[0].name, 'ล้อ 1.5 นิ้ว');
});
test('all English product titles are translated and preserve the original images', () => {
  const en = catalog.catalogView('', '', 'en');
  assert.equal(en.products.length, 107);
  assert.equal(en.products.some(p => /[\u0e00-\u0e7f]/.test(p.name + p.categoryName)), false);
  assert.deepEqual(en.products.map(p => p.image), catalog.products.map(p => p.image));
});
const ejs = require('ejs');
const path = require('node:path');
const { viewLocals } = require('../locales/i18n');
function render(page, data) {
  return new Promise((resolve, reject) => ejs.renderFile(path.join(__dirname, '../views/pages/' + page + '.ejs'), Object.assign({}, viewLocals('/en/' + (page === 'index' ? '' : 'product')), data), (err, html) => err ? reject(err) : resolve(html)));
}
for (const [page, data] of [
  ['index', catalog.catalogView('', '', 'en')],
  ['product_overall', catalog.catalogView('', '', 'en')],
  ['product_by_cats', catalog.catalogView('', '7-extrusion', 'en')],
  ['aboutus', {}], ['contactus', {}],
]) test('English ' + page + ' renders translated content and language-aware navigation', async () => {
  const html = await render(page, data);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /href="\/en\/product"/);
  const visibleText = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, '');
  assert.equal(/[\u0e00-\u0e7f]/.test(visibleText), false);
});
test('language switch preserves the category, query and filter', () => {
  const locals = viewLocals('/en/product/1-casters?q=wheel&category=1-casters');
  assert.equal(locals.lang, 'en');
  assert.equal(locals.languageUrl('th'), '/product/1-casters?q=wheel&category=1-casters');
  assert.equal(viewLocals('/product?q=wheel').languageUrl('en'), '/en/product?q=wheel');
  assert.equal(viewLocals('/en').languageUrl('th'), '/');
  assert.equal(viewLocals('/enquiries').lang, 'th');
});
test('switching language from a contact confirmation targets a GET contact page', () => {
  assert.equal(viewLocals('/en/send').languageUrl('th'), '/contactus');
  assert.equal(viewLocals('/send').languageUrl('en'), '/en/contactus');
});
