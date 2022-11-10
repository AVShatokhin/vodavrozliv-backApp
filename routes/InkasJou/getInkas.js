var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getInkas", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST"])) return;

  let data = {
    queryLength: 0,
    items: [],
  };

  let perPage = Number(req.query?.perPage || MAX_PAGE_SIZE);
  let currentPage = Number(req.query?.currentPage || START_PAGE);

  let requestData = JSON.parse(req.query.requestData);

  let __dateInkassFrom = FROM_SECONDS(requestData.dateInkassFrom / 1000);
  let __dateInkassTo = FROM_SECONDS(requestData.dateInkassTo / 1000);
  let __apvs = requestData.apvs;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getInkasCount(__apvs), [
      __dateInkassFrom,
      __dateInkassTo,
    ])
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

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getInkas(__apvs), [
      __dateInkassFrom,
      __dateInkassTo,
      currentPage * perPage,
      perPage,
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
