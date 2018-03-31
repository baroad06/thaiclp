var express = require('express')
var app = express()
var path = require('path')
var http = require('http')
var fs = require('fs')
var product = require('./product/product')
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
app.use('/product', product)

app.listen(3000)
