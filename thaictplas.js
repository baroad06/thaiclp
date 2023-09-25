const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

var path = require('path');
var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var product = require('./product/product');
var catalogue = require('./product/catalogue');
app.use(express.static(path.join(__dirname, 'public')));
app.enable('trust proxy');
var hostname = '';
app.use(function (req, res, next) {
    hostname = req.headers.host;
    console.log('hostname = ' + hostname);
    next();
});
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('pages/index.ejs');
});
app.get('/aboutus', function (req, res) {
  res.render('pages/aboutus.ejs');
});
app.get('/contactus', function (req, res) {
  res.render('pages/contactus.ejs');
});
app.use('/catalogue', catalogue);
app.use('/product', product);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send', (req, res) => {
  const output = `<p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>  
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phoneNumber}</li>
  </ul>
  <h3>Message</h3>
  <p>${req.body.text}</p>`;

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'bot.thaictp@gmail.com',
      pass: 'x^h35X^X$7nj5W$3m78e',
    },
  });

  let info = transporter.sendMail({
    from: '"Nodemailer Contact" <your@email.com>',
    to: 'boonchuay@thaictp.com',
    subject: 'Customer Msg',
    text: 'Contact From Customer',
    html: output,
  });

  res.render('pages/contactus', { alert: 'Email has been sent' });
});

http.createServer(app).listen(3000);
