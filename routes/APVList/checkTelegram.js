var express = require("express");
var router = express.Router();
const { Telegraf } = require("telegraf");

/* GET home page. */
router.post("/checkTelegram", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["DEPUTY", "HEAD_OP_DEP"])) return;

  let token = req.config.botToken;
  const bot = new Telegraf(token);

  req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getTGLink, [req.body.sn])
    .then(
      async (result) => {
        if (result[0]?.tgLink) {
          try {
            await bot.telegram.sendMessage(
              `@${result[0]?.tgLink}`,
              `${req.body.sn} : Проверка связи!`
            );
            res.ok();
          } catch (e) {
            res.error("TELEGRAM_ERROR", e?.response?.description);
          }
        } else {
          res.error("TGLINK_NOTFOUND", "Не найдена ссылка на ТГ канал");
        }
      },
      (err) => {
        res.error("SQL", err);
        console.log(err);
      }
    );
});

module.exports = router;
