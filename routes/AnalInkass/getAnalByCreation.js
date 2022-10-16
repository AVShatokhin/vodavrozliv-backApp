const { request } = require("express");
var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getAnalByCreation", async function (req, res, next) {
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
  let __apvs = requestData.apvs;
  let __loadXML = req.query?.loadXML;
  let __cashierUid = requestData?.cashierUid || -1;

  let __dateInkassFrom = null;
  let __dateInkassTo = null;

  let inks = await req.mysqlConnection
    .asyncQuery(
      req.mysqlConnection.SQL_APP.getCashierInkassByCreationDate(
        __apvs,
        __cashierUid
      ),
      [__dateCreationFrom, __dateCreationTo]
    )
    .then(
      (result) => {
        let __inks = {};
        result.forEach((ink) => {
          let __dateKey = String(ink.dateInkass);
          if (__inks?.[ink.sn] == null) {
            __inks[ink.sn] = {};
          }

          if (__dateInkassFrom == null) {
            __dateInkassFrom = ink.dateInkass;
          } else {
            if (__dateInkassFrom > ink.dateInkass)
              __dateInkassFrom = ink.dateInkass;
          }

          if (__dateInkassTo == null) {
            __dateInkassTo = ink.dateInkass;
          } else {
            if (__dateInkassTo < ink.dateInkass)
              __dateInkassTo = ink.dateInkass;
          }

          ink.terminalInkass = false;
          ink.cashierInkass = true;
          ink.delta = ink.cashierSumm;
          ink.cashierSign = JSON.parse(ink.cashierSign || {});
          ink.dontUseSn = ink.dontUseSn == 1 ? true : false;
          ink.isPrihod = ink.isPrihod == 1 ? true : false;

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
      req.mysqlConnection.SQL_APP.getTerminalInkassByInkassDate(__apvs),
      [__dateInkassFrom, __dateInkassTo]
    )
    .then(
      (result) => {
        result.forEach((ink) => {
          let __dateKey = String(ink.dateInkass);
          if (inks?.[ink.sn]?.[__dateKey] != null) {
            inks[ink.sn][__dateKey].terminalInkass = true;
            inks[ink.sn][__dateKey].delta =
              inks[ink.sn][__dateKey].cashierSumm - ink.terminalSumm;
            inks[ink.sn][__dateKey] = Object.assign(
              inks[ink.sn][__dateKey],
              ink
            );
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
  Object.keys(inks).forEach((apv) => {
    Object.keys(inks[apv]).forEach((inkassDate) => {
      __forSortArray.push(inks[apv][inkassDate]);
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
