var express = require('express')
var app = express()
var path = require('path')
var http = require('http')
var router = express.Router();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    res.render('product.ejs');
})

app.listen(3000)
module.exports = router;
