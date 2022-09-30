var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/getSnSelectorData", async function (req, res, next) {
  if (
    !req.session.checkRole(req, res, [
      "ANALYST",
      "ACCOUNTANT",
      "CASHIER",
      "DEPUTY",
      "HEAD_OP_DEP",
      "ENGINEER",
      "PROGRAMMER",
      "DISPATCHER",
    ])
  )
    return;

  let structure = {
    apvs: {},
    krugs: {},
    brigs: {},
    engs: {},
  };

  let __failed = false;
  let __error;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllAPV, [])
    .then(
      (result) => {
        result.forEach((e) => {
          structure.apvs[e.sn] = e;
        });
      },
      (err) => {
        __failed = true;
        __error = err;
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllKrugs, [])
    .then(
      (result) => {
        result.forEach((e) => {
          structure.krugs[e.krug_id] = e;
        });
      },
      (err) => {
        __failed = true;
        __error = err;
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllEngs, ["ENGINEER"])
    .then(
      (result) => {
        result.forEach((e) => {
          e.extended = JSON.parse(e.extended);
          structure.engs[e.uid] = e;
        });
      },
      (err) => {
        __failed = true;
        __error = err;
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllBrigs, [])
    .then(
      (result) => {
        result.forEach((e) => {
          e.brigMembers = JSON.parse(e.brigMembers);
          structure.brigs[e.brig_id] = e;
        });
      },
      (err) => {
        __failed = true;
        __error = err;
        console.log(err);
      }
    );

  if (__failed) {
    res.error("SQL", __error);
  } else {
    res.result.data = structure;
    res.ok();
  }
});

module.exports = router;
