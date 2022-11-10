var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/getErrors", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST", "PROGRAMMER"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getErrors, [])
    .then(
      (result) => {
        result.forEach((e) => {
          if (e?.isActive == 1) {
            e.isActive = true;
          } else {
            e.isActive = false;
          }
        });
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
