const nanopay = require('nanopay');
import { banToRaw } from 'banano-unit-converter';
const bananojs = require('@bananocoin/bananojs');
bananojs.setBananodeApiUrl('https://kaliumapi.appditto.com/api');

const banano_seed = process.env.BANANO_HOTWALLET_SEED;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Process a POST request
        const payment_response = await sendBananoPayment(req.body.amount, req.body.destination);
        res.status(200).json(payment_response);
      } else {
    res.status(200).json({status: 'awesome'});
    }
}

function getBananoSeed() {
    return banano_seed;
}

export async function sendBananoPayment(amount, address) {
    try {    
        const bananoseed = getBananoSeed();
        //const secretKey = await nanopay.gensecretKey(bananoseed, 0);
        //const secretKey = bananoseed;
        //console.log("Seed (Please don't read this): ",bananoseed);
        //console.log("Secret key(please don't read this):",secretKey);
        const send_block_result = bananojs.sendAmountToBananoAccount(bananoseed,0,address,banToRaw(amount),(hash) => {
            return console.log(hash);
        },(error) => {
            return console.log(error);
        });
    } catch (error) {
      //console.error(error);
      return { error }
    }
  }