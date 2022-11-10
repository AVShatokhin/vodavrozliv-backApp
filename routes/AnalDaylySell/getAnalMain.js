var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;
const SELL_HOURS = 18;

/* GET home page. */
router.post("/getAnalMain", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST", "DISPATCHER", "ACCOUNTANT"]))
    return;

  let __requestData = req.body.requestData;
  let __currentPage = req.body.currentPage || START_PAGE;
  let __perPage = req.body.perPage || MAX_PAGE_SIZE;
  // let __sortType = __requestData?.sortType;

  let data = {
    queryLength: 0,
    apvs: [],
  };

  let apvs = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllCurrentApvData, [])
    .then(
      (result) => {
        let __apvs = {};

        result.forEach((e) => {
          e.chargeInfo = JSON.parse(e.chargeInfo);
          e.data = JSON.parse(e.data);
          e.online = e.online == 1;
          __apvs[e.sn] = e;
          __apvs[e.sn].AVGDaylySell = 0;
          __apvs[e.sn].AVGHourlySell = 0;
        });

        return __apvs;
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
        next();
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllAVGDaylySell, [])
    .then(
      (result) => {
        result.forEach((avg) => {
          let __avgDaylySEll = (avg?.AVGDaylySell || 0).toFixed(1);
          let __avgHourly = (__avgDaylySEll / SELL_HOURS || 0).toFixed(1);
          if (apvs?.[avg.sn]) {
            apvs[avg.sn].AVGDaylySell = __avgDaylySEll;
            apvs[avg.sn].AVGHourlySell = __avgHourly;
          }
        });
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
        next();
      }
    );

  if (__requestData.apvs.length > 0) {
    let __newApvs = {};
    __requestData.apvs.forEach((apv) => {
      if (apvs[apv] != undefined) __newApvs[apv] = apvs[apv];
    });
    apvs = __newApvs;
  }

  let __apvsArray = Object.values(apvs);

  // if (__sortType == 0) {
  //   __apvsArray = __apvsArray.sort((a, b) => {
  //     return a.sn > b.sn ? 1 : -1;
  //   });
  // } else if (__sortType == 1) {
  //   __apvsArray = __apvsArray.sort((a, b) => {
  //     return b.remain - a.remain;
  //   });
  // } else if (__sortType == 2) {
  //   __apvsArray = __apvsArray.sort((a, b) => {
  //     return a.remain - b.remain;
  //   });
  // }

  let __pagedApvsArray = [];

  if (__perPage == -1) {
    __pagedApvsArray = __apvsArray;
  } else {
    for (const [index, element] of __apvsArray.entries()) {
      if (
        (index >= __currentPage * __perPage) &
        (index < (__currentPage + 1) * __perPage)
      ) {
        __pagedApvsArray.push(element);
      }
    }
  }

  data.queryLength = __apvsArray.length;
  data.apvs = __pagedApvsArray;
  res.result.data = data;

  res.ok();
});

module.exports = router;
