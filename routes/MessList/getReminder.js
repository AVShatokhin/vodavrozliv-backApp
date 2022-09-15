var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/getReminder", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["DEPUTY", "HEAD_OP_DEP", "PROGRAMMER"]))
    return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getReminder, ["Reminder"])
    .then(
      (result) => {
        if (result.length == 0) {
          res.result.data = { daylyReminder: true, apvRemindPeriodValue: 0 };
        } else {
          res.result.data = JSON.parse(result[0].value);
        }

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
