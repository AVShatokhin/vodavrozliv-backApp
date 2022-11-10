var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getKrug", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["HEAD_OP_DEP", "ANALYST"])) return;

  let data = {
    queryLength: 0,
    items: {},
  };

  let perPage = Number(req.query?.perPage || MAX_PAGE_SIZE);
  let currentPage = Number(req.query?.currentPage || START_PAGE);
  let searchQuery = req.query?.searchQuery || "";

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getKrugCount, [searchQuery])
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
    .asyncQuery(req.mysqlConnection.SQL_APP.getKrug, [
      searchQuery,
      currentPage * perPage,
      perPage,
    ])
    .then(
      async (result) => {
        result.forEach((element) => {
          data.items[element.krug_id] = element;
        });

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
