// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

let address_list = [];

export default async function handler (req, res) {
    try{ 
        const generated_address = await generate_banano_address();
        res.status(200).json(generated_address);
    } catch(error) {
        res.status(error).json(error.JSON);
    }
  }

export async function generate_banano_address() {
    //console.log("Banano HotWallet ID: ",process.env.BANANO_WALLET_ID);
    //console.log("Banano HotWallet Seed: ",process.env.BANANO_WALLET_SEED);
    //console.log("Banano Wallet URL: ",process.env.BANANO_WALLET_URL);
    const post_data = {
        "action":'account_create',
        "wallet":process.env.BANANO_INCOMING_WALLET_ID,
    };
    //console.log(post_data);
    const new_address = fetch(process.env.BANANO_WALLET_URL,{
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(post_data),
    })
    .then(response => {
        const contentType = response.headers.get('content-type');
     if (!contentType || !contentType.includes('application/json')) {
       throw new TypeError("Oops, we haven't got JSON!");
     }
     return response.json();
    })
    .then( data => {
        //console.log("Success: ",data);
        address_list += data.account;
        return data;
    })
    .catch( error => console.error("Error: ",error) );

    return new_address;
}


export async function generate_nano_address() {
    //console.log("Banano HotWallet ID: ",process.env.BANANO_WALLET_ID);
    //console.log("Banano HotWallet Seed: ",process.env.BANANO_WALLET_SEED);
    //console.log("Banano Wallet URL: ",process.env.BANANO_WALLET_URL);
    const post_data = {
        "action":'account_create',
        "wallet":process.env.NANO_INCOMING_WALLET_ID,
    };
    //console.log(post_data);
    const new_address = fetch(process.env.NANO_WALLET_URL,{
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(post_data),
    })
    .then(response => {
        const contentType = response.headers.get('content-type');
     if (!contentType || !contentType.includes('application/json')) {
       throw new TypeError("Oops, we haven't got JSON!");
     }
     return response.json();
    })
    .then( data => {
        //console.log("Success: ",data);
        address_list += data.account;
        return data;
    })
    .catch( error => console.error("Error: ",error) );

    return new_address;
}