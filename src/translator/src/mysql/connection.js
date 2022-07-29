const mysql2 = require('mysql2');
const dbConfig = require('../../config/database.json');

dbConfig.connectionLimit = 10;
dbConfig.charset = 'utf8'

// const connection = mysql.createConnection(dbConfig);
// const connection = mysql2.createPool(dbConfig);
const connection = mysql2.createConnection(dbConfig);

module.exports = connection;
