import { useEffect, useState } from 'react';
import styles from '../../styles/Selling.module.css';
import * as nanocurrency from 'nanocurrency';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';

const bananojs = require('@bananocoin/bananojs');
import { rawToBan } from 'banano-unit-converter';

import {updatePriceList} from '../api/prices'
const acceptNano = require('@accept-nano/client');

//console.log(process.env.ACCEPTNANO_API_HOST);

async function paymentSucceeded({amount, state, data}) {
  //const payment = await sendBananoPayment(data.amount,destination);
  Router.push('/success');
  const payment = await axios.post('/api/sendBanano', {
    amount: data.amount,
    destination: data.destination_address,
    state: state
  });
}

export default function BuyingBanano({initialData}) {
  const [data, setData] = useState(initialData);
  const [session, setSession] = useState(null);
  const [paymentState, setPaymentState] = useState(null);
  
  function acceptNanoPreload(){
    //console.log(data.acceptnano_api_host);
    const session = acceptNano.createSession({
      apiHost: data.acceptnano_api_host,
    });

  session.on('start', () => {
    console.log('ACCEPTNANO CLIENT EVENT: start')
  });
  
  session.on('end', (error, payment) => {
    if (error) {
      if(error.reason === "USER_TERMINATED"){
        setSession(null);
        //User clicked the X, refreshing...
        return Router.reload(window.location.pathname);
      }
      return console.log('ACCEPTNANO Error: ',error.reason);
    }
    console.log('ACCEPTNANO Success: ',payment);
    //console.log("Payment state: ",payment.state);
    
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
    acceptNanoPreload();
  });
 

  if (!data.buy_rate) return <div>Loading exchange rates...</div>

  const submitNanoPayment = async (event) => {
    event.preventDefault();
    
    let requestedAmount = parseFloat(event.target.coin_amount.value);

    let amountPay = requestedAmount*data.buy_rate;

    return session.createPayment({
      amount: amountPay,
      currency: "NANO",
      state: paymentState,
    });
  }

  const handleAddressChange = (e) => {
    let localData = data;
    if(bananojs.getBananoAccountValidationInfo(e.target.value).valid) {
      localData.destination_address = e.target.value;      
      return setData(localData);
    }
  }

  const handleAmountChange = (e) => {
    let localData = data;
    let floatedValue = 0.00;
    console.log("Max banano transaction size in handleAmountChange: ",data.max_banano_transaction_size);
    const ceiling = data.max_banano_transaction_size;
    localData.amount = parseFloat(e.target.value);
    if(localData.amount > ceiling) {
      console.log("Amount is larger than ceiling?",localData.amount);
      console.log("Ceiling: ",ceiling);
      e.target.value = ceiling;
      localData.amount = ceiling;
    }
    e.target.form.nano_to_pay.placeholder = (localData.amount*data.buy_rate).toFixed(6);
    return setData(localData);
  }

  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Buy BANANO
        </h3>
        <h4>@ {data.buy_rate} NANO/per</h4>
        <p>1 NANO = ~{(1/data.buy_rate).toFixed(6)} BANANO</p>
        <small>Max. {data.max_banano_transaction_size} BANANO</small>
        <form onSubmit={submitNanoPayment}>
        <div className="input-group">
            <span className="input-group-text">Receive BANANO at:</span>
        <input className="form-control" type="text" name="coin_address_block" placeholder="ban_" autoComplete="on" pattern="^ban_[13][0-13-9a-km-uw-z]{59}$" size="75" required onChange={handleAddressChange} />
        </div>
        <div className="input-group">
        <span className="input-group-text">BANANO to receive:</span>
        <input className="form-control" name="coin_amount" placeholder='300' onChange={handleAmountChange} />
        
        </div>
        <div className="input-group">
        <span className="input-group-text">NANO to pay:</span>
          <input className="form-control" name="nano_to_pay" type="text" placeholder={1} readOnly />
          
        </div>
        <center>
        <small>SEND ONLY THE SPECIFIED AMOUNT. ANY OVERAGES WILL BE CONSIDERED TIPS.</small><br/>
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

export async function getServerSideProps(context) {
  const price_list = await updatePriceList();
  const balance_query = {
    "action": "account_balance",
    "account": process.env.BANANO_HOTWALLET_ACCOUNT_ONE
  };

  const banano_balance_lookup = await fetch(process.env.BANANO_WALLET_URL,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(balance_query)
  });
  let banano_balance_response = await banano_balance_lookup.json();
  let banano_balance = 0;
  if(!isNaN(banano_balance_response.balance) && banano_balance_response.balance > 0) {
    console.log("Raw banano hotwallet balance: ",banano_balance_response.balance);
    banano_balance = rawToBan(banano_balance_response.balance);
  } else {
    banano_balance = 0;
  }
  console.log("Convert banano balance: ", banano_balance);
  const MAX_BANANO_TRANS_SIZE = banano_balance*0.40;

  console.log("Max Banano Transaction Size in getStaticProps: ",MAX_BANANO_TRANS_SIZE);
  let initialData = {
    "id":"banano-button",
    "title":"Confirm",
    "max_banano_transaction_size": MAX_BANANO_TRANS_SIZE.toFixed(2),
    "receiving_address":"nano_1x9rjf8xnjffznaxd18n8rc1m396ao8ky1uqpmapdzat5npy11if4kuh4ubd",
    "amount":"0.1",
    "destination_address": "",
    "info":"yes",
    "label":"swap",
    "qr-size":"128",
    "qr-level":"M",
    "qr-fg":"#000000",
    "qr-bg":"#FFFFFF",
    "sell_rate":price_list.sell.banano.nano,
    "acceptnano_api_host": process.env.ACCEPTNANO_API_HOST,
    "buy_rate": price_list.buy.banano.nano,
    };

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
