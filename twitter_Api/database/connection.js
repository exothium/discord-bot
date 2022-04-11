const mysql = require('mysql');
const config = require("../../config.json");
var pool = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    port: config.DB_PORT,
    password: config.DB_PASSWORD,
    database: config.DB_SCHEMA
})

pool.getConnection((err, con) => {
    if (err) {
        console.log(err)
    } else {
        console.log('MySQL connected')
    }
})

pool.on('error', (err) => console.log(err))

module.exports = pool