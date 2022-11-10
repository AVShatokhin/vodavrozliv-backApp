var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/getAllErrorsAndDevices", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST", "HEAD_OP_DEP"])) return;

  let errorsModel = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getErrorsNormal, [])
    .then(
      (result) => {
        return result;
      },
      (err) => {
        console.log(err);
      }
    );

  let devicesModel = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getDevicesNormal, [])
    .then(
      (result) => {
        return result;
      },
      (err) => {
        console.log(err);
      }
    );

  res.result.data = {
    errorsModel,
    devicesModel,
  };
  res.ok();
});

module.exports = router;
