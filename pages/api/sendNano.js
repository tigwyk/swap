const nanopay = require('nanopay');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Process a POST request
        const payment_response = await sendNanoPayment(req.body.amount, req.body.destination);
        res.status(200).json(payment_response);
      } else {
    res.status(200).json({status: 'awesome'});
    }
}

export async function sendNanoPayment(amount, address) {
    try {    
        nanopay.init('https://proxy.powernode.cc/proxy', '');
        const nanoseed = getNanoSeed();
        const secretKey = await nanopay.gensecretKey(nanoseed, 0);
        //const from_address = await nanopay.secretKeytoaddr(secretKey);
        //console.log("Sending NANO address: ",from_address);
        const fetch_pending_result = await nanopay.fetchPending(secretKey);
        //console.log("Fetched Pending? ",fetch_pending_result);
        const send_block_result = await nanopay.send(secretKey,address, amount);
        //console.log("Nanopay params: ",secretKey,address, amount);
        //console.log("Send block hash: ",send_block_result.hash);
        if(send_block_result.hash) {
          //console.log(send_block_result.hash);
          return send_block_result.hash;
        } else {
          return console.log("error, no block hash returned");
        }
    } catch (error) {
        console.error(error);
      return { error }
    }
  }

function getNanoSeed() {
    return process.env.NANO_HOTWALLET_SEED;
}