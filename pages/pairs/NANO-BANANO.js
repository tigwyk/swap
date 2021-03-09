import Link from 'next/link'
import styles from '../../styles/Pairs.module.css'


export async function getStaticProps(context) {
  const res = await fetch(`https://theswap.vercel.app/api/nano-banano`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {}, 
  }
}

export default function NanoBanano() {
  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Swap NANO/BANANO
        </h3>
        <div className={styles.grid}>
        <Link href="https://gonano.dev/payment/new">
        <a className={styles.card}>
        <h3>Buy BANANO&rarr;</h3>
        <p>@ (BANANO/NANO rate)</p>
        </a>
        </Link> 
        <Link href="#">
        <a className={styles.card}>
        <h3>Sell BANANO &rarr;</h3>
        <p>@ (NANO/BANANO rate)</p>
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