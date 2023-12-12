var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/getAllWashers", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["DISPATCHER", "HEAD_OP_DEP"])) return;

  let data = {
    queryLength: 0,
    items: {},
  };

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllWashers, ["default"])
    .then(
      async (result) => {
        result.forEach((element) => {
          element.extended = JSON.parse(element.extended);
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
