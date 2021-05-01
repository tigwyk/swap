const nanopay = require('nanopay');
const nanocurrency = require('nanocurrency');
const BigNumber = require('bignumber.js');
const axios = require('axios');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Process a POST request
        const payment_response = await sendNanoPayment(req.body.amount, req.body.destination, req.body.state, req.body.work);
        res.status(200).json(payment_response);
      } else {
    res.status(200).json({status: 'awesome'});
    }
}

export async function sendNanoPayment(amount, address, state, work) {
    try {
        console.log("Cached work: ",work);
        console.log("Using work server: ",process.env.NANO_WORK_SERVER);
        //console.log("NOWNodes API Key: ",process.env.NOWNODES_API_KEY);
        nanopay.init(process.env.NANO_WALLET_URL, process.env.NANO_WORK_SERVER);
        //nanopay.init(process.env.NANO_WALLET_URL);
        const nanoseed = getNanoSeed();
        const secretKey = await nanopay.gensecretKey(nanoseed, 0);
        const from_address = await nanopay.secretKeytoaddr(secretKey);
        console.log("Sending NANO address: ",from_address);
        const fetch_pending_result = await fetchPending(secretKey);
        console.log("Fetched Pending? ",fetch_pending_result);
        const send_block_result = await send(secretKey,address, amount, work);
        console.log("Nanopay params: ",secretKey,address, amount, work);
        //console.log("Send block hash: ",send_block_result.hash);
        if(send_block_result.hash) {
          console.log("Send block hash: ",send_block_result.hash);
          return send_block_result.hash;
        } else {
          console.log(send_block_result);
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

//Taken directly from nanopay since I have to hack in the API Key support
async function send(secretKey, sendto, amount, cached_work) {
  var dd;
	var address = await nanopay.secretKeytoaddr(secretKey);
	var sddsf_address = await accountdig(address);
	var cbal = sddsf_address.balance;
	var previous = sddsf_address.frontier;
  var pow = null;
  console.log("Send function cached work: ",cached_work);
  if(typeof cached_work !== undefined && cached_work !== "") {
    pow = cached_work;
  }else {
	  pow = await hybridWork(previous);
  }
  console.log("POW: ",pow);

	var x = new BigNumber('1000000000000000000000000000000');
	var xx = x.multipliedBy(amount).toFixed();
	var puki = new BigNumber(cbal);
	var balance = puki.minus(xx);

	var balancex = balance.toFixed(0);

	if (balancex >= 0) {
		dd = {
			balance: balancex,
			link: sendto,
			previous: previous,
			representative: address,
			work: pow,
		};
    console.log(dd);
		var xxx = await nanocurrency.createBlock(secretKey, dd);
		var retr = await publish(xxx.block);
	} else {
		var retr = { error: 'no_balance' };
	}

	return retr;
}

async function fetchPending(secretKey) {
  var dd;
  console.log("fetchPending");
	var address = await nanopay.secretKeytoaddr(secretKey);

	if ((await pendingblockcount(address)) > 0) {
		var pending = await pendingblock(address);
		var pendingbal = await block_info(pending);
		var sddsf_address = await accountdig(address);

		if (sddsf_address.error) {
			var cbal = '0';
			var previous = null;
			var pow = await hybridWork(publicKey);
		} else {
			var cbal = sddsf_address.balance;
			var previous = sddsf_address.frontier;
			var pow = await hybridWork(previous);
		}

		var puki = new BigNumber(cbal);
		var balance = puki.plus(pendingbal);
		var balancex = balance.toFixed();

		dd = {
			balance: balancex,
			link: pending,
			previous: previous,
			representative: address,
			work: pow,
		};

		var xxx = await nanocurrency.createBlock(secretKey, dd);
		var retr = await publish(xxx.block);

		return retr;
	} else {
		return '{ "hash" : 0 }';
	}
}

async function hybridWork(blockblock) {
  var pow;
  console.log("hybridWork");
	return axios
		.post(process.env.NANO_WORK_SERVER, { action: 'work_generate', difficulty: 'fffffff800000000', hash: blockblock }, { authorization: process.env.WORK_SERVER_API_KEY})
		.then(async function (response) {
			console.log('Getting Work From Remote.............');
			console.log(response.data);

			if (response.data.work) {
				return response.data.work;
			} else {
				pow = await nanocurrency.computeWork(blockblock, (nanocurrency.ComputeWorkParams = { workThreshold: 'fffffff800000000' }));
				return pow;
			}
		})
		.catch(async function (error) {
			pow = await nanocurrency.computeWork(blockblock, (nanocurrency.ComputeWorkParams = { workThreshold: 'fffffff800000000' }));
			return pow;
		});
}

async function pendingblockcount(account) {
  console.log("pendingblockcount");
	return axios
		.post(process.env.NANO_WALLET_URL, {
      API_key: process.env.NOWNODES_API_KEY,
			account: account,
			action: 'pending',
		})
		.then(function (response) {
			const x = response.data.blocks;

			return x.length;
		})
		.catch(function (error) {
			console.log(error);
		});
}

async function pendingblock(account) {
  console.log("pendingblock");
	return axios
		.post(process.env.NANO_WALLET_URL, {
      API_key: process.env.NOWNODES_API_KEY,
			account: account,
			action: 'pending',
		})
		.then(function (response) {
			return response.data.blocks[0];
		})
		.catch(function (error) {
			console.log(error);
		});
}

async function accountdig(account) {
  console.log("accountdig");
	return axios
		.post(process.env.NANO_WALLET_URL, {
      API_key:process.env.NOWNODES_API_KEY,
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

async function block_info(blockid) {
  console.log("block_info");
	return axios
		.post(process.env.NANO_WALLET_URL, {
      API_key: process.env.NOWNODES_API_KEY,
			hashes: [blockid],
			json_block: 'true',
			action: 'blocks_info',
			pending: 'true',
		})
		.then(function (response) {
			return response.data.blocks[blockid].amount;
		})
		.catch(function (error) {
			console.log(error);
		});
}

async function publish(blockjson) {
  console.log("publish");
	return axios
		.post(process.env.NANO_WALLET_URL, {
      API_key: process.env.NOWNODES_API_KEY,
			action: 'process',
			json_block: 'true',
			block: blockjson,
		})
		.then(function (response) {
      console.log(response.data);
			return response.data;
		})
		.catch(function (error) {
			console.log(error);
		});
}