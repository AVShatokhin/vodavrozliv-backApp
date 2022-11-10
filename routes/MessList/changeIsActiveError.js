var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/changeIsActiveError", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST", "PROGRAMMER"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.changeIsActiveError, [
      req.body.isActive,
      req.body.errorCode,
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
