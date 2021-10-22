const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    password: 'watchdogs',
    host: 'localhost',
    port: 5432,
    database: 'palscheck'
})

module.exports = pool