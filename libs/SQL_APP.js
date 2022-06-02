module.exports = (config) => {
  return {
    Test: `SELECT test from test`,
    getAPV: `SELECT sn, address, activeKrug from apv WHERE sn like CONCAT('%',?,'%') or address like CONCAT('%',?,'%') order by sn LIMIT ?, ?`,
    getAPVCount: `SELECT count(*) as queryLength from apv WHERE sn like CONCAT('%',?,'%') or address like CONCAT('%',?,'%')`,
    addAPV: `INSERT into apv set sn=?, address=?`,
    deleteAPV: `DELETE from apv where sn=?`,
    changeAddress: `UPDATE apv set address=? where sn=?`,
    changeApvKrug: `UPDATE apv set activeKrug=? where sn=?`,
    addKrug: `INSERT into krug set title=?`,
    getKrug: `SELECT krug_id, title, eng_uid FROM krug WHERE title like CONCAT('%',?,'%') LIMIT ?, ?`,
    getAllKrugs: `SELECT krug_id, title, eng_uid FROM krug`,
    getKrugCount: `SELECT count(*) as queryLength from krug WHERE title like CONCAT('%',?,'%')`,
    deleteKrug: `DELETE from krug WHERE krug_id=?`,
    changeKrugTitle: `UPDATE krug SET title=? where krug_id=?`,
    getEng: `SELECT uid, extended, email  FROM ${config.db_prefix}_users WHERE roles like CONCAT('%',?,'%') and (extended like CONCAT('%',?,'%') or email like CONCAT('%',?,'%')) order by uid LIMIT ?, ?`,
    getEngCount: `SELECT count(*) as queryLength FROM ${config.db_prefix}_users WHERE roles like CONCAT('%',?,'%') and (extended like CONCAT('%',?,'%') or email like CONCAT('%',?,'%'))`,
    changeEngKrug: `UPDATE krug set eng_uid=? where krug_id=?`,
  };
};
