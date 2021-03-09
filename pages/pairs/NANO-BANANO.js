import Link from 'next/link'
import styles from '../../styles/Pairs.module.css'

export async function getStaticProps(context) {
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=banano&vs_currencies=btc`);
  const data = await res.json();
  console.log(data);

  const prices = {
    "nanobanano":'0.00296340',
    "bananonano":'0.00235000',
  }

  console.log(prices.nanobanano);
  console.log(prices.bananonano);

  if (!data) {
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

export default function NanoBanano(prices) {
  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Swap NANO/BANANO
        </h3>
        <div className={styles.grid}>
        <Link href="#">
        <a className={styles.bananocard}>
        <h3>Buy BANANO&rarr;</h3>
        <p>@ 0.00296340 NANO</p>
        </a>
        </Link> 
        <Link href="#">
        <a className={styles.bananocard}>
        <h3>Sell BANANO &rarr;</h3>
        <p>@ 0.00235000 NANO</p>
        { prices.bananonano }
        </a>
        </Link> 
        </div>
        </main>
      <footer className={styles.footer}>
      <Link href="/"><a>Back to home</a></Link>
      </footer>
    </>
  )
}
