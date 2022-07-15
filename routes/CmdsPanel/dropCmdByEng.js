var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/dropCmdByEng", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ENGINEER"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.dropCmdByEng, [req.body.sn])
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
