const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'victor25',
    database: 'CRMsvelte',
});

module.exports = db;