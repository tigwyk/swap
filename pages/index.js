import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home({local_prices,data}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>The Nano Swap</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="//instant.page/5.1.0" type="module" integrity="sha384-by67kQnR+pyfy8yWP4kPO12fHKRLHZPfEsiSXR8u2IKcTdxD805MGUXBzVPnkLHw"></script>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the swap!
        </h1>

        <div className={styles.grid}>
          <PairCard quote="NANO" base="BANANO" buy={local_prices.buy.banano.nano} sell={local_prices.sell.banano.nano}></PairCard>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Copyright &copy; The Swap 2021 | {data.joke}</p>
      </footer>
    </div>
  )
}


export function PairCard(props) {
  return <Link href={"/pairs/"+(props.base+props.quote)}>
  <a className={styles.card}>
  <h3>Swap {props.base}/{props.quote} </h3>
  <p>Buy: {props.buy} {props.quote}</p>
  <p>Sell: {props.sell} {props.quote}</p>
  </a>
  </Link> 
};


export async function getStaticProps(context) {
  const res = await fetch(`https://icanhazdadjoke.com/`,{
  headers : { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
   }});
  const data = await res.json();

  const local_prices = { 
    "sell": {
      "banano": { 
        "nano":'0.00235000',
        "moon" : "99999999999",
      },
      "moon": { 
        "nano":'0.01008179',
        "banano" : "99999999999",
      }
    },
    "buy" :{ 
      "banano":{
        "nano": '0.00296340',
        "moon" : "999999999999"
      },
      "moon":{
        "nano" : "0.01180028",
      }
    }
    };

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { 
      local_prices,
      data,
     }, 
  }
}