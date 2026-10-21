const router = require('express').Router();
const catalog = require('./catalog-model');
router.get('/', function (req, res) {
  res.render('pages/catalogue.ejs', {
    product: { subfolder: catalog.catalogView('', '', res.locals.lang).categories },
  });
});
module.exports = router;
