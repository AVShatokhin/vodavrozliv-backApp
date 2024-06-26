var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/addWashApv", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["DISPATCHER", "HEAD_OP_DEP"])) return;

  let __date = FROM_SECONDS(req.body.data.date);
  let __sn = req.body.data.sn;
  let __user = req.body.data.user;
  let __uid = req.body.data.uid;
  let __comment = req.body.data.comment;

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

  if (__washObject?.[__sn] == null) {
    __washObject[__sn] = {
      sn: __sn,
      comment: __comment,
      user: __user,
      uid: __uid,
    };

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

let FROM_SECONDS = (seconds) => {
  let __date = new Date();
  __date.setTime(seconds * 1000);
  return `${1900 + __date.getYear()}-${
    1 + __date.getMonth() > 9
      ? 1 + __date.getMonth()
      : "0" + (1 + __date.getMonth())
  }-${__date.getDate() > 9 ? __date.getDate() : "0" + __date.getDate()}`;
};

module.exports = router;
