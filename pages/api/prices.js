// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export const price_list = { 
  "sell": {
    "banano": { 
      "nano":'0.00235000',
      "moon" : "99999999999",
    },
    "moon": { 
      "nano":'0.01008179',
      "banano" : "99999999999",
    }
  },
  "buy" :{ 
    "banano":{
      "nano": '0.00296340',
      "moon" : "999999999999"
    },
    "moon":{
      "nano" : "0.01180028",
    }
  }
  };

function handler (req, res) {
  res.status(200).json(price_list)
}

export default handler;