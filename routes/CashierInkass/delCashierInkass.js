var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/delCashierInkass", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["CASHIER"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.delCashierInkass, [
      req.body.cinkass_id,
      req.session.userData.uid,
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
