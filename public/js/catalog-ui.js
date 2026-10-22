(function () {
  var catalog = document.querySelector('[data-catalog]');
  if (!catalog) return;
  var prefix = catalog.dataset.prefix || '';
  var form = catalog.querySelector('form');
  var input = document.getElementById('catalog-search');
  var select = document.getElementById('category-select');
  var clear = document.getElementById('clear-filters');
  var cards = Array.from(catalog.querySelectorAll('[data-product]'));
  var products = cards.map(function (card) { return { name: card.dataset.name, category: card.dataset.category, categoryName: card.dataset.categoryName, searchText: card.dataset.searchText, card: card }; });
  var links = Array.from(catalog.querySelectorAll('[data-category-link]'));
  var isCategoryPage = catalog.dataset.categoryPage === 'true';
  var initialCategory = select.value;
  function update(writeUrl) {
    var matches = window.searchCatalog(products, input.value, select.value);
    var visible = new Set(matches.map(function (product) { return product.card; }));
    cards.forEach(function (card) { card.hidden = !visible.has(card); });
    document.getElementById('result-count').textContent = matches.length + ' ' + (document.documentElement.lang === 'en' ? (matches.length === 1 ? 'product' : 'products') : catalog.dataset.resultLabel);
    document.getElementById('empty-results').hidden = matches.length > 0;
    clear.hidden = !input.value && (isCategoryPage || !select.value);
    catalog.querySelectorAll('[data-catalogue-category]').forEach(function (link) { link.hidden = link.dataset.catalogueCategory !== select.value; });
    links.forEach(function (link) {
      var active = link.dataset.categoryLink === select.value;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
    });
    if (writeUrl) {
      var url = new URL(location.href);
      if (input.value.trim()) url.searchParams.set('q', input.value); else url.searchParams.delete('q');
      if (select.value) url.searchParams.set('category', select.value); else url.searchParams.delete('category');
      history.replaceState(null, '', url);
      document.dispatchEvent(new Event('catalog:change'));
    }
  }
  form.addEventListener('submit', function (event) { event.preventDefault(); update(true); });
  input.addEventListener('input', function () { update(true); });
  select.addEventListener('change', function () {
    // Category pages have a heading and catalogue specific to the current category.
    if (isCategoryPage) { var url = new URL(prefix + (select.value ? '/product/' + select.value : '/product'), location.origin); if (input.value.trim()) url.searchParams.set('q', input.value); location.assign(url); }
    else update(true);
  });
  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      if (isCategoryPage) {
        var destination = new URL(prefix + (link.dataset.categoryLink ? '/product/' + link.dataset.categoryLink : '/product'), location.origin);
        if (input.value.trim()) destination.searchParams.set('q', input.value);
        location.assign(destination);
      } else { select.value = link.dataset.categoryLink; update(true); }
    });
  });
  clear.addEventListener('click', function () {
    if (isCategoryPage) { input.value = ''; update(true); input.focus(); return; }
    input.value = ''; select.value = ''; update(true); input.focus();
  });
  window.addEventListener('pageshow', function () { if (isCategoryPage) select.value = initialCategory; update(false); });
  var dialog = document.getElementById('product-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  catalog.querySelectorAll('[data-preview]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      var card = link.closest('[data-product]');
      var image = document.getElementById('preview-image');
      image.src = link.href; image.alt = card.dataset.name;
      document.getElementById('preview-title').textContent = card.dataset.name;
      document.getElementById('preview-category').textContent = card.dataset.categoryName;
      dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) { var r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
}());
