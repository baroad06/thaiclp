const { test } = require('node:test');
const assert = require('node:assert/strict');
const search = require('../public/js/catalog-search');
const products = [
  { name: 'ล้อ 1.5 นิ้ว', category: 'casters', categoryName: 'ลูกล้อ' },
  { name: 'ล้อ 2 นิ้ว', category: 'casters', categoryName: 'ลูกล้อ' },
  { name: 'T-Nut', category: 'furniture', categoryName: 'อุปกรณ์เฟอร์นิเจอร์' },
];
test('blank search returns all products', () => assert.deepEqual(search(products, '', ''), products));
test('search matches Thai words across product and category names', () => assert.deepEqual(search(products, 'ลูกล้อ 1.5', ''), [products[0]]));
test('search ignores case and surrounding whitespace', () => assert.deepEqual(search(products, '  t-NUT  ', ''), [products[2]]));
test('category and query must both match', () => {
  assert.deepEqual(search(products, 'ล้อ', 'casters'), products.slice(0, 2));
  assert.deepEqual(search(products, 'ล้อ', 'furniture'), []);
});
test('unknown query or category returns no products', () => {
  assert.deepEqual(search(products, 'ไม่มีสินค้านี้', ''), []);
  assert.deepEqual(search(products, '', 'missing'), []);
});
