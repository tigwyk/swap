import { useEffect, useState } from 'react';
import styles from '../../styles/Selling.module.css';
import * as nanocurrency from 'nanocurrency';
import NanoButton from '../../components/NanoButton';
import Link from 'next/link';
//import {generate_nano_address} from '../api/generate';
const bananoUtil = require('@bananocoin/bananojs');

let price_list = require( '../../libs/dummy.json');
const acceptNano = require('@accept-nano/client');

//console.log(process.env.ACCEPTNANO_API_HOST);

export default function BuyingBanano({initialData}) {
  const [data, setData] = useState(initialData);
  const [session, setSession] = useState(null);
  
  function acceptNanoPreload(){
    console.log(data.acceptnano_api_host);
    const session = acceptNano.createSession({
      apiHost: data.acceptnano_api_host,
    });

  session.on('start', () => {
    //BuyingBanano.paymentStarted();
    console.log('ACCEPTNANO CLIENT EVENT: start')
  });
  
  session.on('end', (error, payment) => {
    if (error) {
      //return BuyingBanano.paymentFailed({ reason: error.reason })
      setSession(null);
      return console.log('ACCEPTNANO Error: ',error.reason);
    }
    return console.log('ACCEPTNANO Success: ',payment);
    /*
    return BuyingBanano.paymentSucceeded({
      amount: payment.amount,
      state: payment.state,
    })
    */
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

  const submitAddress = async (address) => {

    //console.log(address);
    
    let banano_address = address;
    if(bananoUtil.getBananoAccountValidationInfo(banano_address).message === 'valid') {
      //console.log("Address is in valid format");

      const buy_order = {
        "base_address": data.address,
        "quote_address": banano_address,
        "base_currency":"banano",
        "quote_currency":"nano",
        "exchange_rate":data.ecxhange_rate
      };

      const submit_buy_order = await fetch("http://localhost:3000/api/buy",{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(buy_order)
      });
      const buy_order_results = await submit_buy_order.json();
      //console.log(buy_order_results);
    }
  };
  function testPayment() {  
session.createPayment({
  amount: '1',
  currency: 'NANO',
  state: data,
})
  }
  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Buy BANANO
        </h3>
        <h4>@ {(1/data.exchange_rate).toFixed(6)} NANO</h4>
        <p>1 BANANO = ~{data.nano_per_banano} NANO</p>
        <form onSubmit={submitAddress}>
        <div>
        <NanoButton data={data} submitAddress={submitAddress} />
        </div>
        </form>
        <button onClick={testPayment}/>
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
    "address":"nano_1x9rjf8xnjffznaxd18n8rc1m396ao8ky1uqpmapdzat5npy11if4kuh4ubd",
    "amount":"",
    "info":"yes",
    "label":"swap",
    "qr-size":"128",
    "qr-level":"M",
    "qr-fg":"#000000",
    "qr-bg":"#FFFFFF",
    "exchange_rate":exchange_rate,
    "acceptnano_api_host": process.env.ACCEPTNANO_API_HOST,
    //"buy_rate": buy_rate,
    "nano_per_banano":(1/exchange_rate).toFixed(6)
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
