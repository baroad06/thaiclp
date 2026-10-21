(function (root) {
  function searchCatalog(products, query, category) {
    var terms = String(query || '').normalize('NFC').toLocaleLowerCase('th').trim().split(/\s+/).filter(Boolean);
    return products.filter(function (product) {
      var text = (product.name + ' ' + product.categoryName + ' ' + (product.searchText || '')).normalize('NFC').toLocaleLowerCase('th');
      return (!category || product.category === category) && terms.every(function (term) { return text.includes(term); });
    });
  }
  if (typeof module === 'object' && module.exports) module.exports = searchCatalog;
  else root.searchCatalog = searchCatalog;
}(typeof window !== 'undefined' ? window : globalThis));
