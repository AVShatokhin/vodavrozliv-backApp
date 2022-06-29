var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/getApvByEng", async function (req, res, next) {
  if (
    !(
      req.session.isSession == true &&
      req.session.userData.roles.includes("ENGINEER") == true
    )
  ) {
    res.error("ROLE_ERROR");
    return;
  }

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getApvByEng, [
      req.session.userData.uid,
    ])
    .then(
      (result) => {
        result.forEach((e) => {
          e.cmdProfile = JSON.parse(e.cmdProfile);
        });
        res.result.data = result;
        res.ok();
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );
});

module.exports = router;
