var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/addKrug", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["HEAD_OP_DEP", "DEPUTY"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.addKrug, [req.body.title])
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
