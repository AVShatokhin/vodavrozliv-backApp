var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/getDispatcherFilterStructure", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["DISPATCHER"])) return;

  let structure = {
    apvs: {},
    krugs: {},
    brigs: {},
    engs: {},
    // devices: {},
    // errors: {},
    // messages: {},
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

  // await req.mysqlConnection
  //   .asyncQuery(req.mysqlConnection.SQL_APP.getDevices, [])
  //   .then(
  //     (result) => {
  //       result.forEach((e) => {
  //         structure.devices[e.errorDevice] = e;
  //       });
  //     },
  //     (err) => {
  //       __failed = true;
  //       __error = err;
  //       console.log(err);
  //     }
  //   );

  // await req.mysqlConnection
  //   .asyncQuery(req.mysqlConnection.SQL_APP.getErrors, [])
  //   .then(
  //     (result) => {
  //       result.forEach((e) => {
  //         structure.errors[e.errorCode] = e;
  //       });
  //     },
  //     (err) => {
  //       __failed = true;
  //       __error = err;
  //       console.log(err);
  //     }
  //   );

  // await req.mysqlConnection
  //   .asyncQuery(req.mysqlConnection.SQL_APP.getMessages, [])
  //   .then(
  //     (result) => {
  //       result.forEach((e) => {
  //         structure.messages[e.messCode] = e;
  //       });
  //     },
  //     (err) => {
  //       __failed = true;
  //       __error = err;
  //       console.log(err);
  //     }
  //   );

  if (__failed) {
    res.error("SQL", __error);
  } else {
    res.result.data = structure;
    res.ok();
  }
});

module.exports = router;
