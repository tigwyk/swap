const nanopay = require('nanopay');
import { banToRaw } from 'banano-unit-converter';

export async function sendNanoPayment(amount, address) {
    try {    
        nanopay.init(process.env.NANO_WALLET_URL,"54.221.77.87:7000");
        const nanoseed = getNanoSeed();
        const secretKey = await nanopay.gensecretKey(nanoseed, 0);
        const send_block_result = await nanopay.send(secretKey,address, amount)
        return send_block_result;
    } catch (error) {
        console.error(error);
      return { error }
    }
  }

function getNanoSeed() {
    return process.env.NANO_HOTWALLET_SEED;
}

function getBananoSeed() {
    return process.env.BANANO_HOTWALLET_SEED;
}

export async function sendBananoPayment(amount, address) {
    try {    
        nanopay.init(process.env.BANANO_WALLET_URL,"54.221.77.87:7000");
        const bananoseed = getBananoSeed();
        //const secretKey = await nanopay.gensecretKey(bananoseed, 0);
        const secretKey = bananoseed;
        console.log("Secret key(please don't read this):",secretKey);
        const send_block_result = await nanopay.send(secretKey,address, banToRaw(amount))
        return send_block_result;
    } catch (error) {
        console.error(error);
      return { error }
    }
  }