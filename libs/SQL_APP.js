let _config;

module.exports = (config) => {
  _config = config;

  return {
    getAPV: `SELECT sn, a, address, activeKrug, tgLink, snEQ, cost, phone, version, linkState, oper, lts from apv WHERE sn like CONCAT('%',?,'%') or address like CONCAT('%',?,'%') or oper like CONCAT('%',?,'%') or phone like CONCAT('%',?,'%') or snEQ like CONCAT('%',?,'%') order by sn LIMIT ?, ?`,
    getAPV_XML: `SELECT sn, a, address, activeKrug, tgLink, snEQ, cost, phone, version, linkState, oper, lts from apv WHERE sn like CONCAT('%',?,'%') or address like CONCAT('%',?,'%') or oper like CONCAT('%',?,'%') or phone like CONCAT('%',?,'%') or snEQ like CONCAT('%',?,'%') order by sn`,
    getAPVCount: `SELECT count(*) as queryLength from apv WHERE sn like CONCAT('%',?,'%') or address like CONCAT('%',?,'%') or phone like CONCAT('%',?,'%') or oper like CONCAT('%',?,'%') or snEQ like CONCAT('%',?,'%')`,
    getAllAPV: `SELECT sn, address, activeKrug, a from apv`,
    getTGLink: `SELECT tgLink from apv where sn=?`,
    addAPV: `INSERT into apv set sn=?, address=?, tgLink=?, snEQ=?`,
    deleteAPV: `DELETE from apv where sn=?`,
    updateApvOptions: `UPDATE apv set address=?, tgLink=?, snEQ=? where sn=?`,
    changeApvKrug: `UPDATE apv set activeKrug=? where sn=?`,
    addKrug: `INSERT into krug set title=?`,
    getKrug: `SELECT krug_id, title, brig_id FROM krug WHERE title like CONCAT('%',?,'%') LIMIT ?, ?`,
    getAllKrugs: `SELECT krug_id, title, brig_id FROM krug`,
    getKrugCount: `SELECT count(*) as queryLength from krug WHERE title like CONCAT('%',?,'%')`,
    deleteKrug: `DELETE from krug WHERE krug_id=?`,
    changeKrugTitle: `UPDATE krug SET title=? where krug_id=?`,
    getAllEngs: `SELECT uid, extended, email  FROM ${config.db_prefix}_users WHERE roles like CONCAT('%',?,'%') order by uid`,
    getAllWashers: `SELECT uid, extended, email  FROM ${config.db_prefix}_users WHERE roles like CONCAT('%',?,'%') order by uid`,
    changeBrigKrug: `UPDATE krug set brig_id=? where krug_id=?`,
    addBrig: `INSERT INTO brig set brigName=?, brigCar=?, brigKey=?, brigPhone=?`,
    getBrig: `SELECT brig_id, brigName, brigCar, brigMembers, brigKey, brigPhone FROM brig WHERE brigName like CONCAT('%',?,'%') or brigCar like CONCAT('%',?,'%') or brigKey like CONCAT('%',?,'%') or brigPhone like CONCAT('%',?,'%') order by brig_id LIMIT ?, ?`,
    getAllBrigs: `SELECT brig_id, brigName, brigCar, brigMembers, brigKey, brigPhone FROM brig order by brig_id`,
    getBrigCount: `SELECT count(*) as queryLength FROM brig WHERE brigName like CONCAT('%',?,'%') or brigCar like CONCAT('%',?,'%') or brigKey like CONCAT('%',?,'%') or brigPhone like CONCAT('%',?,'%')`,
    deleteBrig: `DELETE from brig WHERE brig_id=?`,
    getBrigMembers: `SELECT brigMembers from brig where brig_id=?`,
    updateMembersInBrig: `UPDATE brig SET brigMembers=? where brig_id=?`,
    updateBrig: `UPDATE brig SET brigName=?, brigCar=?, brigKey=?, brigPhone=? where brig_id=?`,
    getInkas,
    getInkas_XML,
    getInkasCount,
    getMain,
    getMain_XML,
    getMainCount,
    getDevices: `SELECT errorDevice, deviceName from device`,
    getErrors: `SELECT errorCode, errorText, isActive from error`,
    getMessages: `SELECT messCode, messText, isActive from message`,
    addDevice: `INSERT INTO device set errorDevice=?, deviceName=?`,
    addError: `INSERT INTO error set errorCode=?, errorText=?`,
    addMessage: `INSERT INTO message set messCode=?, messText=?`,
    deleteDevice: `DELETE FROM device where errorDevice=?`,
    deleteError: `DELETE FROM error where errorCode=?`,
    deleteMessage: `DELETE FROM message where messCode=?`,
    changeDevice: `UPDATE device SET deviceName=? where errorDevice=?`,
    changeError: `UPDATE error SET errorText=? where errorCode=?`,
    changeMessage: `UPDATE message SET messText=? where messCode=?`,
    changeIsActiveError: `UPDATE error SET isActive=? where errorCode=?`,
    changeIsActiveMessage: `UPDATE message SET isActive=? where messCode=?`,
    getApvByEng: `SELECT krug.title as krugName, sn, cmdProfile, address, activeKrug, tgLink, snEQ, cost, phone, version, linkState, oper, apv.lts as lts from apv, krug, brig where apv.activeKrug=krug.krug_id and brig.brig_id=krug.brig_id and JSON_CONTAINS(brig.brigMembers, ?)`,
    setCmdByEng: `UPDATE apv SET cmdProfile=? where sn=?`,
    dropCmdByEng: `UPDATE apv SET cmdProfile='{}' where sn=?`,
    getApvForInkas: `SELECT krug.title as krugName, sn, cmdProfile, address, activeKrug, tgLink, snEQ, cost, phone, version, linkState, oper, apv.lts as lts from apv, krug where apv.activeKrug=krug.krug_id`,
    setCmdInkas: `UPDATE apv SET cmdProfile=? where sn=?`,
    dropCmdInkas: `UPDATE apv SET cmdProfile='{}' where sn=?`,
    getReminder: `SELECT value FROM kvs WHERE link=?`,
    applyReminder: `REPLACE INTO kvs SET link=?, value=?`,
    getAllCurrentApvData: `SELECT kvs.lts, link as sn, value as data, apv.chargeInfo, address, online FROM kvs, apv WHERE apv.sn = kvs.link`,
    getAllAVGDaylySell,
    getCashierInkass,
    getCashierInkassCount,
    getCashierInkassPodItog,
    getTerminalInkassByInkassDate,
    getCashierInkassByInkassDate,
    getCashierInkassByCreationDate,
    getCashierItog: `SELECT sn, cinkass_id, m1, m2, m5, m10, k, lts, dateInkass, summ FROM cashier_inkass WHERE cashierUid=? AND dateCreation BETWEEN ? AND ? ORDER by lts`,
    checkDuplikateInkass: `SELECT sn FROM cashier_inkass WHERE sn=? and dateInkass=? and cinkass_id != ?`,
    addCashierInkass: `INSERT INTO cashier_inkass SET sn=?, duplikateSn=?, dateInkass=?, dateCreation=?, m1=?, m2=?, m5=?, m10=?, k=?, summ=?, comment=?, dontUseSn=?, isDuplikate=?, cashierSign=?, cashierUid=?`,
    delCashierInkass: `DELETE FROM cashier_inkass where cinkass_id=? AND cashierUid=?`,
    updateCashierInkass: `UPDATE cashier_inkass SET sn=?, duplikateSn=?, dateInkass=?, dateCreation=?, m1=?, m2=?, m5=?, m10=?, k=?, summ=?, comment=?, dontUseSn=?, isDuplikate=? WHERE cinkass_id=? AND cashierUid=?`,
    setInkassPrihod: `UPDATE cashier_inkass SET isPrihod=?, datePrihod=DATE(now()) WHERE cinkass_id=?`,
    setInkassMassPrihod,
    getAllCashiers: `SELECT uid, extended, email  FROM ${config.db_prefix}_users WHERE roles like CONCAT('%',?,'%') order by uid`,
    getDevicesNormal: `SELECT errorDevice, deviceName from device where errorDevice!=${config.deviceNormal}`,
    getErrorsNormal: `SELECT errorCode, errorText, isActive from error where errorCode!=${config.errorNormal}`,
    getProblems,
    getAPVAddressAndBrig: `SELECT sn, address, brig.brigName FROM apv LEFT JOIN krug ON activeKrug=krug.krug_id LEFT JOIN brig ON krug.brig_id=brig.brig_id`,
    getFreeWater,
    getWash: `SELECT dateUnique, washObject FROM wash WHERE dateUnique BETWEEN ? AND ?`,
    getWashByDate: `SELECT washObject FROM wash WHERE dateUnique=?`,
    updateWash: `REPLACE INTO wash SET washObject=?, dateUnique=?`,
    getBuhActuals,
    getBuhReport,
    getBuhReportCount,
    getBuhReportUnlim,
    getBuhReportPoditog,
    getDispatcherHistory,
    getDispatcherHistoryCount,
    getDispatcherHistory_XML,
  };
};

let getAllAVGDaylySell = (sortType) => {
  switch (sortType) {
    case 0:
      return `SELECT sn, AVG(daylySellValue) as AVGDaylySell FROM dayly_stats WHERE date BETWEEN DATE_SUB(DATE(now()), INTERVAL 1 MONTH) AND DATE(now()) group by sn order by sn`;
      break;
    case 1:
      return `SELECT sn, AVG(daylySellValue) as AVGDaylySell FROM dayly_stats WHERE date BETWEEN DATE_SUB(DATE(now()), INTERVAL 1 MONTH) AND DATE(now()) group by sn order by AVGDaylySell desc`;
      break;
    case 2:
      return `SELECT sn, AVG(daylySellValue) as AVGDaylySell FROM dayly_stats WHERE date BETWEEN DATE_SUB(DATE(now()), INTERVAL 1 MONTH) AND DATE(now()) group by sn order by AVGDaylySell`;
      break;
    default:
      return `SELECT sn, AVG(daylySellValue) as AVGDaylySell FROM dayly_stats WHERE date BETWEEN DATE_SUB(DATE(now()), INTERVAL 1 MONTH) AND DATE(now()) group by sn order by sn`;
      break;
  }
};

let getDispatcherHistory_XML = (apvs) => {
  return `SELECT lts, sn, w, v1, v2, v3, v4, chargeObject, dv1, dv2, dv3, dv4, dv5, errorDevice, errorCode FROM main_disp WHERE ${sqlFromArray(
    "sn",
    apvs
  )} and date(lts) BETWEEN ? AND ? ORDER BY lts DESC`;
};

let getDispatcherHistory = (apvs) => {
  return `SELECT lts, sn, w, v1, v2, v3, v4, chargeObject, dv1, dv2, dv3, dv4, dv5, errorDevice, errorCode FROM main_disp WHERE ${sqlFromArray(
    "sn",
    apvs
  )} and date(lts) BETWEEN ? AND ? ORDER BY lts DESC LIMIT ?, ?`;
};

let getDispatcherHistoryCount = (apvs) => {
  return `SELECT count(*) as queryLength FROM main_disp where ${sqlFromArray(
    "sn",
    apvs
  )} and date(lts) BETWEEN ? AND ?`;
};

let getBuhReportPoditog = (apvs) => {
  return `SELECT  sum(eq) as eq, sum(nal) as nal, sum(tSOLD) as tSOLD, sum(w) as w FROM delta WHERE ${sqlFromArray(
    "sn",
    apvs
  )} and date BETWEEN ? AND ?`;
};

let getBuhReport = (apvs, sortType) => {
  let __order = "delta.sn";

  if (sortType == 1) {
    __order = "w DESC";
  } else if (sortType == 2) {
    __order = "w";
  }

  return `SELECT delta.sn as sn, sum(eq) as eq, sum(nal) as nal, sum(tSOLD) as tSOLD, sum(w) as w, address FROM delta LEFT JOIN apv ON apv.sn = delta.sn WHERE ${sqlFromArray(
    "delta.sn",
    apvs
  )} and date BETWEEN ? AND ? 
  GROUP BY delta.sn 
  ORDER BY date DESC, ${__order}
  LIMIT ?, ?`;
};

let getBuhReportCount = (apvs) => {
  return `SELECT count(DISTINCT sn) as queryLength FROM delta WHERE ${sqlFromArray(
    "sn",
    apvs
  )} and date BETWEEN ? AND ?`;
};

let getBuhReportUnlim = (apvs, sortType) => {
  let __order = "delta.sn";

  if (sortType == 1) {
    __order = "w DESC";
  } else if (sortType == 2) {
    __order = "w";
  }

  return `SELECT delta.sn as sn, sum(eq) as eq, sum(nal) as nal, sum(tSOLD) as tSOLD, sum(w) as w, address FROM delta LEFT JOIN apv ON apv.sn = delta.sn WHERE ${sqlFromArray(
    "delta.sn",
    apvs
  )} and date BETWEEN ? AND ? 
  GROUP BY delta.sn 
  ORDER BY date DESC, ${__order}`;
};

let getBuhActuals = (apvs) => {
  return `SELECT sn, inkassLts, address, kvs.lts as lts, kvs.value as value FROM apv LEFT JOIN kvs ON apv.sn = kvs.link WHERE ${sqlFromArray(
    "sn",
    apvs
  )} ORDER by sn`;
};

let setInkassMassPrihod = (cinkass_ids) => {
  return `UPDATE cashier_inkass SET isPrihod=?, datePrihod=DATE(now()) WHERE ${sqlFromArray(
    "cinkass_id",
    cinkass_ids
  )} `;
};

let getProblems = (apvs, errors, devices) => {
  return `SELECT lts, sn, errorCode, errorDevice, enabled
  FROM error_stat
  WHERE ${sqlFromArray("sn", apvs)} AND (DATE(lts) BETWEEN ? AND ?) 
  AND ${sqlFromArray("errorCode", errors)} 
  AND ${sqlFromArray("errorDevice", devices)}
  ORDER BY lts`;
};

let getFreeWater = (apvs) => {
  return `SELECT lts, sn, FLAG_f_off, f
  FROM free_stat
  WHERE ${sqlFromArray("sn", apvs)} AND (DATE(lts) BETWEEN ? AND ?) 
  ORDER BY lts`;
};

let getInkas = (apvs) => {
  return `SELECT brig.brigName, dateUnique, inkas_id, inkas.sn as sn, inkas_number, 
  inkas.lts as lts, date, inkas.version as version, inkas, kup, box, op, op_extended, op_state, 
  rd, inkas.address, inkas.krug_name 
  from inkas 
  LEFT JOIN apv ON apv.sn = inkas.sn 
  LEFT JOIN krug ON apv.activeKrug=krug.krug_id 
  LEFT JOIN brig ON krug.brig_id=brig.brig_id
  WHERE ${sqlFromArray("inkas.sn", apvs)} AND DATE(inkas.lts) BETWEEN ? AND ? 
  ORDER BY inkas.lts DESC LIMIT ?, ?`;
};

let getInkas_XML = (apvs) => {
  return `SELECT brig.brigName, dateUnique, inkas_id, inkas.sn as sn, inkas_number, 
  inkas.lts as lts, date, inkas.version as version, inkas, kup, box, op, op_extended, op_state, 
  rd, inkas.address, inkas.krug_name 
  from inkas 
  LEFT JOIN apv ON apv.sn = inkas.sn 
  LEFT JOIN krug ON apv.activeKrug=krug.krug_id 
  LEFT JOIN brig ON krug.brig_id=brig.brig_id
  WHERE ${sqlFromArray("inkas.sn", apvs)} AND DATE(inkas.lts) BETWEEN ? AND ? 
  ORDER BY inkas.lts DESC`;
};

let getInkasCount = (apvs) => {
  return `SELECT count(*) as queryLength from inkas WHERE ${sqlFromArray(
    "sn",
    apvs
  )} AND DATE(lts) BETWEEN ? AND ?`;
};

let getCashierInkassByInkassDate = (apvs) => {
  return `SELECT cashierUid, cashierSign, comment, dontUseSn, isDuplikate, duplikateSn, 
  dateCreation, cinkass_id, isPrihod, datePrihod, 
  sn, m1, m2, m5, m10, k, dateInkass, summ as cashierSumm 
  FROM cashier_inkass WHERE ${sqlFromArray("sn", apvs)} AND
  dateInkass BETWEEN ? AND ?`;
};

let getCashierInkassByCreationDate = (apvs, cashierUid) => {
  let __cashierUid = cashierUid == -1 ? 1 : `cashierUid = ${cashierUid}`;
  return `SELECT apv.address as address, cashierUid, cashierSign, comment, dontUseSn, isDuplikate, duplikateSn, 
  dateCreation, cinkass_id, isPrihod, datePrihod, 
  cashier_inkass.sn, m1, m2, m5, m10, k, dateInkass, summ as cashierSumm 
  FROM cashier_inkass LEFT JOIN apv ON apv.sn=cashier_inkass.sn WHERE ${sqlFromArray(
    "cashier_inkass.sn",
    apvs
  )} AND
  dateCreation BETWEEN ? AND ? AND ${__cashierUid}`;
};

let getTerminalInkassByInkassDate = (apvs) => {
  return `SELECT sn, DATE(lts) as dateInkass, address, 
  sum(kup+box) as terminalSumm, 
  sum(kup) as kup, 
  sum(rd) as rd, 
  sum(box) as box, 
  count(*) as terminalInkassCount 
  FROM inkas WHERE ${sqlFromArray("sn", apvs)}
  AND DATE(lts) between ? and ? GROUP BY sn, dateInkass`;
};

let getCashierInkass = (requestData) => {
  let __order = "";

  if (requestData.sortType == 0) {
    __order = "order by lts desc";
  } else if (requestData.sortType == 1) {
    __order = "order by dateInkass desc";
  } else if (requestData.sortType == 2) {
    __order = "order by cashier_inkass.sn, dateInkass";
  } else if (requestData.sortType == 3) {
    __order = "order by summ";
  } else if (requestData.sortType == 4) {
    __order = "order by summ desc";
  }

  return `SELECT duplikateSn, isDuplikate, dontUseSn, cinkass_id, cashier_inkass.lts, datePrihod, dateInkass, dateCreation, cashier_inkass.sn, m1, m2, m5, m10, k, summ, comment, isPrihod, apv.address as address 
  from cashier_inkass LEFT JOIN apv ON cashier_inkass.sn=apv.sn 
  WHERE cashierUid=? AND ((dateCreation BETWEEN ? AND ?) OR ${
    requestData?.useCreationDate ? 0 : 1
  }) and ((dateInkass BETWEEN ? AND ?) OR ${
    requestData?.useInkassDate ? 0 : 1
  }) AND ${sqlFromArray(
    "cashier_inkass.sn",
    requestData.apvs
  )} ${__order} LIMIT ?, ?`;
};

let getCashierInkassPodItog = (requestData) => {
  return `SELECT count(*) as count, sum(m1) as m1, sum(m2) as m2, sum(m5) as m5, sum(m10) as m10, sum(k) as k FROM cashier_inkass WHERE 
  cashierUid=? and
  ((dateCreation BETWEEN ? AND ?) OR ${
    requestData?.useCreationDate ? 0 : 1
  }) and ((dateInkass BETWEEN ? AND ?) OR ${
    requestData?.useInkassDate ? 0 : 1
  }) AND ${sqlFromArray("sn", requestData.apvs)}`;
};

let getCashierInkassCount = (requestData) => {
  return `SELECT count(*) as queryLength FROM cashier_inkass WHERE cashierUid=? AND ((dateCreation BETWEEN ? AND ?) OR ${
    requestData?.useCreationDate ? 0 : 1
  }) and ((dateInkass BETWEEN ? AND ?) OR ${
    requestData?.useInkassDate ? 0 : 1
  }) AND ${sqlFromArray("sn", requestData.apvs)}`;
};

let getMain = (requestData) => {
  return `SELECT sn, version, lts, FLAG_start, w, k, r, m, m1, m2, m5, m10, c, f, errorDevice, errorCode, messCode, FLAG_k_off, FLAG_m_off, FLAG_c_off, FLAG_r_off, FLAG_error_m1, FLAG_error_m2, FLAG_error_m5, FLAG_error_m10, v1, v2, v3, v4, FLAG_t_off, dv1, dv2, dv3, dv4, dv5, tSOLD, tREMAIN, FLAG_f_off from main where (lts between ? and ?) and ${calcSqlWhereForMain(
    requestData
  )} order by lts desc LIMIT ?, ?`;
};

let getMain_XML = (requestData) => {
  return `SELECT sn, version, lts, FLAG_start, w, k, r, m, m1, m2, m5, m10, c, f, errorDevice, errorCode, messCode, FLAG_k_off, FLAG_m_off, FLAG_c_off, FLAG_r_off, FLAG_error_m1, FLAG_error_m2, FLAG_error_m5, FLAG_error_m10, v1, v2, v3, v4, FLAG_t_off, dv1, dv2, dv3, dv4, dv5, tSOLD, tREMAIN, FLAG_f_off from main where (lts between ? and ?) and ${calcSqlWhereForMain(
    requestData
  )} order by lts desc`;
};

let getMainCount = (requestData) => {
  return `SELECT count(*) as queryLength from main where (lts between ? and ?) and ${calcSqlWhereForMain(
    requestData
  )}`;
};

let calcSqlWhereForMain = (requestData) => {
  return `${sqlFromArray("sn", requestData.apvs)} and ${sqlFromArray(
    "errorCode",
    requestData.errors
  )} and ${sqlFromArray(
    "errorDevice",
    requestData.devices
  )} and ${sqlJSONFromArray("messCode", requestData.messages)}`;
};

let sqlFromArray = (column, array, defaultV) => {
  let __processingArray = [];
  if (array?.length > 0) {
    array.forEach((value) => {
      __processingArray.push(` ${column}="${value}" `);
    });

    return "(" + __processingArray.join("or") + ")";
  } else {
    return defaultV || "1";
  }
};

let sqlJSONFromArray = (column, array, defaultV) => {
  let __processingArray = [];
  if (array?.length > 0) {
    array.forEach((value) => {
      __processingArray.push(` (${column} like \'%\"${value}\"%\') `);
    });

    return "(" + __processingArray.join("or") + ")";
  } else {
    return defaultV || "1";
  }
};
