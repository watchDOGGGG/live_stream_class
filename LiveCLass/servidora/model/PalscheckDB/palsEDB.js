const Pool = require('pg').Pool

const Epool = new Pool({
    user: 'postgres',
    password: 'watchdogs',
    host: 'localhost',
    port: 5432,
    database: 'palselearning'
})

module.exports = Epool