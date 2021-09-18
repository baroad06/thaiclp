var express = require("express");
var app = express();
var path = require("path");
var http = require("http");
var router = express.Router();
var fs = require("fs");

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.get("/", function (req, res) {
  var all_product = JSON.parse(fs.readFileSync("./product/data.json", "utf8"));
  res.render("pages/product_overall.ejs", { product: all_product });
});

router.get("/:product_cat", function (req, res) {
  console.log("Name: ", req.params.product_cat);
  var all_product = JSON.parse(fs.readFileSync("./product/data.json", "utf8"));
  var list_name = JSON.parse(fs.readFileSync("./product/list.json", "utf8"));
  for (var product in all_product.subfolder) {
    if (all_product.subfolder[product].url === req.params.product_cat) {
      try {
        res.render("pages/product_by_cats.ejs", {
          productcat: all_product.subfolder[product],
          list: list_name,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
});

module.exports = router;
