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
          Thanks for using The Nano Swap!
        </h1>
<h1>We're sending your funds...</h1>
<Link href="/">Home</Link>
      </main>

      <footer className={styles.footer}>
        <p>Copyright &copy; The Nano Swap 2021</p>
      </footer>
    </div>
  )
}
