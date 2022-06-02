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
var changeApvKrug = require("./APVList/changeApvKrug");

var getKrug = require("./KrugList/getKrug");
var addKrug = require("./KrugList/addKrug");
var deleteKrug = require("./KrugList/deleteKrug");
var changeKrugTitle = require("./KrugList/changeKrugTitle");
var getAllKrugs = require("./KrugList/getAllKrugs");

var getEng = require("./EngList/getEng");
var changeEngKrug = require("./EngList/changeEngKrug");

module.exports = [
  getAPV,
  addAPV,
  deleteAPV,
  changeAddress,
  getKrug,
  addKrug,
  deleteKrug,
  changeKrugTitle,
  getAllKrugs,
  changeApvKrug,
  getEng,
  changeEngKrug,
];
