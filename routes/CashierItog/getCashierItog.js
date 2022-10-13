var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/getCashierItog", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["CASHIER"])) return;

  let data = {
    queryLength: 0,
    items: [],
  };

  let requestData = JSON.parse(req.query.requestData);

  let __dateCreationFrom = FROM_SECONDS(requestData.dateCreationFrom / 1000);
  let __dateCreationTo = FROM_SECONDS(requestData.dateCreationTo / 1000);

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getCashierItog, [
      req.session.userData.uid,
      __dateCreationFrom,
      __dateCreationTo,
    ])
    .then(
      (result) => {
        res.result.data = result;
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
