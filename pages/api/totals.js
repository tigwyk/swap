const db = require('../../libs/db');

module.exports = async (req, res) => {
  const total = await db.query(`
    SELECT COUNT(*) AS TOTAL
    FROM address_pairs
  `);
  
  res.end(JSON.stringify(total));
}