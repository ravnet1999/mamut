const connection = require('./connection');

const parseResult = (err, results, fields, callback) => {
    if(err) {
        console.log('MySQL Error: ', err);
    } else {
        callback(results, fields);
    }
}

const query = (queryString, data, callback) => {
    connection.query(queryString, data, (err, results, fields) => {
        parseResult(err, results, fields, callback);
    });
}

module.exports = query;