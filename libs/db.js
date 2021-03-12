// db.js
import mysql from 'serverless-mysql';
const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
});

export default async function excuteQuery({ query, values }) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}

export async function findAddress({ address }) {
  try {
      const result = await excuteQuery({
          query: 'SELECT * FROM address_pairs WHERE first_address = ?',
          values: [ address ],
      });
      return result[0];
  } catch (error) {
      console.log(error);
  }
}

export async function insertAddressPair({ address1, address2 }) {
 
  try {
    const result = await excuteQuery({
        query: 'INSERT INTO address_pairs (first_address,second_address) VALUES(?, ?)',
        values: [address1,address2],
    });
    console.log( result );
} catch ( error ) {
    console.log( error );
}

return user;
}