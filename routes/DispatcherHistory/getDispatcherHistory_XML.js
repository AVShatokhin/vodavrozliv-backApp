var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/getDispatcherHistory_XML", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["DISPATCHER", "HEAD_OP_DEP"])) return;

  let __requestData = req.body.requestData;
  let __apvs = req.body.requestData.apvs;
  let __dateFrom = FROM_SECONDS(__requestData.dateFrom / 1000);
  let __dateTo = FROM_SECONDS(__requestData.dateTo / 1000);

  let data = {
    queryLength: 0,
    items: [],
  };

  let __apvConfig = {};

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllAPV, [])
    .then(
      (result) => {
        result.forEach((e) => {
          __apvConfig[e.sn] = e;
        });
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
        return;
      }
    );

  let __items = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getDispatcherHistory_XML(__apvs), [
      __dateFrom,
      __dateTo,
    ])
    .then(
      (result) => {
        let __items = [];

        result.forEach((e) => {
          e.chargeObject = JSON.parse(e.chargeObject);
          e.remain = e.v1 - e.v2;
          e.address = __apvConfig[e.sn].address;
          __items.push(e);
        });

        data.queryLength = result.length;

        return __items;
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
        next();
      }
    );

  data.items = __items;

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
