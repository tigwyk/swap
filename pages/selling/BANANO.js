import styles from '../../styles/Selling.module.css'
import * as nanocurrency from 'nanocurrency'
import BananoButton from '../../components/BananoButton'
import Link from 'next/link'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json());

function SellingBanano({data}) {
  
  const {prices, error}  = useSWR('/api/prices', fetcher);
  if (error) return <div>Failed to load</div>
  if (!prices) return <div>Loading...</div>
  console.log(prices);


  const submitAddress = address => {
    console.log(address);
    
    var nano_address = address;
    var knownAddress;
      //console.log(this.state.nano_address);
      if(nanocurrency.checkAddress(nano_address)) {
        console.log("Address is in valid format");
        if(!knownAddress) {
          console.log("New address, doesn't match");
        } else {
          console.log("We recognize this address! Let's lookup the previous counter-address");
        }
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

export async function getStaticProps(context) {
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

export default SellingBanano;