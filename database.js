const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'codespace',
  password:'coli@12345'
});

module.exports=connection.promise()