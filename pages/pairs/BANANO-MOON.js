import Link from 'next/link'
import styles from '../../styles/Pairs.module.css'

export default function BananoMoons() {
  return (
    <>
     <main className={styles.main}>
        <h3 className={styles.title}>
          Swap BANANO/MOON
        </h3>
        <div className={styles.grid}>
        <Link href="#">
        <a className={styles.card}>
        <h3>Buy MOON&rarr;</h3>
        <p>Send BANANO, Receive MOONs</p>
        </a>
        </Link> 
        <Link href="#">
        <a className={styles.card}>
        <h3>Buy BANANO &rarr;</h3>
        <p>Send MOONs, Receive BANANO</p>
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