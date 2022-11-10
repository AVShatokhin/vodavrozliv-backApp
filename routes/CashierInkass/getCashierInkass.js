var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getCashierInkass", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["CASHIER"])) return;

  let data = {
    queryLength: 0,
    items: [],
  };

  let perPage = Number(req.query?.perPage || MAX_PAGE_SIZE);
  let currentPage = Number(req.query?.currentPage || START_PAGE);
  let requestData = JSON.parse(req.query.requestData);

  let __dateCreationFrom = FROM_SECONDS(requestData.dateCreationFrom / 1000);
  let __dateCreationTo = FROM_SECONDS(requestData.dateCreationTo / 1000);
  let __dateInkassFrom = FROM_SECONDS(requestData.dateInkassFrom / 1000);
  let __dateInkassTo = FROM_SECONDS(requestData.dateInkassTo / 1000);

  await req.mysqlConnection
    .asyncQuery(
      req.mysqlConnection.SQL_APP.getCashierInkassCount(requestData),
      [
        req.session.userData.uid,
        __dateCreationFrom,
        __dateCreationTo,
        __dateInkassFrom,
        __dateInkassTo,
      ]
    )
    .then(
      (result) => {
        data.queryLength = result[0].queryLength;
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
        return;
      }
    );

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

  res.result.podItog = await req.mysqlConnection
    .asyncQuery(
      req.mysqlConnection.SQL_APP.getCashierInkassPodItog(requestData),
      [
        req.session.userData.uid,
        __dateCreationFrom,
        __dateCreationTo,
        __dateInkassFrom,
        __dateInkassTo,
      ]
    )
    .then(
      (result) => {
        if (result[0].count == 0) {
          return { count: 0, m1: 0, m2: 0, m5: 0, m10: 0, k: 0 };
        } else {
          return result[0];
        }
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getCashierInkass(requestData), [
      req.session.userData.uid,
      __dateCreationFrom,
      __dateCreationTo,
      __dateInkassFrom,
      __dateInkassTo,
      currentPage * perPage,
      perPage,
    ])
    .then(
      async (result) => {
        result.forEach((ink) => {
          ink["isPrihod"] = ink?.isPrihod == 1 ? true : false;
          ink["dontUseSn"] = ink?.dontUseSn == 1 ? true : false;
        });
        data.items = result;
        res.result.data = data;
        res.ok();
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );
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
