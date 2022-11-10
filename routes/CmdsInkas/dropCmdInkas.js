var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/dropCmdInkas", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.dropCmdInkas, [req.body.sn])
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
