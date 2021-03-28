import { useEffect, useState } from 'react';
import styles from '../../styles/Selling.module.css';
import * as nanocurrency from 'nanocurrency';
import Link from 'next/link';
import Router from 'next/router';

const bananojs = require('@bananocoin/bananojs');
import { rawToBan } from 'banano-unit-converter';

let price_list = require( '../../libs/dummy.json');
const acceptNano = require('@accept-nano/client');

//console.log(process.env.ACCEPTNANO_API_HOST);

function paymentSucceeded(amount, state) {
  console.log("Amount: ",amount);
  console.log("Payment state: ",state);
}

export default function BuyingBanano({initialData}) {
  const [data, setData] = useState(initialData);
  const [session, setSession] = useState(null);
  
  function acceptNanoPreload(){
    //console.log(data.acceptnano_api_host);
    const session = acceptNano.createSession({
      apiHost: data.acceptnano_api_host,
      debug: true,
    });

  session.on('start', () => {
    //BuyingBanano.paymentStarted();
    console.log('ACCEPTNANO CLIENT EVENT: start')
  });
  
  session.on('end', (error, payment) => {
    if (error) {
      //return BuyingBanano.paymentFailed({ reason: error.reason })
      if(error.reason === "USER_TERMINATED"){
        setSession(null);
        console.log("User clicked the X, refreshing...");
        return Router.reload(window.location.pathname);
      }
      return console.log('ACCEPTNANO Error: ',error.reason);
    }
    console.log('ACCEPTNANO Success: ',payment);
    
    return paymentSucceeded({
      amount: payment.amount,
      state: payment.state,
    });
    
  });
  setSession(session);  
}
//acceptNanoPreload();


  useEffect(() => {
  if(session === null)
    acceptNanoPreload();
  });
 

  if (!price_list) return <div>Loading exchange rates...</div>
  //console.log(price_list);

  const submitNanoPayment = async (event) => {
    event.preventDefault();
    let dest_address = event.target.coin_address_block.value;
    let requestedAmount = parseFloat(event.target.coin_amount.value);
    //console.log("Dest address: ",dest_address);
    //console.log("Requested amount of BANANO: ",requestedAmount);
    let amountPay = requestedAmount*data.nano_per_banano;
    //console.log("NANO to pay: ",amountPay)
    return session.createPayment({
      amount: amountPay,
      currency: 'NANO',
      state: data,
    });
  }

  const handleAddressChange = (e) => {
    let localData = data;
    //console.log(e.target.coin_address_block.value);
    if(bananojs.getBananoAccountValidationInfo(e.target.value).valid) {
      localData.destination_address = e.target.value;
      //console.log("Banano address: ",localData.destination_address);
      
      return setData(localData);
    }
  }

  const handleAmountChange = (e) => {
    //console.log(e.target.form.nano_to_pay.placeholder);
    let localData = data;
    let floatedValue = 0.00;
    const ceiling = data.max_banano_transaction_size;
    if(isNaN(e.target.value)) {
      floatedValue = parseFloat(e.target.value);
      localData.amount = floatedValue;
      
    } else {
      localData.amount = e.target.value;
    }
    if(localData.amount > ceiling) {
      e.target.value = ceiling;
      localData.amount = ceiling;
    }
    e.target.form.nano_to_pay.placeholder = (localData.amount*data.nano_per_banano).toFixed(6);
    return setData(localData);
  }

  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Buy BANANO
        </h3>
        <h4>@ {(1/data.exchange_rate).toFixed(6)} NANO/per</h4>
        <p>1 BANANO = ~{data.nano_per_banano} NANO</p>
        <small>Max. {data.max_banano_transaction_size} BANANO</small>
        <form onSubmit={submitNanoPayment}>
        <div className="input-group">
            <span className="input-group-text">Receive BANANO at:</span>
        <input className="form-control" type="text" name="coin_address_block" placeholder="ban_1burnbabyburndiscoinferno111111111111111111111111111aj49sw3w" autoComplete="on" pattern="^ban_[13][0-13-9a-km-uw-z]{59}$" size="75" required onChange={handleAddressChange} />
        </div>
        <div className="input-group">
        <span className="input-group-text">BANANO to receive:</span>
        <input className="form-control" name="coin_amount" placeholder={data.banano_per_nano.toFixed(6)} onChange={handleAmountChange} />
        
        </div>
        <div className="input-group">
        <span className="input-group-text">NANO to pay:</span>
          <input className="form-control" name="nano_to_pay" type="text" placeholder={(data.amount*data.nano_per_banano).toFixed(6)} readOnly />
          
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
        <p>Copyright 2021</p>
      </footer>
    </>
  )
};

export async function getStaticProps(context) {
  let usd_price_lookup = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=nano,banano&vs_currencies=usd");
  //let banano_balance = await fetch("https://api-beta.banano.cc?");
  //let nano_balance = await fetch("https://proxy.powernode.cc/proxy?action=");

  //console.log(process.env.BANANO_HOTWALLET_ACCOUNT_ONE);
  const balance_query = {
    "action": "account_balance",
    "account": process.env.BANANO_HOTWALLET_ACCOUNT_ONE
  };

  const banano_balance_lookup = await fetch(process.env.BANANO_WALLET_URL,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(balance_query)
  });
  let banano_balance_response = await banano_balance_lookup.json();
  console.log(banano_balance_response);
  let banano_balance = rawToBan(banano_balance_response.balance);
  console.log(banano_balance);
  const MAX_BANANO_TRANS_SIZE = banano_balance*0.85;
  let usd_price_data = await usd_price_lookup.json();
  //console.log(usd_price_data);
  //console.log("NANO: ",usd_price_data.nano.usd);
  //console.log("BANANO: ",usd_price_data.banano.usd);
  let how_many_nano_per_banano = usd_price_data.banano.usd / usd_price_data.nano.usd;
  let how_many_banano_per_nano = usd_price_data.nano.usd / usd_price_data.banano.usd;
  //console.log("NANO/BANANO: ",how_many_nano_per_banano.toFixed(6));
  //console.log("BANANO/NANO: ",how_many_banano_per_nano.toFixed(6));
  let exchange_rate = ((1/how_many_nano_per_banano)*.9).toFixed(6);
  //let buy_rate = ((how_many_banano_per_nano.toFixed(6))*0.95).toFixed(6);
  //console.log("Exchange rate: ",exchange_rate);
  //let nano_address = await generate_nano_address();

  let initialData = {
    "id":"banano-button",
    "title":"Confirm",
    "max_banano_transaction_size": MAX_BANANO_TRANS_SIZE,
    "receiving_address":"nano_1x9rjf8xnjffznaxd18n8rc1m396ao8ky1uqpmapdzat5npy11if4kuh4ubd",
    "amount":"0.1",
    "destination_address": "",
    "info":"yes",
    "label":"swap",
    "qr-size":"128",
    "qr-level":"M",
    "qr-fg":"#000000",
    "qr-bg":"#FFFFFF",
    "exchange_rate":exchange_rate,
    "acceptnano_api_host": process.env.ACCEPTNANO_API_HOST,
    //"buy_rate": buy_rate,
    "nano_per_banano":(1/exchange_rate).toFixed(6),
    "banano_per_nano":how_many_banano_per_nano,
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
