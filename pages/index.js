import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home({prices,data}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>The Swap</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the swap!
        </h1>

        <div className={styles.grid}>
          <PairCard quote="NANO" base="BANANO" buy={prices.buy.banano.nano} sell={prices.sell.banano.nano}></PairCard>
          <PairCard quote="NANO" base="MOON" buy={prices.buy.moon.nano} sell={prices.sell.moon.nano}></PairCard>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Copyright 2021 | {data.joke}</p>
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

  const prices = { 
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
      prices,
      data,
     }, 
  }
}