var express = require("express");
var router = express.Router();

const MAX_PAGE_SIZE = 50;
const START_PAGE = 0;

/* GET home page. */
router.get("/getBuhActual", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ACCOUNTANT"])) return;

  let data = {
    queryLength: 0,
    items: [],
  };

  let __perPage = Number(req.query?.perPage || MAX_PAGE_SIZE);
  let __currentPage = Number(req.query?.currentPage || START_PAGE);

  let requestData = JSON.parse(req.query.requestData);

  let __apvs = requestData.apvs;
  let __loadXML = req.query?.loadXML;

  let __unPagedArray = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getBuhActuals(__apvs), [])
    .then(
      (result) => {
        result.forEach((e) => {
          e.value = JSON.parse(e.value);
        });
        return result;
      },
      (err) => {
        console.log(err);
      }
    );

  // switch (requestData.sortType) {
  //   case 0: // startLts
  //     __unPagedArray = problems.sort((a, b) => {
  //       return a.startLts <= b.startLts ? 1 : -1;
  //     });
  //     break;
  //   case 1: // sn
  //     __unPagedArray = problems.sort((a, b) => {
  //       return a.sn > b.sn ? 1 : -1;
  //     });
  //     break;
  //   case 2: // long
  //     __unPagedArray = problems.sort((a, b) => {
  //       if (a.startLts == a.stopLts) return -1;
  //       return a.long < b.long ? 1 : -1;
  //     });
  //     break;

  //   default:
  //     break;
  // }

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

  res.result.data = data;

  res.ok();
});

module.exports = router;
