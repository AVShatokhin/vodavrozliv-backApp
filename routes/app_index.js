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

var getEng = require("./BRIGList/getEng");
var changeBrigKrug = require("./BRIGList/changeBrigKrug");
var addBrig = require("./BRIGList/addBrig");
var getBrig = require("./BRIGList/getBrig");
var deleteBrig = require("./BRIGList/deleteBrig");

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
  changeBrigKrug,
  addBrig,
  getBrig,
  deleteBrig,
];
