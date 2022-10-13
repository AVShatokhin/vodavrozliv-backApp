var express = require("express");
var router = express.Router();

let FROM_SECONDS = (seconds) => {
  let __date = new Date();
  __date.setTime(seconds * 1000);
  return `${1900 + __date.getYear()}-${
    1 + __date.getMonth() > 9
      ? 1 + __date.getMonth()
      : "0" + (1 + __date.getMonth())
  }-${__date.getDate() > 9 ? __date.getDate() : "0" + __date.getDate()}`;
};

/* GET home page. */
router.post("/addCashierInkass", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["CASHIER"])) return;

  let __dateInkass = FROM_SECONDS(req.body.data.dateInkass);
  let __dateCreation = FROM_SECONDS(req.body.data.dateCreation);
  let __m1 = Number(req.body.data.m1) || 0;
  let __m2 = Number(req.body.data.m2) || 0;
  let __m5 = Number(req.body.data.m5) || 0;
  let __m10 = Number(req.body.data.m10) || 0;
  let __k = Number(req.body.data.k) || 0;
  let __summ = __m1 + 2 * __m2 + 5 * __m5 + 10 * __m10 + __k;
  let __sn = req.body.data.sn;
  let __duplikateSn = req.body.data.sn;

  let _isDuplikate =
    (await req.mysqlConnection
      .asyncQuery(req.mysqlConnection.SQL_APP.checkDuplikateInkass, [
        __sn,
        __dateInkass,
      ])
      .then(
        (result) => {
          return result.length > 0;
        },
        (err) => {
          res.error("SQL", err);
          console.log(err);
        }
      )) && __sn != "";

  if (_isDuplikate) {
    __sn = "";
  } else {
    __duplikateSn = "";
  }

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.addCashierInkass, [
      __sn,
      __duplikateSn,
      __dateInkass,
      __dateCreation,
      __m1,
      __m2,
      __m5,
      __m10,
      __k,
      __summ,
      req.body.data.comment,
      req.body.data.dontUseSn,
      _isDuplikate,
      JSON.stringify(req.session.userData),
      req.session.userData.uid,
    ])
    .then(
      (result) => {
        res.ok();
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );
});

module.exports = router;
