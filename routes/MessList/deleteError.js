var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/deleteError", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["PROGRAMMER"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.deleteError, [req.body.errorCode])
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
