const nanopay = require('nanopay');
import { megaToRaw, rawToMega } from 'nano-unit-converter';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Process a POST request
        const payment_response = await sendNanoPayment(req.body.amount, req.body.destination);
        res.status(200).json(payment_response);
      } else {
    res.status(200).json({status: 'awesome'});
    }
}

export default async function sendNanoPayment(amount, address) {
    try {    
        nanopay.init(process.env.NANO_WALLET_URL,"54.221.77.87:7000");
        const nanoseed = getNanoSeed();
        const secretKey = await nanopay.gensecretKey(nanoseed, 0);
        const send_block_result = await nanopay.send(secretKey,address, megaToRaw(amount))
        return send_block_result;
    } catch (error) {
        console.error(error);
      return { error }
    }
  }

function getNanoSeed() {
    return process.env.NANO_HOTWALLET_SEED;
}
