const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB } = process.env;

const mysqlConfig = {
    connectionLimit: 10,
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB
}

const pool = mysql.createPool(mysqlConfig);
module.exports = pool;