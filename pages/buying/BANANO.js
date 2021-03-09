import Link from 'next/link'
import styles from '../../styles/Pairs.module.css'

export default function BuyingBanano({prices,data}) {
  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Buy BANANO
        </h3>
        
        <small className="">Please enter your Banano address:<br/></small>
        <form action="/api/buy" method="POST">
<div class="input-group">
<input class="form-control" type="text" name="coin_address_block" placeholder="ban_" autocomplete="on" required="" pattern="^ban_[13][0-13-9a-km-uw-z]{59}$" />
<button class="btn btn-primary" type="submit">Continue</button>
</div>
</form>
        <Link href="/"><a>Back to home</a></Link>
        </main>
      <footer className={styles.footer}>
      </footer>
    </>
  )
}

