var express = require("express");
var router = express.Router();
const config = require("../../../etc/config");

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getFreeWater", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST"])) return;

  let data = {
    queryLength: 0,
    items: [],
  };

  let __perPage = Number(req.query?.perPage || MAX_PAGE_SIZE);
  let __currentPage = Number(req.query?.currentPage || START_PAGE);

  let requestData = JSON.parse(req.query.requestData);

  let __freeDateFrom = FROM_SECONDS(requestData.freeDateFrom / 1000);
  let __freeDateTo = FROM_SECONDS(requestData.freeDateTo / 1000);
  let __apvs = requestData.apvs;

  let __loadXML = req.query?.loadXML || false;

  let apvs = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAPVAddressAndBrig, [])
    .then(
      (result) => {
        let __apvInfo = {};
        result.forEach((apv) => {
          __apvInfo[apv.sn] = apv;
        });
        return __apvInfo;
      },
      (err) => {
        console.log(err);
      }
    );

  let freeWater = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getFreeWater(__apvs), [
      __freeDateFrom,
      __freeDateTo,
    ])
    .then(
      (result) => {
        let __frees = [];
        let __activeFrees = {};

        result.forEach((free) => {
          let __sn = free.sn;
          let __FLAG_f_off = free.FLAG_f_off == 1 ? true : false;
          let __f = free.f;
          let __lts = free.lts;

          if (!__FLAG_f_off) {
            if (__activeFrees?.[__sn] == null) {
              // если ещё не было - добавляем
              __activeFrees[__sn] = { startLts: __lts, sn: __sn };
            }
          } else {
            if (__activeFrees?.[__sn] != null) {
              // если была - финализируем, сохраняем и удаляем
              __frees.push({
                sn: __sn,
                startLts: __activeFrees[__sn].startLts,
                stopLts: free.lts,
                long: (free.lts - __activeFrees[__sn].startLts) / 1000,
                f: free.f,
                address: apvs?.[__sn]?.address,
              });
              delete __activeFrees[__sn];
            }
          }
        });

        Object.values(__activeFrees).forEach((free) => {
          __frees.push({
            sn: free.sn,
            startLts: free.startLts,
            stopLts: free.startLts,
            long: 0,
            f: 0,
            address: apvs?.[free.sn]?.address,
          });
        });

        return __frees;
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
        return;
      }
    );

  data.queryLength = freeWater.length;

  if (__loadXML) {
    data.items = freeWater;
  } else {
    let __pagedArray = [];

    for (const [index, element] of freeWater.entries()) {
      if (
        (index >= __currentPage * __perPage) &
        (index < (__currentPage + 1) * __perPage)
      ) {
        __pagedArray.push(element);
      }
    }

    data.items = __pagedArray;
  }

  res.result.data = data;

  res.ok();
});

let FROM_SECONDS = (seconds) => {
  let __date = new Date();
  __date.setTime(seconds * 1000);
  return `${1900 + __date.getYear()}-${
    1 + __date.getMonth() > 9
      ? 1 + __date.getMonth()
      : "0" + (1 + __date.getMonth())
  }-${__date.getDate() > 9 ? __date.getDate() : "0" + __date.getDate()}`;
};

module.exports = router;
