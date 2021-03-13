const db = require('../../libs/db')

module.exports = async (req, res) => {
  const users = await db.query(`
    SELECT COUNT(*)
    FROM address_pairs;
  `)
  res.end(JSON.stringify({ users }))
}