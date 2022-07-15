var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/changeBrigKrug", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["DEPUTY", "HEAD_OP_DEP"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.changeBrigKrug, [
      0,
      req.body.oldActiveKrug,
    ])
    .then(
      (result) => {},
      (err) => {
        res.error("SQL", err);
        console.log(err);
        return;
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.changeBrigKrug, [
      req.body.brig_id,
      req.body.newActiveKrug,
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
