const mysql = require('mysql');

/* const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    password: '',
    database: 'udemy_delivery'
}); */

/* const db = mysql.createConnection({
    host: 'bymt4axcbobyp08qck0c-mysql.services.clever-cloud.com',
    user: 'uprupiasdre0lzxq',
    password: 'uSiuUnVUTW6iDMt4qg4v',
    database: 'bymt4axcbobyp08qck0c'
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