const mysql = require('mysql');

/* const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    password: '',
    database: 'udemy_delivery'
}); */

const db = mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
});

db.connect(function(err) {
    if (err) throw err;
    console.log('DATABASE CONNECTED!');
});

module.exports = db;