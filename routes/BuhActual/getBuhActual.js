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
  let __sortType = requestData?.sortType || 0;

  let __rawUnPagedArray = await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getBuhActuals(__apvs), [])
    .then(
      (result) => {
        result.forEach((e) => {
          e.value = JSON.parse(e.value);
          e.nal = Number(e.value?.k || 0) + Number(e.value?.m || 0);
        });
        return result;
      },
      (err) => {
        console.log(err);
      }
    );

  let __unPagedArray = [];

  switch (__sortType) {
    case 0: // sn
      __unPagedArray = __rawUnPagedArray.sort((a, b) => {
        return a.sn > b.sn ? 1 : -1;
      });
      break;
    case 1: // low
      __unPagedArray = __rawUnPagedArray.sort((a, b) => {
        return a.nal < b.nal ? 1 : -1;
      });
      break;
    case 2: // rise
      __unPagedArray = __rawUnPagedArray.sort((a, b) => {
        return a.nal >= b.nal ? 1 : -1;
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

  res.result.data = data;

  res.ok();
});

module.exports = router;
