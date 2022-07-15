var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/changeKrugTitle", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["HEAD_OP_DEP", "DEPUTY"])) return;

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
