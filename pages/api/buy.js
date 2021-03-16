const db = require('../../libs/db');

async function handler(req, res) {
  if(req.method === 'POST') {
    console.log(req.body);
    
    let buy_order_result = await createBuyOrder(req.body.base_address,req.body.quote_address,req.body.base_currency,req.body.quote_currency,req.body.exchange_rate);
    try {
      res.end(JSON.stringify(buy_order_result));
    } catch (error) {
      console.error(error);
    }
  } else {
    res.end(JSON.stringify({"method":req.method}));
  }
}

export async function createSellOrder(baseAddress, quoteAddress, baseCurrency, quoteCurrency, exchangeRate) {
  const submitSellOrder = await db.query(`
  INSERT INTO address_pairs (base_address, quote_address, exchange_rate, base_currency, quote_currency)
  VALUES ('${baseAddress}','${quoteAddress}','${exchangeRate}','${baseCurrency}','${quoteCurrency}')
  `);
  /*
  const base_address = await db.query(`
  SELECT base_address
  FROM address_pairs
  WHERE quote_address = "${address_to_lookup}"
  LIMIT 1
`);
 return await base_address;
 */
  return await submitSellOrder;
}

export default handler;