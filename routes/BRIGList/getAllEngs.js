var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getAllEngs", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST", "HEAD_OP_DEP"])) return;

  let data = {
    queryLength: 0,
    items: {},
  };

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllEngs, ["ENGINEER"])
    .then(
      async (result) => {
        result.forEach((element) => {
          element.extended = JSON.parse(element.extended);
        });

        res.result.data = result;
        res.ok();
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );
});

module.exports = router;
