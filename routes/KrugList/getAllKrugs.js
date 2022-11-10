var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/getAllKrugs", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["HEAD_OP_DEP", "ANALYST"])) return;

  let data = [];

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllKrugs, [])
    .then(
      async (result) => {
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
