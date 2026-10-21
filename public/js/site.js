(function () {
  var page = document.body.dataset.page || ({ '/aboutus': 'about', '/contactus': 'contact' }[location.pathname.replace(/^\/en(?=\/|$)/, '')]);
  document.querySelectorAll('[data-nav]').forEach(function (link) {
    if (link.dataset.nav === page) link.setAttribute('aria-current', 'page');
  });
  function updateLanguageLinks() {
    var current = new URL(location.href);
    var path = current.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
    if (path === '/send') path = '/contactus';
    document.querySelectorAll('[data-language]').forEach(function (link) {
      link.href = (link.dataset.language === 'en' ? '/en' : '') + path + current.search;
    });
  }
  updateLanguageLinks();
  document.addEventListener('catalog:change', updateLanguageLinks);
  window.addEventListener('pageshow', updateLanguageLinks);
  var toggle = document.getElementById('mobile-menu-button');
  var menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  function closeMenu() { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', toggle.dataset.openLabel); }
  toggle.addEventListener('click', function () {
    menu.hidden = !menu.hidden;
    toggle.setAttribute('aria-expanded', String(!menu.hidden));
    toggle.setAttribute('aria-label', menu.hidden ? toggle.dataset.openLabel : toggle.dataset.closeLabel);
  });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); } });
  window.matchMedia('(min-width: 961px)').addEventListener('change', function (event) { if (event.matches) closeMenu(); });
}());
