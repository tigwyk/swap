const db = require('../../../../libs/db');

module.exports = async (req, res) => {
  console.log(req.query.address);
  let base_address_result = await lookup_base_address(req.body);
  try {
    res.end(JSON.stringify(base_address_result));
  } catch (error) {
    console.error(error);
  }
  
}

async function lookup_base_address(address_to_lookup) {
  const base_address = await db.query(`
  SELECT *
  FROM address_pairs
  WHERE base_address = ${address_to_lookup}
`);

}