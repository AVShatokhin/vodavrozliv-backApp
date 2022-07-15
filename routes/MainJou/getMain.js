var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getMain", async function (req, res, next) {
  if (
    !req.session.checkRole(req, res, [
      "HEAD_ANALYSTOP_DEP",
      "ACCOUNTANT",
      "CASHIER",
      "DEPUTY",
    ])
  )
    return;

  let data = {
    queryLength: 0,
    items: [],
  };

  let perPage = Number(req.query?.perPage || MAX_PAGE_SIZE);
  let currentPage = Number(req.query?.currentPage || START_PAGE);
  let searchQuery = req.query?.searchQuery || "";
  let apv = {};
  let krug = {};
  let requestData = JSON.parse(req.query.requestData);
  //console.log(requestData);

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllAPV, [])
    .then(
      (result) => {
        result.forEach((e) => {
          apv[e.sn] = e;
        });
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllKrugs, [])
    .then(
      (result) => {
        result.forEach((e) => {
          krug[e.krug_id] = e;
        });
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getMainCount, [])
    .then(
      (result) => {
        data.queryLength = result[0].queryLength;
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getMain, [
      currentPage * perPage,
      perPage,
    ])
    .then(
      async (result) => {
        result.forEach((e) => {
          let activeKrug = apv?.[e.sn].activeKrug || 0;
          e["krug_name"] = krug?.[activeKrug]?.title || "-";
          e["address"] = apv?.[e.sn].address || "-";
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

module.exports = router;
