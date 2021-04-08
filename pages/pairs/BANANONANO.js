import Link from 'next/link'
import styles from '../../styles/Pairs.module.css'
import {updatePriceList} from '../api/prices'

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
          Buy or Sell BANANO for NANO
        </h3>
        <div className={styles.grid}> 

            <BuyCard quote="NANO" base="BANANO" price={prices.buy.banano.nano}/>

            <SellCard quote="NANO" base="BANANO" price={prices.sell.banano.nano}/>

        </div>
        <Link href="/"><a>Back to home</a></Link>
        </main>
      <footer className={styles.footer}>
      <p>Copyright &copy; The Swap 2021</p>
      </footer>
    </>
  )
}

export async function getStaticProps(context) {
  const updatePrices = await updatePriceList();
  console.log(updatePrices);
  
  let prices = updatePrices;
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