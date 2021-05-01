// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let price_list = require( '../../libs/dummy.json');
export default async function handler (req, res) {
  updated_pricelist = await updatePriceList();
  res.status(200).json(updated_pricelist)
}

export async function updatePriceList () {
  console.log(JSON.stringify(price_list));
  console.log("Seconds since updated: ",Date.now - price_list.updated);
  console.log("Updating price list...");
  let btc_price_lookup = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=nano,banano&vs_currencies=btc");
  let btc_price_data = await btc_price_lookup.json();
  //console.log(usd_price_data);
  console.log("NANO: ",btc_price_data.nano.btc);
  console.log("BANANO: ",btc_price_data.banano.btc);
  price_list.btc.nano = btc_price_data.nano.btc;
  price_list.btc.banano = btc_price_data.banano.btc;
  let how_many_nano_per_banano = btc_price_data.banano.btc / btc_price_data.nano.btc;
  let how_many_banano_per_nano = btc_price_data.nano.btc / btc_price_data.banano.btc;
  console.log("How many NANO for each BANANO? ",how_many_nano_per_banano.toFixed(6));
  console.log("How many BANANO for each NANO? ",how_many_banano_per_nano.toFixed(6));
  let sell_rate = ((how_many_nano_per_banano)*.97).toFixed(6);
  let buy_rate = ((how_many_banano_per_nano)*.90).toFixed(6);
  console.log("Sell rate: ",1/sell_rate);
  console.log("Buy rate: ", buy_rate);
  price_list.sell.banano.nano = sell_rate;
  price_list.buy.banano.nano = (1/buy_rate).toFixed(6);
  console.log("Edited price list in memory");
  console.log(JSON.stringify(price_list));
  price_list.updated = Date.now();
  return price_list;
}