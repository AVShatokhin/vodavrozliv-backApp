var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/setInkassPrihod", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.setInkassPrihod, [
      req.body.isPrihod,
      req.body.cinkass_id,
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
