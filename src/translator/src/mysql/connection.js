const mysql = require('mysql');
const dbConfig = require('../../config/database.json');

dbConfig.connectionLimit = 10;

// const connection = mysql.createConnection(dbConfig);
const connection = mysql.createPool(dbConfig);
 
module.exports = connection;