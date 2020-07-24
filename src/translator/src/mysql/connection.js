const mysql = require('mysql');
const dbConfig = require('../../config/database.json');

const connection = mysql.createConnection(dbConfig);
 
module.exports = connection;