const express = require('express');
const router = express.Router();
const catalog = require('./catalog-model');
router.get('/', function (req, res) {
  var view = catalog.catalogView(req.query.q, req.query.category, res.locals.lang);
  // With no search, show every category first and let the visitor pick one.
  if (!view.query.trim()) return res.render('pages/product_categories.ejs', view);
  res.render('pages/product_overall.ejs', view);
});
router.get('/:product_cat', function (req, res, next) {
  if (!catalog.categories.some(function (item) { return item.url === req.params.product_cat; })) return next();
  res.render('pages/product_by_cats.ejs', catalog.catalogView(req.query.q, req.params.product_cat, res.locals.lang));
});
module.exports = router;
