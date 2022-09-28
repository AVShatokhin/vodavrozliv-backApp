module.exports = (config) => {
  return {
    Test: `SELECT test from test`,
    getAPV: `SELECT sn, a, address, activeKrug, tgLink, snEQ, cost, phone, version, linkState, oper, lts from apv WHERE sn like CONCAT('%',?,'%') or address like CONCAT('%',?,'%') or oper like CONCAT('%',?,'%') or phone like CONCAT('%',?,'%') or snEQ like CONCAT('%',?,'%') order by sn LIMIT ?, ?`,
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
    changeBrigKrug: `UPDATE krug set brig_id=? where krug_id=?`,
    addBrig: `INSERT INTO brig set brigName=?, brigCar=?, brigKey=?, brigPhone=?`,
    getBrig: `SELECT brig_id, brigName, brigCar, brigMembers, brigKey, brigPhone FROM brig WHERE brigName like CONCAT('%',?,'%') or brigCar like CONCAT('%',?,'%') or brigKey like CONCAT('%',?,'%') or brigPhone like CONCAT('%',?,'%') order by brig_id LIMIT ?, ?`,
    getAllBrigs: `SELECT brig_id, brigName, brigCar, brigMembers, brigKey, brigPhone FROM brig order by brig_id`,
    getBrigCount: `SELECT count(*) as queryLength FROM brig WHERE brigName like CONCAT('%',?,'%') or brigCar like CONCAT('%',?,'%') or brigKey like CONCAT('%',?,'%') or brigPhone like CONCAT('%',?,'%')`,
    deleteBrig: `DELETE from brig WHERE brig_id=?`,
    getBrigMembers: `SELECT brigMembers from brig where brig_id=?`,
    updateMembersInBrig: `UPDATE brig SET brigMembers=? where brig_id=?`,
    updateBrig: `UPDATE brig SET brigName=?, brigCar=?, brigKey=?, brigPhone=? where brig_id=?`,
    getInkas: `SELECT dateUnique, inkas_id, sn, inkas_number, lts, date, version, inkas, kup, box, op, op_extended, op_state, rd, address, krug_name from inkas order by lts desc LIMIT ?, ?`,
    getInkasCount: `SELECT count(*) as queryLength from inkas`,
    getMain,
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
    getAllAVGDaylySell: `SELECT sn, AVG(daylySellValue) as AVGDaylySell FROM dayly_stats WHERE date BETWEEN DATE_SUB(DATE(now()), INTERVAL 1 MONTH) AND DATE(now()) group by sn`,
  };
};

let getMain = (requestData) => {
  return `SELECT sn, version, lts, FLAG_start, w, k, r, m, m1, m2, m5, m10, c, errorDevice, errorCode, messCode, FLAG_k_off, FLAG_m_off, FLAG_c_off, FLAG_r_off, FLAG_error_m1, FLAG_error_m2, FLAG_error_m5, FLAG_error_m10, v1, v2, v3, v4, FLAG_t_off, dv1, dv2, dv3, dv4, dv5, tSOLD, tREMAIN from main where (lts between ? and ?) and ${calcSqlWhereForMain(
    requestData
  )} order by lts desc LIMIT ?, ?`;
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
  )} and ${sqlFromArray("errorDevice", requestData.devices)} and ${sqlFromArray(
    "messCode",
    requestData.messages
  )}`;
};

let sqlFromArray = (column, array) => {
  let __processingArray = [];
  if (array?.length > 0) {
    array.forEach((value) => {
      __processingArray.push(` ${column}="${value}" `);
    });

    return "(" + __processingArray.join("or") + ")";
  } else {
    return "1";
  }
};
