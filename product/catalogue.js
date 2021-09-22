var express = require("express");
var app = express();
var path = require("path");
var http = require("http");
var router = express.Router();
var fs = require("fs");

router.get("/", function (req, res) {
  var all_product = JSON.parse(fs.readFileSync("./product/data.json", "utf8"));
  res.render("pages/catalogue.ejs", { product: all_product });
});

module.exports = router;
