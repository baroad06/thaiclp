const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
// async..await is not allowed in global scope, must use a wrapper

router.post('/', function (req, res, next) {
  console.log(req.body);
  return new Promise(() => {
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
      from: '"Customer" <' + email + '>',
      to: 'boat.supawats@gmail.com',
      subject: 'Customer Msg',
      text: msg,
      html: '<b> msg : ' + msg + '</b> <br/> phone number :' + phone,
    });
    console.log('Message sent: %s', info.messageId);
  });
});

module.exports = router;
