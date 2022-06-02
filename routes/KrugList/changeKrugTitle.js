var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/changeKrugTitle", async function (req, res, next) {
  if (
    !(
      req.session.isSession == true &&
      (req.session.userData.roles.includes("DEPUTY") == true ||
        req.session.userData.roles.includes("HEAD_OP_DEP") == true)
    )
  ) {
    res.error("ROLE_ERROR");
    return;
  }

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.changeKrugTitle, [
      req.body.newTitle,
      req.body.krug_id,
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
