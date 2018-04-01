var express = require('express')
var app = express()
var path = require('path')
var http = require('http')
var router = express.Router();
var fs = require('fs')

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

router.get('/', function(req, res) {
    //var all_product = JSON.parse(fs.readFileSync('all-products.json', 'utf8'));
    var all_product = JSON.parse(fs.readFileSync('./product/data.json', 'utf8'));
    //res.send("test")
    res.render('pages/product.ejs', {product: all_product});
})

router.get('/:product_cat', function(req,res) {
    var all_product = JSON.parse(fs.readFileSync('./product/data.json', 'utf8'));
    for (var product in all_product.subfolder) {
        if (all_product.subfolder[product].url === req.params.product_cat) {
            res.render('pages/product-by-cat.ejs', {productcat: all_product.subfolder[product]});
        }
    }
})

module.exports = router;
