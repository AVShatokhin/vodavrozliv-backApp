var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getAPV_XML", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST", "HEAD_OP_DEP"])) return;

  let searchQuery = req.query?.searchQuery || "";

  let data = {
    queryLength: 0,
    items: {},
  };

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAPV_XML, [
      searchQuery,
      searchQuery,
      searchQuery,
      searchQuery,
      searchQuery,
    ])
    .then(
      async (result) => {
        result.forEach((element) => {
          data.items[element.sn] = element;
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
