const mysql = require('mysql');

// Creating a connection to DB
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'nodesql',
});

// Connecting to DB
con.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

// DB query handlers
con;

module.exports = con;
