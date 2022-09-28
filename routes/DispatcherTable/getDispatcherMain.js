const e = require("express");
var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;
const SELL_HOURS = 18;

/* GET home page. */
router.post("/getDispatcherMain", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["DISPATCHER"])) return;

  let __requestData = req.body.requestData;
  let __currentPage = req.body.currentPage || START_PAGE;
  let __perPage = req.body.perPage || MAX_PAGE_SIZE;

  let data = {
    queryLength: 0,
    apvs: [],
  };

  apvs = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllCurrentApvData, [])
    .then(
      (result) => {
        let __apvs = {};

        result.forEach((e) => {
          e.chargeInfo = JSON.parse(e.chargeInfo);
          e.data = JSON.parse(e.data);
          e.online = e.online == 1;
          e["remain"] = e.data.v1 - e.data.v2;
          e["AVGHourlySell"] = 0;
          e["elapsedTime"] = -1;
          __apvs[e.sn] = e;
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
          let __avgHourly = (avg?.AVGDaylySell / SELL_HOURS || 0).toFixed(1);

          apvs[avg.sn].AVGHourlySell = __avgHourly;

          if (__avgHourly > 0) {
            apvs[avg.sn].elapsedTime = (
              (apvs[avg.sn].data.v1 - apvs[avg.sn].data.v2) /
              __avgHourly
            ).toFixed(0);
          }
        });
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
        next();
      }
    );

  let __sortType = __requestData?.sortType;

  if (__requestData.apvs.length > 0) {
    let __newApvs = {};
    __requestData.apvs.forEach((apv) => {
      if (apvs[apv] != undefined) __newApvs[apv] = apvs[apv];
    });
    apvs = __newApvs;
  }

  let __apvsArray = Object.values(apvs);

  if (__sortType == 0) {
    __apvsArray = __apvsArray.sort((a, b) => {
      return a.sn > b.sn ? 1 : -1;
    });
  } else if (__sortType == 1) {
    __apvsArray = __apvsArray.sort((a, b) => {
      return b.remain - a.remain;
    });
  } else if (__sortType == 2) {
    __apvsArray = __apvsArray.sort((a, b) => {
      return a.remain - b.remain;
    });
  }

  let __pagedApvsArray = [];

  for (const [index, element] of __apvsArray.entries()) {
    if (
      (index >= __currentPage * __perPage) &
      (index < (__currentPage + 1) * __perPage)
    ) {
      __pagedApvsArray.push(element);
    }
  }

  data.queryLength = __apvsArray.length;
  data.apvs = __pagedApvsArray;
  res.result.data = data;

  res.ok();
});

module.exports = router;
