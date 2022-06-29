var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/setCmdInkas", async function (req, res, next) {
  if (
    !(
      req.session.isSession == true &&
      req.session.userData.roles.includes("ACCOUNTANT") == true
    )
  ) {
    res.error("ROLE_ERROR");
    return;
  }

  let cmdProfile = { userData: req.session.userData, cmd: req.body.cmd };

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.setCmdInkas, [
      JSON.stringify(cmdProfile),
      req.body.sn,
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
