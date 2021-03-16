// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let price_list = require( '../../libs/dummy.json');
function handler (req, res) {
  res.status(200).json(price_list)
}

export default handler;