const { Pool, Client } = require('pg')


const pool = new Pool({
  user: process.env.USER | 'god',
  host: process.env.PGHOST | 'localhost',
  database: 'twitter_app',
  password: process.env.PASSWORD,
  port: 5432,
})

module.exports = {
  //https://node-postgres.com/api/pool
    async query(text, params) {

        const client = await pool.connect()
        const db_calls = await client.query(text, params)
        client.release()
        // console.log('in db:', db_calls)
        return db_calls.rows
    }
}