var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/getAllCashiers", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST"])) return;

  let cashiers = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllCashiers, ["CASHIER"])
    .then(
      (result) => {
        result.forEach((e) => {
          e.extended = JSON.parse(e.extended);
        });
        return result;
      },
      (err) => {
        console.log(err);
      }
    );

  res.result.data = cashiers;
  res.ok();
});

module.exports = router;
