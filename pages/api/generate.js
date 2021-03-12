// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler (req, res) {
    fetch('http://ec2-34-226-15-179.compute-1.amazonaws.com:11338',{
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
  