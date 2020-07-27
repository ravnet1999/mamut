const Service = require('./Service');
const connection = require('../mysql/connection');

class OperatorService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taki operator nie istnieje!';
    }

    login = (username, password) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `' + this.tableName + '` WHERE login=?', [username], (err, results, fields) => {        
                if(err) {
                    reject(err);
                    return;
                }

                if(!results[0]) {
                    reject('Taki użytkownik nie istnieje.');
                    return;
                }

                if(results[0].haslo != password) {
                    reject('Taki użytkownik nie istnieje.');
                    return;
                }

                delete results[0].haslo;
                resolve(results[0]);
                return;
            });
        });
    }
}

module.exports = new OperatorService('informatycy');