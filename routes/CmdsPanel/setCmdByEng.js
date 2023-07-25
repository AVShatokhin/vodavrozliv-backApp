var express = require("express");
var router = express.Router();
const { Telegraf } = require("telegraf");

let commands = {
  "app:on": "Вкл АПВ",
  "app:off": "Выкл АПВ",
  "app:reset": "Перезапуск АПВ",
  info: "Запросить состояние",
  "tara:on": "Вкл пр. тары",
  "tara:off": "Выкл пр. тары",
  "tara:pop": "Пополнить тару",
  "temp:on": "Вкл обогрев",
  "temp:off": "Выкл обогрев",
  "kup:on": "Вкл куп",
  "kup:off": "Выкл куп",
  "mon:on": "Вкл монет",
  "mon:off": "Выкл монет",
  "rd:on": "Вкл б/н",
  "rd:off": "Выкл б/н",
  "alarm:off": "Выключить сигнализацию",
};

/* GET home page. */
router.post("/setCmdByEng", async function (req, res, next) {
  if (!req.session.checkRole(req, res, ["ENGINEER"])) return;

  let cmdProfile = { userData: req.session.userData, cmd: req.body.cmd };

  let token = req.config.botToken;
  const bot = new Telegraf(token);

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.getTGLink, [req.body.sn])
    .then(
      async (result) => {
        if (result[0]?.tgLink) {
          try {
            let ans = await bot.telegram.sendMessage(
              `${result[0].tgLink}`,
              `${req.body.sn} : Пользователем ${
                req.session.userData.email
              } через WEB-интерфейс поставлена в очередь на выполнение команда: \"${
                commands[req.body.cmd]
              }\"!`
            );
          } catch (e) {
            console.log("TELEGRAM_ERROR: " + e?.response?.description);
          }
        } else {
          console.log("TGLINK_NOTFOUND", "Не найдена ссылка на ТГ канал");
        }
      },
      (err) => {
        console.log(err);
      }
    );

  await req.mysqlConnection
    .asyncQuery(req.mysqlConnection.SQL_APP.setCmdByEng, [
      JSON.stringify(cmdProfile),
      req.body.sn,
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
});

module.exports = router;
