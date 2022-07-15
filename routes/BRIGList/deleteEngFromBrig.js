var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/deleteEngFromBrig", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["DEPUTY", "HEAD_OP_DEP"])) return;

  let brig_id = req.body.brig_id;
  let eng_uid = req.body.eng_uid;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getBrigMembers, [brig_id])
    .then(
      async (result) => {
        if (result.length > 0) {
          let brigMembers = JSON.parse(result[0].brigMembers);
          let newBrigMembers = brigMembers.filter((e) => eng_uid != e);
          updateMembersInBrig(req, res, brig_id, newBrigMembers);
        } else {
          res.ok();
        }
      },
      (err) => {
        console.log(err);
        res.error("SQL", err);
      }
    );
});

let updateMembersInBrig = async (req, res, brig_id, brigMembers) => {
  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.updateMembersInBrig, [
      JSON.stringify(brigMembers),
      brig_id,
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
};

module.exports = router;
