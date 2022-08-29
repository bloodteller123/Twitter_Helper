const { Pool, Client } = require('pg')


const pool = new Pool({
  user: process.env.USER,
  host: 'localhost',
  database: 'twitter_app',
  password: null,
  port: 5432,
})

module.exports = {
  //https://node-postgres.com/api/pool
    async query(text) {
        const client = await pool.connect()
        const db_calls = await client.query(text)
        client.release()
        console.log('in db:', db_calls.rows)
        return db_calls.rows
    }
}