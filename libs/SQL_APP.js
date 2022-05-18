module.exports = (config) => {
  return {
    Test: `SELECT test from test`,
    getAPV: `SELECT sn, address, ts from apv WHERE sn like CONCAT('%',?,'%') or address like CONCAT('%',?,'%') order by sn LIMIT ?, ?`,
    getAPVCount: `SELECT count(*) as queryLength from apv WHERE sn like CONCAT('%',?,'%') or address like CONCAT('%',?,'%')`,
    addAPV: `INSERT into apv set sn=?, address=?`,
    deleteAPV: `DELETE from apv where sn=?`,
    changeAddress: `UPDATE apv set address=? where sn=?`,
  };
};
