var express = require("express");
var router = express.Router();
const config = require("../../../etc/config");

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getAnalErrors", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ANALYST", "HEAD_OP_DEP"])) return;

  let data = {
    queryLength: 0,
    items: [],
  };

  let __perPage = Number(req.query?.perPage || MAX_PAGE_SIZE);
  let __currentPage = Number(req.query?.currentPage || START_PAGE);

  let requestData = JSON.parse(req.query.requestData);

  let __errorDateFrom = FROM_SECONDS(requestData.errorDateFrom / 1000);
  let __errorDateTo = FROM_SECONDS(requestData.errorDateTo / 1000);
  let __apvs = requestData.apvs;
  let __selectedDevices = requestData.devices;
  let __selectedErrors = requestData.errors;

  let __loadXML = req.query?.loadXML;

  let apvs = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getAPVAddressAndBrig, [])
    .then(
      (result) => {
        let __apvInfo = {};
        result.forEach((apv) => {
          __apvInfo[apv.sn] = apv;
        });
        return __apvInfo;
      },
      (err) => {
        console.log(err);
      }
    );

  let errors = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getErrorsNormal, [])
    .then(
      (result) => {
        let __errors = {};
        result.forEach((err) => {
          __errors[err.errorCode] = err.errorText;
        });
        return __errors;
      },
      (err) => {
        console.log(err);
      }
    );

  let devices = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getDevicesNormal, [])
    .then(
      (result) => {
        let __devices = {};
        result.forEach((device) => {
          __devices[device.errorDevice] = device.deviceName;
        });
        return __devices;
      },
      (err) => {
        console.log(err);
      }
    );

  let problems = await req.mysqlConnection
    .asyncQuery(
      req.mysqlConnection.SQL_APP.getProblems(
        __apvs,
        __selectedErrors,
        __selectedDevices
      ),
      [__errorDateFrom, __errorDateTo]
    )
    .then(
      (result) => {
        let __problems = [];
        let __activeProblems = {};

        result.forEach((pr) => {
          let __sn = pr.sn;
          let __errorCode = pr.errorCode;
          let __errorDevice = pr.errorDevice;
          let __key = `${__sn}:${__errorDevice}:${__errorCode}`;
          let __enabled = pr.enabled == 1 ? true : false;

          if (__enabled) {
            if (__activeProblems?.[__key] == null) {
              // если ещё не было - добавляем
              __activeProblems[__key] = pr;
            }
          } else {
            if (__activeProblems?.[__key] != null) {
              // если была - финализируем, сохраняем и удаляем
              __problems.push({
                sn: __activeProblems[__key].sn,
                errorDevice: __activeProblems[__key].errorDevice,
                errorCode: __activeProblems[__key].errorCode,
                startLts: __activeProblems[__key].lts,
                stopLts: pr.lts,
                long: (pr.lts - __activeProblems[__key].lts) / 1000,
                deviceName: devices?.[__activeProblems[__key].errorDevice],
                errorText: errors?.[__activeProblems[__key].errorCode],
                address: apvs?.[__activeProblems[__key].sn]?.address,
                brigName: apvs?.[__activeProblems[__key].sn]?.brigName,
              });
              delete __activeProblems[__key];
            }
          }
        });

        Object.values(__activeProblems).forEach((pr) => {
          __problems.push({
            sn: pr.sn,
            errorDevice: pr.errorDevice,
            errorCode: pr.errorCode,
            startLts: pr.lts,
            stopLts: pr.lts,
            long: 0,
            deviceName: devices?.[pr.errorDevice],
            errorText: errors?.[pr.errorCode],
            address: apvs?.[pr.sn]?.address,
            brigName: apvs?.[pr.sn]?.brigName,
          });
        });

        return __problems;
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
        return;
      }
    );

  let __unPagedArray = [];

  switch (requestData.sortType) {
    case 0: // startLts
      __unPagedArray = problems.sort((a, b) => {
        return a.startLts <= b.startLts ? 1 : -1;
      });
      break;
    case 1: // sn
      __unPagedArray = problems.sort((a, b) => {
        return a.sn > b.sn ? 1 : -1;
      });
      break;
    case 2: // long
      __unPagedArray = problems.sort((a, b) => {
        if (a.startLts == a.stopLts) return -1;
        return a.long < b.long ? 1 : -1;
      });
      break;

    default:
      break;
  }

  data.queryLength = __unPagedArray.length;

  if (__loadXML) {
    data.items = __unPagedArray;
  } else {
    let __pagedArray = [];

    for (const [index, element] of __unPagedArray.entries()) {
      if (
        (index >= __currentPage * __perPage) &
        (index < (__currentPage + 1) * __perPage)
      ) {
        __pagedArray.push(element);
      }
    }

    data.items = __pagedArray;
  }

  // res.result.apvs = await req.mysqlConnection
  //   .asyncQuery(req.mysqlConnection.SQL_APP.getAllAPV, [])
  //   .then(
  //     (result) => {
  //       return result;
  //     },
  //     (err) => {
  //       res.error("SQL", err);
  //       console.log(err);
  //     }
  //   );

  res.result.data = data;

  res.ok();
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
