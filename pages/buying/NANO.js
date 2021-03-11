import Link from 'next/link'
import styles from '../../styles/Pairs.module.css'
import BananoButton from '../components/BananoButton'

export default function BuyingNano({prices,data}) {
  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Buy NANO
        </h3>
        <BananoButton data={this.props} />

        <Link href="/"><a>Back to home</a></Link>
        </main>
      <footer className={styles.footer}>
      </footer>
    </>
  )
}

