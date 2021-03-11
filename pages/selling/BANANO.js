import Link from 'next/link'
import styles from '../../styles/Pairs.module.css'
import BananoButton from '../../components/BananoButton'

export default function SellingBanano({data}) {
  return (
    <>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Sell BANANO
        </h3>
        <form action="/api/sell" method="POST">
        <div className="input-group">
<input className="form-label" type="text" name="coin_address_block" placeholder="nano_" autoComplete="on" required="" pattern="^[nano|xrb]_[13][0-13-9a-km-uw-z]{59}$" size="75"/>
<BananoButton data={data} type="submit"/>
</div>
</form>
        
        <Link href="/"><a>Back to home</a></Link>
        </main>
      <footer className={styles.footer}>
      </footer>
    </>
  )
}


export async function getServerSideProps(context) {
  
  const data = {
    "id":"banano-button",
    "title":"Confirm",
    "address":"ban_16qwweg3e6nm69rkohq1cn75bzohiiemf89pky573ua9oyzwn8d63gg3tnny",
    "amount":"",
    "info":"yes",
    "label":"swap",
    "qr-size":"128",
    "qr-level":"M",
    "qr-fg":"#000000",
    "qr-bg":"#FFFFFF"
  };
  console.log(data);

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { 
      data,
     }, 
  }
}
