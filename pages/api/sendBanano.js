const nanopay = require('nanopay');
import { banToRaw } from 'banano-unit-converter';
const bananojs = require('@bananocoin/bananojs');
bananojs.setBananodeApiUrl(process.env.BANANO_WALLET_URL);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Process a POST request
        const payment_response = await sendBananoPayment(req.body.amount, req.body.destination, req.body.state);
        res.status(200).json(payment_response);
      } else {
    res.status(200).json({status: 'awesome'});
    }
}

function getBananoSeed() {
    return process.env.BANANO_HOTWALLET_SEED;
}

export async function sendBananoPayment(amount, address, state) {
    try {    
        console.log(state);
        const bananoseed = getBananoSeed();
        //const secretKey = await nanopay.gensecretKey(bananoseed, 0);
        //const secretKey = bananoseed;
        //console.log("Seed (Please don't read this): ",bananoseed);
        //console.log("Secret key(please don't read this):",secretKey);
        const send_block_result = bananojs.sendAmountToBananoAccount(bananoseed,0,address,banToRaw(amount),(hash) => {
            console.log(hash);
            return hash;
        },(error) => {
            console.log(error);
            return error;
        });
        return send_block_result;
    } catch (error) {
      //console.error(error);
      return { error }
    }
  }
  