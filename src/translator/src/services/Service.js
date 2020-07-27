const connection = require('../mysql/connection');

class Service {
    constructor(tableName) {
        this.tableName = tableName;
    }

    findById = (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM ? WHERE `id`=?', [this.tableName, id], (err, results, fields) => {
                if(err) {
                    reject(err);
                    next(err);
                    return;
                }

                resolve(results);
                return;
            });
        });
    }
}

module.exports = Service;