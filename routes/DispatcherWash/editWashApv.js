var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/editWashApv", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["DISPATCHER", "HEAD_OP_DEP"])) return;

  let __oldDate = FROM_SECONDS(req.body.oldDate);
  let __newDate = FROM_SECONDS(req.body.newDate);
  let __newSn = req.body.newSn;
  let __oldSn = req.body.oldSn;
  let __user = req.body.user;
  let __uid = req.body.uid;
  let __comment = req.body.comment;

  let __oldWashObject = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getWashByDate, [__oldDate])
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

  if (__oldWashObject?.[__oldSn] == null) {
    // если менять нечено уходим
    res.ok();
  } else {
    if ((__oldDate != __newDate) | (__oldSn != __newSn)) {
      // удаляем из старой версии объекта wash и из новой тоже
      // не переставлять этот блок, сначала удаляем, потом внонис исправления
      delete __oldWashObject[__oldSn];

      await req.mysqlConnection
        .asyncQuery(req.mysqlConnection.SQL_APP.updateWash, [
          JSON.stringify(__oldWashObject),
          __oldDate,
        ])
        .then(
          (result) => {},
          (err) => {
            res.error("SQL", err);
            console.log(err);
          }
        );
    }

    let __newWashObject = await req.mysqlConnection
      .asyncQuery(req.mysqlConnection.SQL_APP.getWashByDate, [__newDate])
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

    if (__newWashObject?.[__newSn] == null) {
      // если он там нет - добавляем
      __newWashObject[__newSn] = {
        sn: __newSn,
        comment: __comment,
        user: __user,
        uid: __uid,
      };
    } else {
      // если он там есть добавляем
      __newWashObject[__newSn].sn = __newSn;
      __newWashObject[__newSn].comment = __comment;
      __newWashObject[__newSn].user = __user;
      __newWashObject[__newSn].uid = __uid;
    }

    await req.mysqlConnection
      .asyncQuery(req.mysqlConnection.SQL_APP.updateWash, [
        JSON.stringify(__newWashObject),
        __newDate,
      ])
      .then(
        (result) => {},
        (err) => {
          res.error("SQL", err);
          console.log(err);
        }
      );

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
