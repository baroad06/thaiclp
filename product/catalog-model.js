const data = require('./data.json');
const list = require('./list.json');
const english = require('../locales/products.en.json');
const search = require('../public/js/catalog-search');
function localizedCatalog(lang) {
  const categories = data.subfolder.map(function (category) {
    const label = list.list_name.find(function (item) { return item.url === category.url; });
    const thaiLabel = label ? label.name : category.name;
    return Object.assign({}, category, { label: lang === 'en' ? english[category.url].label : thaiLabel, thaiLabel });
  });
  const products = categories.flatMap(function (category) {
    return category.image.map(function (item, index) {
      const thaiName = item.id.trim() || category.thaiLabel + ' · แบบที่ ' + String(index + 1).padStart(2, '0');
      const englishName = english[category.url].products[item.image];
      return {
        name: lang === 'en' ? englishName : thaiName,
        category: category.url,
        categoryName: category.label,
        searchText: [thaiName, englishName, category.thaiLabel, english[category.url].label].join(' '),
        image: '/images/catalog/' + category.url + '/' + item.image,
        key: category.url + '-' + index,
      };
    });
  });
  return { categories, products };
}
const catalogs = { th: localizedCatalog('th'), en: localizedCatalog('en') };
function catalogView(query, category, lang) {
  const { categories, products } = catalogs[lang === 'en' ? 'en' : 'th'];
  const q = typeof query === 'string' ? query : '';
  const activeCategory = categories.find(function (item) { return item.url === category; });
  const selected = activeCategory ? activeCategory.url : '';
  return { categories, products, query: q, selectedCategory: selected, activeCategory, matches: search(products, q, selected) };
}
module.exports = { categories: catalogs.th.categories, products: catalogs.th.products, catalogView };
