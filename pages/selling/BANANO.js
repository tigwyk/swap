import Link from 'next/link'
import styles from '../../styles/Pairs.module.css'
import BananoButton from '../../components/BananoButton'
//import ExchangeRate from '../../components/ExchangeRate'
import * as nanocurrency from 'nanocurrency';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SellingBanano({data}) {
  
  const { prices, error } = useSWR('/api/prices', fetcher);
  const {generated_address} = useSWR('/api/generate', fetcher);
  if (error) return <div>Failed to load</div>
  if (!prices) return <div>Loading...</div>
  console.log(prices);


  const submitAddress = address => {
    console.log(address);
    //event.preventDefault() // don't redirect the page
    var nano_address = address;
    var knownAddress;
      //console.log(this.state.nano_address);
      if(nanocurrency.checkAddress(nano_address)) {
        console.log("Address is in valid format");
        if(!knownAddress) {
          console.log("New address, doesn't match");
          return (
            <>
            <p>{generated_address}</p>
            </>
          );
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
