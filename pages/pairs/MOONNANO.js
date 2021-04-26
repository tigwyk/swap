import Link from 'next/link'
import styles from '../../styles/Pairs.module.css'

export function BuyCard(props) {
  return <Link href={"/buying/"+props.base}>
  <a className={styles.card}>
  <h3>Buy {props.base} </h3>
  <p>@ {props.price} {props.quote}</p>
  </a>
  </Link> 
};

export function SellCard(props) {
  return <Link href={"/selling/"+props.base}>
  <a className={styles.card}>
  <h3>Sell {props.base}</h3>
  <p>@ {props.price} {props.quote}</p>
  </a>
  </Link> 
};

export default function BananoNano({prices}) {
  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Swap NANO/BANANO
        </h3>
        <div className={styles.grid}> 
        <BuyCard quote="NANO" base="MOON" price={prices.buy.moon.nano}/>
        <SellCard quote="NANO" base="MOON" price={prices.sell.moon.nano}/>
        </div>
        <Link href="/"><a>Back to home</a></Link>
        </main>
      <footer className={styles.footer}>
      </footer>
    </>
  )
}

export async function getStaticProps(context) {
  const prices = {
    "sell": {
      "moon": { 
        "nano":'0.01008179',
        "banano" : "99999999999",
      }
    },
    "buy" :{ 
      "nano":{
        "banano": '0.00235000',
        "moon" : "0."
      },
      "moon":{
        "nano" : "0.01180028",
      }
    }
  }

  if (!prices) {
    return {
      notFound: true,
    }
  }

  return {
    props: { 
      prices,
     }, 
  }
}