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
var checkTelegram = require("./APVList/checkTelegram");

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
var getMainJouFilterStructure = require("./MainJou/getMainJouFilterStructure");

var getDevices = require("./MessList/getDevices");
var getErrors = require("./MessList/getErrors");
var getMessages = require("./MessList/getMessages");
var addDevice = require("./MessList/addDevice");
var addError = require("./MessList/addError");
var addMessage = require("./MessList/addMessage");
var deleteDevice = require("./MessList/deleteDevice");
var deleteError = require("./MessList/deleteError");
var deleteMessage = require("./MessList/deleteMessage");
var changeDevice = require("./MessList/changeDevice");
var changeError = require("./MessList/changeError");
var changeMessage = require("./MessList/changeMessage");
var changeIsActiveError = require("./MessList/changeIsActiveError");
var changeIsActiveMessage = require("./MessList/changeIsActiveMessage");
var getReminder = require("./MessList/getReminder");
var applyReminder = require("./MessList/applyReminder");

var getApvByEng = require("./CmdsPanel/getApvByEng");
var setCmdByEng = require("./CmdsPanel/setCmdByEng");
var dropCmdByEng = require("./CmdsPanel/dropCmdByEng");

var getApvForInkas = require("./CmdsInkas/getApvForInkas");
var setCmdInkas = require("./CmdsInkas/setCmdInkas");
var dropCmdInkas = require("./CmdsInkas/dropCmdInkas");

var getDispatcherMain = require("./DispatcherTable/getDispatcherMain");
var getAnalMain = require("./AnalDaylySell/getAnalMain");

var getSnSelectorData = require("./SnSelector/getSnSelectorData");

var getCashierInkass = require("./CashierInkass/getCashierInkass");
var addCashierInkass = require("./CashierInkass/addCashierInkass");
var delCashierInkass = require("./CashierInkass/delCashierInkass");

module.exports = [
  getAPV,
  require("./APVList/getAPV_XML"),
  addAPV,
  deleteAPV,
  updateApvOptions,
  checkTelegram,
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
  require("./InkasJou/getInkas_XML"),
  getMain,
  require("./MainJou/getMain_XML"),
  getDevices,
  getErrors,
  getMessages,
  addError,
  addDevice,
  addMessage,
  deleteDevice,
  deleteError,
  deleteMessage,
  changeDevice,
  changeError,
  changeMessage,
  changeIsActiveError,
  changeIsActiveMessage,
  getApvByEng,
  setCmdByEng,
  dropCmdByEng,
  getApvForInkas,
  setCmdInkas,
  dropCmdInkas,
  getMainJouFilterStructure,
  applyReminder,
  getReminder,
  getDispatcherMain,
  require("./DispatcherTable/getDispatcherMain_XML"),
  getAnalMain,
  getSnSelectorData,
  getCashierInkass,
  addCashierInkass,
  delCashierInkass,
  require("./CashierInkass/updateCashierInkass"),
  require("./CashierItog/getCashierItog"),
  require("./AnalInkass/getAnalByInkass"),
  require("./AnalInkass/getAnalByCreation"),
  require("./AnalInkass/setInkassPrihod"),
  require("./AnalInkass/getAllCashiers"),
  require("./AnalErrors/getAllErrorsAndDevices"),
  require("./AnalErrors/getAnalErrors"),
  require("./AnalFreeWater/getFreeWater"),
  require("./AnalInkass/setPrihodAll"),
  require("./DispatcherWash/getWash"),
  require("./DispatcherHistory/getDispatcherHistory"),
  require("./DispatcherHistory/getDispatcherHistory_XML"),
  require("./DispatcherWash/addWashApv"),
  require("./DispatcherWash/editWashApv"),
  require("./DispatcherWash/delWashApv"),
  require("./DispatcherWash/getAllWashers"),
  require("./BuhActual/getBuhActual"),
  require("./BuhReport/getBuhReport"),
];
