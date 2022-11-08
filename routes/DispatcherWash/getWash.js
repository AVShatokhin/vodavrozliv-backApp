var express = require("express");
var router = express.Router();
const config = require("../../../etc/config");

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getWash", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST"])) return;

  let data = {
    queryLength: 0,
    items: [],
  };

  let __perPage = Number(req.query?.perPage || MAX_PAGE_SIZE);
  let __currentPage = Number(req.query?.currentPage || START_PAGE);

  let requestData = JSON.parse(req.query.requestData);

  let __dateFrom = requestData.dateFrom / 1000;
  let __dateTo = requestData.dateTo / 1000;
  let __i = 0;

  let __dates = {};

  while (__dateFrom + __i * 24 * 3600 < __dateTo) {
    __dates[FROM_SECONDS(__dateFrom + __i * 24 * 3600)] = {};
    __i++;
  }

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

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getWash, [
      FROM_SECONDS(__dateFrom),
      FROM_SECONDS(__dateTo),
    ])
    .then(
      (result) => {
        result.forEach((r) => {
          let date = FROM_SECONDS(
            Math.round(new Date(r.dateUnique).getTime() / 1000)
          );
          __dates[date] = JSON.parse(r.washObject);
        });
      },
      (err) => {
        console.log(err);
      }
    );

  let __unPagedArray = [];

  Object.keys(__dates)
    .sort()
    .forEach((dateUnique) => {
      __unPagedArray.push({
        date: dateUnique,
        washObject: __dates[dateUnique],
      });
    });

  // switch (requestData.sortType) {
  //   case 0: // startLts
  //     __unPagedArray = problems.sort((a, b) => {
  //       return a.startLts <= b.startLts ? 1 : -1;
  //     });
  //     break;
  //   case 1: // sn
  //     __unPagedArray = problems.sort((a, b) => {
  //       return a.sn > b.sn ? 1 : -1;
  //     });
  //     break;
  //   case 2: // long
  //     __unPagedArray = problems.sort((a, b) => {
  //       if (a.startLts == a.stopLts) return -1;
  //       return a.long < b.long ? 1 : -1;
  //     });
  //     break;

  //   default:
  //     break;
  // }

  data.queryLength = __unPagedArray.length;

  // if (__loadXML) {
  //   data.items = __unPagedArray;
  // } else {
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

  // }

  data.apvs = apvs;
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
