var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/delWashApv", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ENGINEER"])) return;

  let __date = req.body.date;
  let __sn = req.body.sn;

  let __washObject = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getWashByDate, [__date])
    .then(
      (result) => {
        if (result.length > 0) {
          return JSON.parse(result[0].washObject);
        } else {
          return {};
        }
      },
      (err) => {
        console.log(err);
      }
    );

  if (__washObject?.[__sn] != null) {
    delete __washObject[__sn];

    await req.mysqlConnection
      .asyncQuery(req.mysqlConnection.SQL_APP.updateWash, [
        JSON.stringify(__washObject),
        __date,
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
  } else {
    res.ok();
  }
});

module.exports = router;
