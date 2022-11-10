var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/getDevices", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST", "PROGRAMMER"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getDevices, [])
    .then(
      (result) => {
        res.result.data = { items: result };
        res.ok();
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
        return;
      }
    );
});

module.exports = router;
