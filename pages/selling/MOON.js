import Link from 'next/link'
import styles from '../../styles/Pairs.module.css'

export default function SellingMoon({prices,data}) {
  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Sell MOONs
        </h3>
        

        <Link href="/"><a>Back to home</a></Link>
        </main>
      <footer className={styles.footer}>
      </footer>
    </>
  )
}

