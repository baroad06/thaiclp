const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const ejs = require('ejs');
const catalog = require('../product/catalog-model');
const defaults = require('../locales/i18n').viewLocals('/');
for (const [page, data] of [
  ['index', catalog.catalogView()],
  ['product_overall', catalog.catalogView('ล้อ 1.5')],
  ['product_by_cats', catalog.catalogView('', '3-furniture')],
  ['aboutus', {}],
  ['contactus', {}],
]) test(page + ' renders with the shared navigation', async () => {
  const html = await new Promise((resolve, reject) => ejs.renderFile(path.join(__dirname, '../views/pages/' + page + '.ejs'), Object.assign({}, defaults, data), (err, html) => err ? reject(err) : resolve(html)));
  assert.ok(html.includes('id="main-content"'));
  assert.ok(html.includes('id="mobile-menu"'));
});
test('category destinations preserve the search query without JavaScript', async () => {
  const html = await new Promise((resolve, reject) => ejs.renderFile(path.join(__dirname, '../views/pages/product_by_cats.ejs'), Object.assign({}, defaults, catalog.catalogView('นิ้ว', '1-casters')), (err, html) => err ? reject(err) : resolve(html)));
  const destination = html.match(/href="([^"]+)" data-category-link="2-caster-bearings"/)[1];
  assert.equal(new URL(destination, 'http://localhost').searchParams.get('q'), 'นิ้ว');
});
