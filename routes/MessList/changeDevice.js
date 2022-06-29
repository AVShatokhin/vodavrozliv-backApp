var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/changeDevice", async function (req, res, next) {
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
    .asyncQuery(req.mysqlConnection.SQL_APP.changeDevice, [
      req.body.deviceName,
      req.body.errorDevice,
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
