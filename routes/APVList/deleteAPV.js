var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/deleteAPV", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST", "HEAD_OP_DEP"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.deleteAPV, [req.body.sn])
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
