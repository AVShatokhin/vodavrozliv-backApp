var express = require("express");
var indexRouter = express.Router();

/* GET home page. */
indexRouter.get("/app/", function (req, res, next) {
  res.render("index", { title: "Node-Pattern" });
});

var getAPV = require("./APVList/getAPV");
var addAPV = require("./APVList/addAPV");
var deleteAPV = require("./APVList/deleteAPV");
var updateApvOptions = require("./APVList/updateApvOptions");
var changeApvKrug = require("./APVList/changeApvKrug");

var getKrug = require("./KrugList/getKrug");
var addKrug = require("./KrugList/addKrug");
var deleteKrug = require("./KrugList/deleteKrug");
var changeKrugTitle = require("./KrugList/changeKrugTitle");
var getAllKrugs = require("./KrugList/getAllKrugs");

var getAllEngs = require("./BRIGList/getAllEngs");
var changeBrigKrug = require("./BRIGList/changeBrigKrug");
var addBrig = require("./BRIGList/addBrig");
var getBrig = require("./BRIGList/getBrig");
var deleteBrig = require("./BRIGList/deleteBrig");
var addEngToBrig = require("./BRIGList/addEngToBrig");
var deleteEngFromBrig = require("./BRIGList/deleteEngFromBrig");
var updateBrig = require("./BRIGList/updateBrig");

var getInkas = require("./InkasJou/getInkas");
var getMain = require("./MainJou/getMain");

module.exports = [
  getAPV,
  addAPV,
  deleteAPV,
  updateApvOptions,
  getKrug,
  addKrug,
  deleteKrug,
  changeKrugTitle,
  getAllKrugs,
  changeApvKrug,
  changeBrigKrug,
  addBrig,
  getBrig,
  deleteBrig,
  getAllEngs,
  addEngToBrig,
  deleteEngFromBrig,
  updateBrig,
  getInkas,
  getMain,
];
