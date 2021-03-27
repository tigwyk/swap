import { useState } from 'react';
import styles from '../../styles/Selling.module.css';
import * as nanocurrency from 'nanocurrency';
import BananoButton from '../../components/BananoButton';
import Link from 'next/link';
import {generate_banano_address} from '../api/generate';

let price_list = require( '../../libs/dummy.json');

export default function SellingBanano({initialData}) {
  const [data, setData] = useState(initialData);
  
  if (!price_list) return <div>Loading exchange rates...</div>
  //console.log(price_list);


  const submitAddress = async (address) => {

    //console.log(address);
    
    let nano_address = address;
    
    if(nanocurrency.checkAddress(nano_address)) {
      //console.log("Address is in valid format");

      const sell_order = {
        "base_address": data.address,
        "quote_address": nano_address,
        "base_currency":"banano",
        "quote_currency":"nano",
        "exchange_rate":data.exchange_rate
      };

      const submit_sell_order = await fetch("http://localhost:3000/api/sell",{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sell_order)
      });
      const sell_order_results = await submit_sell_order.json();
      //console.log(sell_order_results);
    }
  };

  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Sell BANANO
        </h3>
        <h4>@ {data.exchange_rate} NANO</h4>
        <p>1 NANO = ~{data.banano_per_nano} BANANO</p>
        <form onSubmit={submitAddress}>
        <div>
        <BananoButton data={data} submitAddress={submitAddress} />
        </div>
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
  let usd_price_data = await usd_price_lookup.json();
  console.log(usd_price_data);
  console.log("NANO: ",usd_price_data.nano.usd);
  console.log("BANANO: ",usd_price_data.banano.usd);
  let how_many_nano_per_banano = usd_price_data.banano.usd / usd_price_data.nano.usd;
  let how_many_banano_per_nano = usd_price_data.nano.usd / usd_price_data.banano.usd;
  console.log("NANO/BANANO: ",how_many_nano_per_banano.toFixed(6));
  console.log("BANANO/NANO: ",how_many_banano_per_nano.toFixed(6));
  let exchange_rate = ((how_many_nano_per_banano.toFixed(6))*0.95).toFixed(6);
  console.log("Exchange rate: ",exchange_rate);
  //let banano_address = await generate_banano_address();
  let initialData = {
    "id":"banano-button",
    "title":"Confirm",
    "address":"ban_16qwweg3e6nm69rkohq1cn75bzohiiemf89pky573ua9oyzwn8d63gg3tnny",
    "amount":"",
    "info":"yes",
    "label":"swap",
    "qr-size":"128",
    "qr-level":"M",
    "qr-fg":"#000000",
    "qr-bg":"#FFFFFF",
    "exchange_rate":exchange_rate,
    "banano_per_nano":how_many_banano_per_nano.toFixed(2)
    };
    /*
  try {
    initialData["address"] = (banano_address.account != null ? banano_address.account : "ban_16qwweg3e6nm69rkohq1cn75bzohiiemf89pky573ua9oyzwn8d63gg3tnny");
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
