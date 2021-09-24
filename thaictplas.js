const express = require("express");
const app = express();

var path = require("path");
var http = require("http");
var https = require("https");
var url = require("url");
var fs = require("fs");
var product = require("./product/product");
var catalogue = require("./product/catalogue");
app.use(express.static(path.join(__dirname, "public")));
app.enable("trust proxy");
var hostname = "";
app.use(function (req, res, next) {
  if (req.secure) {
    hostname = req.headers.host;
    console.log("hostname = " + hostname);
    next();
  } else {
    console.log(req.headers.host);
    res.redirect("https://" + req.headers.host + req.url);
  }
});
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("pages/index.ejs");
});
app.get("/aboutus", function (req, res) {
  res.render("pages/aboutus.ejs");
});
app.get("/contactus", function (req, res) {
  res.render("pages/contactus.ejs");
});
app.use("/catalogue", catalogue);
app.use("/product", product);

app.listen(8000);
https.listen(4430);
