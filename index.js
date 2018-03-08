var express = require('express')
var app = express()
var path = require('path')
var http = require('http')
var fs = require('fs')
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    res.render('pages/index.ejs');
})
app.get('/aboutus', function(req,res) {
    res.render('pages/aboutus.ejs');
})
app.get('/contactus', function(req,res) {
    res.render('pages/contactus.ejs');
})
app.get('/product', function(req,res) {
    var all_product = JSON.parse(fs.readFileSync('all-products.json', 'utf8'));
    res.render('pages/product.ejs', {product: all_product});
})
app.get('/product/:product_cat', function(req,res){
    var all_product = JSON.parse(fs.readFileSync('all-products.json', 'utf8'));
    for (var product in all_product) {
        if (all_product[product].foldername === req.params.product_cat) {
            res.render('pages/product-by-cat.ejs', {productcat: all_product[product]});
        }
    }
})

app.listen(3000)
