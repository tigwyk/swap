import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Success() {
  return (
    <div className={styles.container}>
      <Head>
        <title>The Nano Swap</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the swap!
        </h1>
<p>Sending funds...</p>
      </main>

      <footer className={styles.footer}>
        <p>Copyright &copy; The Nano Swap 2021</p>
      </footer>
    </div>
  )
}
