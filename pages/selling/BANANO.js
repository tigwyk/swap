import styles from '../../styles/Selling.module.css'
import * as nanocurrency from 'nanocurrency'
import BananoButton from '../../components/BananoButton'
import Link from 'next/link'
import price_list from '../../dummy.json'
import {generate_address} from '../api/generate'

export default function SellingBanano({data}) {
  
  if (!price_list) return <div>Loading...</div>
  console.log(price_list);


  const submitAddress = address => {
    console.log(address);
    
    var nano_address = address;
    var knownAddress;
      if(nanocurrency.checkAddress(nano_address)) {
        console.log("Address is in valid format");
        if(!knownAddress) {
          console.log("New address, doesn't match");
        } else {
          console.log("We recognize this address! Let's lookup the previous counter-address");
        }
        
      }
  }

  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Sell BANANO
        </h3>
        <h4>@ {price_list.sell.banano.nano} NANO</h4>
        <div>
<BananoButton data={data} submitAddress={submitAddress} />
        </div>
        <Link href="/"><a>Back to home</a></Link>
        </main>
      <footer className={styles.footer}>
        <p>Copyright 2021</p>
      </footer>
    </>
  )
};

export async function getServerSideProps(context) {
  let banano_address = await generate_address();
  let data = {
    "id":"banano-button",
    "title":"Confirm",
    "address":"ban_16qwweg3e6nm69rkohq1cn75bzohiiemf89pky573ua9oyzwn8d63gg3tnny",
    "amount":"",
    "info":"yes",
    "label":"swap",
    "qr-size":"128",
    "qr-level":"M",
    "qr-fg":"#000000",
    "qr-bg":"#FFFFFF"
    };
  try {
    data["address"] = (banano_address.account != null ? banano_address.account : "ban_16qwweg3e6nm69rkohq1cn75bzohiiemf89pky573ua9oyzwn8d63gg3tnny");
  } catch (err) {
    console.error(err);
  }
  
  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { 
      data,
     }, 
  }
}
