const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'crmsvelte',
});

module.exports = db;

