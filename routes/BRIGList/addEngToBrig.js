var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/addEngToBrig", async function (req, res, next) {
  if (
    !(
      req.session.isSession == true &&
      (req.session.userData.roles.includes("DEPUTY") == true ||
        req.session.userData.roles.includes("HEAD_OP_DEP") == true)
    )
  ) {
    res.error("ROLE_ERROR");
    return;
  }

  let brig_id = req.body.brig_id;
  let eng_uid = req.body.eng_uid;

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getBrigMembers, [brig_id])
    .then(
      async (result) => {
        if (result.length > 0) {
          let brigMembers = Array.from(JSON.parse(result[0].brigMembers));
          if (brigMembers.findIndex((e) => e == eng_uid) == -1) {
            brigMembers.push(eng_uid);
            updateMembersInBrig(req, res, brig_id, brigMembers);
          }
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
