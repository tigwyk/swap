import Link from 'next/link'
import styles from '../../styles/Pairs.module.css'

export default function NanoBanano({prices,data}) {
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
        <p>@ { prices.nanobanano } NANO</p>
        </a>
        </Link> 
        <Link href="#">
        <a className={styles.bananocard}>
        <h3>Sell BANANO &rarr;</h3>
        <p>@ { prices.bananonano } NANO</p>
        
        </a>
        </Link> 
        </div>
        <Link href="/"><a>Back to home</a></Link>
        </main>
      <footer className={styles.footer}>
      <p>{data.joke}</p>
      </footer>
    </>
  )
}

