// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

function handler (req, res) {
    fetch(process.env.BANANO_WALLET_URL,{
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            "action":"account_create",
            "wallet": process.env.BANANO_WALLET_SEED
        })
    })
    .then( data => res.status(200).json(data) )
    .catch( error => console.log(error) )
    //res.status(200).json({  })
  }

  export default handler;