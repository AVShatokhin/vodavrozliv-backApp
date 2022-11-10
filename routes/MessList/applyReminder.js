var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/applyReminder", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST", "PROGRAMMER"])) return;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.applyReminder, [
      "Reminder",
      JSON.stringify({
        daylyReminder:
          req.body?.daylyReminder == null ? false : req.body.daylyReminder,
        apvRemindPeriodValue:
          req.body?.apvRemindPeriodValue == null
            ? 0
            : req.body.apvRemindPeriodValue,
      }),
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
