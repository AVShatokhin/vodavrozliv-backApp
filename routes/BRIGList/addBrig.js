var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/addBrig", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["DEPUTY", "HEAD_OP_DEP"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.addBrig, [
      req.body.brigName,
      req.body.brigCar,
      req.body.brigKey,
      req.body.brigPhone,
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
