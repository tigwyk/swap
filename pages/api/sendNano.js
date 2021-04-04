const nanopay = require('nanopay');
const axios = require('axios');
const nanocurrency = require('nanocurrency');
const BigNumber = require('bignumber.js');
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

export async function sendNanoPayment(amount, address) {
    try {    
        nanopay.init('https://proxy.powernode.cc/proxy', '');
        //nanopay.init(process.env.NANO_WALLET_URL,"54.221.77.87:7000");
        const nanoseed = getNanoSeed();
        const secretKey = await nanopay.gensecretKey(nanoseed, 0);
        //const from_address = await nanopay.secretKeytoaddr(secretKey);
        //console.log("Sending NANO address: ",from_address);
        const fetch_pending_result = await nanopay.fetchPending(secretKey);
        console.log("Fetched Pending? ",fetch_pending_result);
        const send_block_result = await nanopay.send(secretKey,address, amount);
        console.log("Nanopay params: ",secretKey,address, amount);
        //console.log("Send block hash: ",send_block_result.hash);
        if(send_block_result.hash) {
          console.log(send_block_result.hash);
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

/*
async function send(secretKey, sendto, amount) {
  console.log("send function: ",secretKey, sendto, amount);
	var address = await nanopay.secretKeytoaddr(secretKey);
	var sddsf_address = await accountdig(address);
	var cbal = sddsf_address.balance;
  console.log("Sending account balance: ",cbal);
	var previous = sddsf_address.frontier;
  console.log("Sending account frontier block: ",previous);
	var pow = await nanopay.hybirdWork(previous);
  console.log("PoW: ",pow);

	var x = new BigNumber('1000000000000000000000000000000');
	var xx = x.multipliedBy(amount).toFixed();
	var puki = new BigNumber(cbal);
	var balance = puki.minus(xx);

	var balancex = balance.toFixed(0);
  console.log("Adjusted balance: ",balancex);

	if (balancex >= 0) {
		dd = {
			balance: balancex,
			link: sendto,
			previous: previous,
			representative: address,
			work: pow,
		};
		var xxx = await nanocurrency.createBlock(secretKey, dd);
    console.log(xxx);
		var retr = await nanopay.publish(xxx.block);
	} else {
		var retr = { error: 'no_balance' };
	}

	return retr;
}

async function accountdig(account) {
	return axios
		.post('https://proxy.powernode.cc/proxy', {
			account: account,
			action: 'account_info',
		})
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			console.log(error);
		});
}
*/