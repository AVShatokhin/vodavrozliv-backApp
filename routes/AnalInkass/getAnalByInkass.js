const { request } = require("express");
var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getAnalByInkass", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST"])) return;

  let data = {
    queryLength: 0,
    items: [],
  };

  let __perPage = Number(req.query?.perPage || MAX_PAGE_SIZE);
  let __currentPage = Number(req.query?.currentPage || START_PAGE);

  let requestData = JSON.parse(req.query.requestData);

  let __dateCreationFrom = FROM_SECONDS(requestData.dateCreationFrom / 1000);
  let __dateCreationTo = FROM_SECONDS(requestData.dateCreationTo / 1000);
  let __dateInkassFrom = FROM_SECONDS(requestData.dateInkassFrom / 1000);
  let __dateInkassTo = FROM_SECONDS(requestData.dateInkassTo / 1000);
  let __apvs = requestData.apvs;
  let __loadXML = req.query?.loadXML;

  let inks = await req.mysqlConnection
    .asyncQuery(
      req.mysqlConnection.SQL_APP.getTerminalInkassByInkassDate(__apvs),
      [__dateInkassFrom, __dateInkassTo]
    )
    .then(
      (result) => {
        let __inks = {};
        result.forEach((ink) => {
          let __dateKey = String(ink.dateInkass);
          if (__inks?.[ink.sn] == null) {
            __inks[ink.sn] = {};
          }

          ink.terminalInkass = true;
          ink.cashierInkass = false;
          ink.delta = -ink.terminalSumm;

          __inks[ink.sn][__dateKey] = ink;
        });
        return __inks;
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
        return;
      }
    );

  await req.mysqlConnection
    .asyncQuery(
      req.mysqlConnection.SQL_APP.getCashierInkassByInkassDate(__apvs),
      [__dateInkassFrom, __dateInkassTo]
    )
    .then(
      (result) => {
        result.forEach((ink) => {
          ink.cashierSign = JSON.parse(ink.cashierSign || {});
          ink.dontUseSn = ink.dontUseSn == 1 ? true : false;
          ink.isPrihod = ink.isPrihod == 1 ? true : false;
          let __dateKey = String(ink.dateInkass);

          if (inks?.[ink.sn] == null) {
            inks[ink.sn] = {};
          }

          if (inks[ink.sn]?.[__dateKey] != null) {
            inks[ink.sn][__dateKey].cashierInkass = true;
            inks[ink.sn][__dateKey].delta =
              ink.cashierSumm - inks[ink.sn][__dateKey].terminalSumm;
            inks[ink.sn][__dateKey] = Object.assign(
              inks[ink.sn][__dateKey],
              ink
            );
          } else {
            ink.terminalInkass = false;
            ink.cashierInkass = true;
            ink.delta = ink.cashierSumm;
            inks[ink.sn][__dateKey] = ink;
          }
        });
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
        return;
      }
    );

  let __forSortArray = [];
  res.result.cinkass_ids = [];

  Object.keys(inks).forEach((apv) => {
    Object.keys(inks[apv]).forEach((inkassDate) => {
      __forSortArray.push(inks[apv][inkassDate]);
      if (inks[apv][inkassDate]?.cinkass_id != null)
        res.result.cinkass_ids.push(inks[apv][inkassDate].cinkass_id);
    });
  });

  let __unPagedArray = [];

  switch (requestData.sortType) {
    case 0: // inkassDate
      __unPagedArray = __forSortArray.sort((a, b) => {
        return a.dateInkass <= b.dateInkass ? 1 : -1;
      });
      break;
    case 1: // sn & inkassDate
      __unPagedArray = __forSortArray.sort((a, b) => {
        if (a.sn == b.sn) {
          return a.dateInkass <= b.dateInkass ? 1 : -1;
        } else {
          return a.sn >= b.sn ? 1 : -1;
        }
      });
      break;
    case 2: // up cashierSumm
      __unPagedArray = __forSortArray.sort((a, b) => {
        return a.cashierSumm > b.cashierSumm ? 1 : -1;
      });
      break;
    case 3: // down cashierSumm
      __unPagedArray = __forSortArray.sort((a, b) => {
        return a.cashierSumm <= b.cashierSumm ? 1 : -1;
      });

      break;
    case 4: // up delta
      __unPagedArray = __forSortArray.sort((a, b) => {
        return a.delta < b.delta ? 1 : -1;
      });
      break;
    case 5: // down delta
      __unPagedArray = __forSortArray.sort((a, b) => {
        return a.delta >= b.delta ? 1 : -1;
      });
      break;

    default:
      break;
  }

  data.queryLength = __unPagedArray.length;

  if (__loadXML) {
    data.items = __unPagedArray;
  } else {
    let __pagedArray = [];

    for (const [index, element] of __unPagedArray.entries()) {
      if (
        (index >= __currentPage * __perPage) &
        (index < (__currentPage + 1) * __perPage)
      ) {
        __pagedArray.push(element);
      }
    }

    data.items = __pagedArray;
  }

  res.result.apvs = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllAPV, [])
    .then(
      (result) => {
        return result;
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );

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
