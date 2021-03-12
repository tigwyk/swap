import Link from 'next/link'
import styles from '../../styles/Pairs.module.css'
import BananoButton from '../../components/BananoButton'
import * as nanocurrency from 'nanocurrency';
import insertAddressPair from '../../libs/db';
import findAddress from '../../libs/db';

export default function SellingBanano({data,rates}) {
  //console.log(data);
  const submitAddress = address => {
    console.log(address);
    //event.preventDefault() // don't redirect the page
    var nano_address = address;
    var knownAddress;
      //console.log(this.state.nano_address);
      if(nanocurrency.checkAddress(nano_address)) {
        console.log("Address is in valid format");
        findAddress(nano_address).then( known_address => {
          console.log(known_address);
          data.address = known_address;
          knownAddress = true;
        }).catch(error => {
          console.error(error);
        });
        if(!knownAddress)
          console.log("New address, doesn't match");
        else
          console.log("We recognize this address! Let's lookup the previous counter-address");
        //event.target.banano_button.setState({ showButton: false, showQR: true });
      }
  }

  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Sell BANANO
        </h3>
        <div>
<BananoButton data={data} submitAddress={submitAddress}/>
        </div>
        <Link href="/"><a>Back to home</a></Link>
        </main>
      <footer className={styles.footer}>
      </footer>
    </>
  )
};

export async function getServerSideProps(context) {
  
  const data = {
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
  console.log(data);
  var rates = {"nano":0.123};


  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { 
      data,
      rates
     }, 
  }
}
