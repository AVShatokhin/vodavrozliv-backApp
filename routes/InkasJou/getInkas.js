var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getInkas", async function (req, res, next) {
  if (
    !(
      req.session.isSession == true &&
      (req.session.userData.roles.includes("DEPUTY") == true ||
        req.session.userData.roles.includes("HEAD_ANALYSTOP_DEP") == true ||
        req.session.userData.roles.includes("ACCOUNTANT") == true ||
        req.session.userData.roles.includes("CASHIER") == true)
    )
  ) {
    res.error("ROLE_ERROR");
    return;
  }

  let data = {
    queryLength: 0,
    items: [],
  };

  let perPage = Number(req.query?.perPage || MAX_PAGE_SIZE);
  let currentPage = Number(req.query?.currentPage || START_PAGE);
  let searchQuery = req.query?.searchQuery || "";

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getInkasCount, [])
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
    .asyncQuery(req.mysqlConnection.SQL_APP.getInkas, [
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

module.exports = router;
