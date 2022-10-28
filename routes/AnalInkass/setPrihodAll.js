var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/setPrihodAll", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST"])) return;

  let __cinkass_ids = req.body.cinkass_ids;

  await req.mysqlConnection
    .asyncQuery(
      req.mysqlConnection.SQL_APP.setInkassMassPrihod(__cinkass_ids),
      [true]
    )
    .then(
      (result) => {},
      (err) => {
        console.log(err);
      }
    );

  res.ok();
});

module.exports = router;
