var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/addDevice", async function (req, res, next) {
  if (
    !(
      req.session.isSession == true &&
      req.session.userData.roles.includes("PROGRAMMER") == true
    )
  ) {
    res.error("ROLE_ERROR");
    return;
  }

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.addDevice, [
      req.body.errorDevice,
      req.body.deviceName,
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
