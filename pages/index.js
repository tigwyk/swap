import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

function PairCard(props) {
  return <Link href={"/pairs/"+props.first+"-"+props.second}>
  <a className={styles.card}>
  <h3>{props.first}/{props.second} &rarr;</h3>
  <p>Swap {props.first}/{props.second}</p>
  </a>
  </Link> 
};

export default function Home() {
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
          <PairCard first="NANO" second="BANANO"/>
          <PairCard first="BANANO" second="MOON" />
          <PairCard first="PLACE" second="HOLDER" />
          <PairCard first="NOT" second="REAL" />
        </div>
      </main>

      <footer className={styles.footer}>
        Copyright 2021
      </footer>
    </div>
  )
}
