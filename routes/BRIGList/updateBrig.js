var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/updateBrig", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST", "HEAD_OP_DEP"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.updateBrig, [
      req.body.brigName,
      req.body.brigCar,
      req.body.brigKey,
      req.body.brigPhone,
      req.body.brig_id,
    ])
    .then(
      (result) => {
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
