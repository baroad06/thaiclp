const express = require('express');
const router = express.Router();
const catalog = require('./catalog-model');
router.get('/', function (req, res) {
  res.render('pages/product_overall.ejs', catalog.catalogView(req.query.q, req.query.category, res.locals.lang));
});
router.get('/:product_cat', function (req, res, next) {
  if (!catalog.categories.some(function (item) { return item.url === req.params.product_cat; })) return next();
  res.render('pages/product_by_cats.ejs', catalog.catalogView(req.query.q, req.params.product_cat, res.locals.lang));
});
module.exports = router;
