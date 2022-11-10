var express = require("express");
var router = express.Router();
const config = require("../../../etc/config");

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getBuhReport", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ACCOUNTANT"])) return;

  let data = {
    queryLength: 0,
    items: [],
    podItog: {},
  };

  let __perPage = Number(req.query?.perPage || MAX_PAGE_SIZE);
  let __currentPage = Number(req.query?.currentPage || START_PAGE);

  let requestData = JSON.parse(req.query.requestData);

  let __dateFrom = FROM_SECONDS(requestData.dateFrom / 1000);
  let __dateTo = FROM_SECONDS(requestData.dateTo / 1000);
  let __apvs = requestData.apvs;

  let __loadXML = req.query?.loadXML;

  data.podItog = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getBuhReportPoditog(__apvs), [
      __dateFrom,
      __dateTo,
    ])
    .then(
      (result) => {
        if (result?.length > 0) {
          return result[0];
        } else {
          return {};
        }
      },
      (err) => {
        console.log(err);
      }
    );

  if (__loadXML) {
    data.items = await req.mysqlConnection
      .asyncQuery(req.mysqlConnection.SQL_APP.getBuhReportUnlim(__apvs), [
        __dateFrom,
        __dateTo,
      ])
      .then(
        (result) => {
          return result;
        },
        (err) => {
          console.log(err);
        }
      );
  } else {
    data.queryLength = await req.mysqlConnection
      .asyncQuery(req.mysqlConnection.SQL_APP.getBuhReportCount(__apvs), [
        __dateFrom,
        __dateTo,
      ])
      .then(
        (result) => {
          if (result.length > 0) {
            return result[0].queryLength;
          } else {
            return 0;
          }
        },
        (err) => {
          console.log(err);
        }
      );

    data.items = await req.mysqlConnection
      .asyncQuery(req.mysqlConnection.SQL_APP.getBuhReport(__apvs), [
        __dateFrom,
        __dateTo,
        __currentPage * __perPage,
        __perPage,
      ])
      .then(
        (result) => {
          return result;
        },
        (err) => {
          console.log(err);
        }
      );
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
