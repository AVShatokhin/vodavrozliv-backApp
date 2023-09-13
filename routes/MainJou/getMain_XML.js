var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getMain_XML", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST", "HEAD_OP_DEP"])) return;

  let data = {
    queryLength: 0,
    items: [],
  };

  // let perPage = Number(req.query?.perPage || MAX_PAGE_SIZE);
  // let currentPage = Number(req.query?.currentPage || START_PAGE);

  let apv = {};
  let krug = {};
  let brigs = {};
  let devices = {};
  let messages = {};
  let errors = {};
  let requestData = JSON.parse(req.query.requestData);

  if (requestData?.range == null) {
    let from = new Date();
    from.setHours(0, 0, 0);
    let to = new Date();
    to.setHours(23, 59, 59);

    requestData.range = [from, to];
  } else {
    requestData.range = [
      new Date(requestData.range[0]),
      new Date(requestData.range[1]),
    ];
  }

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getDevices, [])
    .then(
      (result) => {
        result.forEach((e) => {
          devices[e.errorDevice] = e;
        });
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getErrors, [])
    .then(
      (result) => {
        result.forEach((e) => {
          errors[e.errorCode] = e;
        });
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getMessages, [])
    .then(
      (result) => {
        result.forEach((e) => {
          messages[e.messCode] = e;
        });
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllAPV, [])
    .then(
      (result) => {
        result.forEach((e) => {
          apv[e.sn] = e;
        });
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllKrugs, [])
    .then(
      (result) => {
        result.forEach((e) => {
          krug[e.krug_id] = e;
        });
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAllBrigs, [])
    .then(
      (result) => {
        result.forEach((e) => {
          brigs[e.brig_id] = e;
        });
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getMainCount(requestData), [
      requestData.range[0],
      requestData.range[1],
    ])
    .then(
      (result) => {
        data.queryLength = result[0].queryLength;
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getMain_XML(requestData), [
      requestData.range[0],
      requestData.range[1],
    ])
    .then(
      async (result) => {
        result.forEach((e) => {
          let activeKrug = apv?.[e.sn].activeKrug || 0;
          e["krug_name"] = krug?.[activeKrug]?.title || "-";
          e["address"] = apv?.[e.sn].address || "-";
          e["brigName"] = brigs?.[krug?.[activeKrug]?.brig_id]?.brigName || "-";
          e.messCode = JSON.parse(e.messCode);
          e.messages = {};

          e.messCode.forEach((code) => {
            e.messages[code] = messages[code]?.messText || code;
          });
          e["errorText"] = errors?.[e.errorCode]?.errorText || e.errorCode;
          e["deviceName"] =
            devices?.[e.errorDevice]?.deviceName || e.errorDevice;
        });
        data.items = result;
        res.result.data = data;
        res.ok();
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );
});

module.exports = router;
