const mysql = require('serverless-mysql')

console.log(process.env.MYSQL_HOST);
console.log(process.env.MYSQL_DATABASE);

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
})

exports.query = async (query) => {
  try {
    const results = await db.query(query);
    await db.end();
    console.log(await results);
    return results;
  } catch (error) {
      console.error(error);
    return { error }
  }
}