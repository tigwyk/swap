const db = require('../../libs/db');

module.exports = async (req, res) => {
  const address_pairs = await db.query(`
    SELECT *
    FROM address_pairs;
  `);
  res.end(JSON.stringify({ address_pairs }));
}