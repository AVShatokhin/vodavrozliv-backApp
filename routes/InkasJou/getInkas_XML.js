var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/getInkas_XML", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST"])) return;

  let data = {
    queryLength: 0,
    items: [],
  };

  let requestData = JSON.parse(req.query.requestData);

  let __dateInkassFrom = FROM_SECONDS(requestData.dateInkassFrom / 1000);
  let __dateInkassTo = FROM_SECONDS(requestData.dateInkassTo / 1000);
  let __apvs = requestData.apvs;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getInkas_XML(__apvs), [
      __dateInkassFrom,
      __dateInkassTo,
    ])
    .then(
      async (result) => {
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
