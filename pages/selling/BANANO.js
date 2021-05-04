import { useEffect, useState } from 'react';
import styles from '../../styles/Selling.module.css';
import * as nanocurrency from 'nanocurrency';
import Router from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { megaToRaw, rawToMega } from 'nano-unit-converter';
import {updatePriceList} from '../api/prices'

const acceptBanano = require('@accept-banano/client');

async function paymentSucceeded({amount, state, data}) {
  const beforeTimestamp = Date.now();
  var ComputeWorkParams;
  const exchangeAmount = data.send_amount;
  console.log("NANO to receive: ",exchangeAmount);
  console.log("Current difficulty: ",data.difficulty);
  //console.log("Before time: ",beforeTimestamp);
  //const cached_work = await nanocurrency.computeWork(data.frontier, ComputeWorkParams = { workThreshold: data.difficulty });
  
  const cached_work = "";
  const afterTimestamp = Date.now();
  //console.log("After time: ",afterTimestamp);
  const timeSpentComputing = (afterTimestamp - beforeTimestamp)/1000;
  //console.log("Compute time: ",timeSpentComputing,"s");
  //console.log("Computed work: ",cached_work);
  //console.log("Sending payment call to API:",exchangeAmount,data.destination_address,JSON.stringify(state),cached_work);
  Router.push('/success');
  const payment = await axios.post('/api/sendNano', {
    amount: exchangeAmount,
    destination: data.destination_address,
    state: JSON.stringify(state),
    work: cached_work
  });
  //console.log(payment);
  
}

export default function SellingBanano({initialData}) {
  const [data, setData] = useState(initialData);
  const [session, setSession] = useState(null);
  const [paymentState, setPaymentState] = useState(null);

  function acceptBananoPreload(){
    //console.log(data.acceptbanano_api_host);
    const session = acceptBanano.createSession({
      apiHost: data.acceptbanano_api_host,
      debug: true,
    });

  session.on('start', () => {
    //BuyingBanano.paymentStarted();
    //console.log('acceptBanano CLIENT EVENT: start')
  });
  
  session.on("close", () => {
    //console.log("Terminated properly.");
    return Router.reload(window.location.pathname);
  });



  session.on('end', (error, payment) => {
    if (error) {
      //return BuyingBanano.paymentFailed({ reason: error.reason })
      if(error.reason === "USER_TERMINATED"){
        setSession(null);
        //console.log("User clicked the X, refreshing...");
        return Router.reload(window.location.pathname);
      }
      return console.log('acceptBanano Error: ',error.reason);
    }
    //console.log('acceptBanano Success: ',payment);
    
    return paymentSucceeded({
      amount: payment.amount,
      state: payment.state,
      data: data
    });
    
  });

  setSession(session);  
}

useEffect(() => {
  if(session === null)
    acceptBananoPreload();
  });

  if (!data.sell_rate) return <div>Loading exchange rates...</div>
  console.log("Sell rate:", data.sell_rate);

  const submitBananoPayment = async (event) => {
    event.preventDefault();
    let dest_address = event.target.coin_address_block.value;
    let requestedAmount = parseFloat(event.target.coin_amount.value);
    //console.log("Dest address: ",dest_address);
    //console.log("Requested amount of BANANO: ",requestedAmount);
    //let amountPay = requestedAmount/data.nano_per_banano;
    let amountPay = requestedAmount;
    //console.log("BANANO to pay: ",amountPay)
    return session.createPayment({
      amount: amountPay,
      currency: "BANANO",
      state: paymentState,
    });
  }

  const handleAddressChange = (e) => {
    let localData = data;
    //console.log(e.target.coin_address_block.value);
    if(nanocurrency.checkAddress(e.target.value)) {
      localData.destination_address = e.target.value;
      //console.log("Banano address: ",localData.destination_address);
      
      return setData(localData);
    }
  }

  const handleAmountChange = (e) => {
    //console.log(e.target.form.nano_to_pay.placeholder);
    let localData = data;
    let floatedValue = 0.00;
    const ceiling = data.max_nano_transaction_size;
    //console.log("Ceiling: ",ceiling);
    if(isNaN(e.target.value)) {
      floatedValue = parseFloat(e.target.value);
      localData.amount = floatedValue;
      
    } else {
      localData.amount = e.target.value;
    }
    if((localData.amount*data.sell_rate) > ceiling) {
      e.target.value = ceiling.toFixed(6);
      localData.amount = ceiling.toFixed(6);
    }
    e.target.form.nano_to_receive.placeholder = (localData.amount*(data.sell_rate)).toFixed(6);
    localData.send_amount = e.target.form.nano_to_receive.placeholder;
    return setData(localData);
  } 
  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Sell BANANO
        </h3>
        <h4>@ {data.sell_rate} NANO</h4>
        <p> ~{(1/data.sell_rate).toFixed(3)} BANANO = 1 NANO</p>
        <form onSubmit={submitBananoPayment}>
        <div className="input-group">
            <span className="input-group-text">Receive NANO at:</span>
        <input className="form-control" type="text" name="coin_address_block" placeholder="nano_" autoComplete="on" pattern="^nano_[13][0-13-9a-km-uw-z]{59}$" size="75" required onChange={handleAddressChange} />
        </div>
        <div className="input-group">
        <span className="input-group-text">BANANO to sell:</span>
        <input className="form-control" name="coin_amount" placeholder={(1/data.sell_rate).toFixed(6)} onChange={handleAmountChange} />
        
        </div>
        <div className="input-group">
        <span className="input-group-text">NANO to receive:</span>
          <input className="form-control" name="nano_to_receive" type="text" placeholder={(data.amount*data.sell_rate).toFixed(6)} readOnly />
          
        </div>
        <center>
        <div className="btn-group" role="group" aria-label="Confirm or Cancel">
        <button className="btn btn-primary" type="submit">Confirm</button>
        <button className="btn btn-primary" type="reset">Reset</button>
        </div>
        </center>
        </form>
        <Link href="/"><a>Back to home</a></Link>
        </main>
      <footer className={styles.footer}>
        <p>Copyright &copy; The Nano Swap 2021</p>
      </footer>
    </>
  )
};

export async function getStaticProps(context) {
  const previous_block_response = await fetch(process.env.NANO_WALLET_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    "API_key":process.env.NOWNODES_API_KEY,
    "action":"account_info",
    "account":process.env.NANO_HOTWALLET_ACCOUNT_ONE
    })
  });
  const previous_block = await previous_block_response.json();
  console.log("Hotwallet frontier: ",previous_block.frontier);

  const active_difficulty_repsonse = await fetch(process.env.NANO_WALLET_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    "API_key":process.env.NOWNODES_API_KEY,
    "action":"active_difficulty"
    })
  });
  const active_difficulty = await active_difficulty_repsonse.json();
  console.log("Current difficulty: ",active_difficulty);
  
  const price_list = await updatePriceList();
  //console.log(process.env.BANANO_HOTWALLET_ACCOUNT_ONE);
  
  const nano_balance_lookup = await fetch(process.env.NANO_WALLET_URL,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "action": "account_balance",
      "account": process.env.NANO_HOTWALLET_ACCOUNT_ONE,
      "API_key": process.env.NOWNODES_API_KEY
    })
  });
  let nano_balance_response = await nano_balance_lookup.json();
  //console.log(nano_balance_response);
  let nano_balance = rawToMega(nano_balance_response.balance);
  console.log("NANO Hotwallet Balance: ",nano_balance);
  const MAX_NANO_TRANS_SIZE = nano_balance*0.85;  
  console.log("MAX NANO TRANS SIZE: ",MAX_NANO_TRANS_SIZE);
  let initialData = {
    "id":"banano-button",
    "title":"Confirm",
    "max_nano_transaction_size": MAX_NANO_TRANS_SIZE,
    "receiving_address":"nano_1x9rjf8xnjffznaxd18n8rc1m396ao8ky1uqpmapdzat5npy11if4kuh4ubd",
    "amount":"0.1",
    "destination_address": "",
    "info":"yes",
    "label":"swap",
    "qr-size":"128",
    "qr-level":"M",
    "qr-fg":"#000000",
    "qr-bg":"#FFFFFF",
    "buy_rate":price_list.buy.banano.nano,
    "acceptbanano_api_host": process.env.ACCEPTBANANO_API_HOST,
    "sell_rate": price_list.sell.banano.nano,
    "frontier":previous_block.frontier,
    "difficulty":active_difficulty.network_current
    };
    /*
  try {
    initialData["address"] = (nano_address.account != null ? nano_address.account : "nano_1x9rjf8xnjffznaxd18n8rc1m396ao8ky1uqpmapdzat5npy11if4kuh4ubd");
  } catch (err) {
    console.error(err);
  }
  */
  if (!initialData) {
    return {
      notFound: true,
    }
  }

  return {
    props: { 
      initialData,
     }, 
  }
}