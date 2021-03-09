import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the swap!
        </h1>

        <div className={styles.grid}>
          <Link href="/pairs/nano-banano">
            <a className={styles.card}>
            <h3>NANO/BANANO &rarr;</h3>
            <p>Swap NANO/BANANO</p>
            </a>
            </Link>
          <Link href="/pairs/banano-moon" className={styles.card}>
          <a className={styles.card}>
            <h3>BANANO/MOON &rarr;</h3>
            <p>Swap BANANO/MOON</p>
            </a>
            </Link>
          <Link href="#" className={styles.card}>
          <a className={styles.card}>
            <h3>NANO/BANANO &rarr;</h3>
            <p>Swap NANO/BANANO</p>
            </a>
            </Link>
          <Link href="#"  className={styles.card}>
          <a className={styles.card}>
            <h3>NANO/BANANO &rarr;</h3>
            <p>Swap NANO/BANANO</p>
            </a>
            </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        Copyright 2021
      </footer>
    </div>
  )
}
