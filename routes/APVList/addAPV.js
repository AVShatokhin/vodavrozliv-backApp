var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.post("/addAPV", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["DEPUTY", "HEAD_OP_DEP"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.addAPV, [
      req.body.sn,
      req.body.address,
      req.body.tgLink,
      req.body.snEQ,
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
