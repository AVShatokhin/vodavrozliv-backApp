var express = require("express");
var indexRouter = express.Router();

/* GET home page. */
indexRouter.get("/app/", function (req, res, next) {
  res.render("index", { title: "Node-Pattern" });
});

var getAPV = require("./APVList/getAPV");
var addAPV = require("./APVList/addAPV");
var deleteAPV = require("./APVList/deleteAPV");
var changeAddress = require("./APVList/changeAddress");

module.exports = [getAPV, addAPV, deleteAPV, changeAddress];
