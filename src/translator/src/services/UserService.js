const Service = require('./Service');
const connection = require('../mysql/connection');

class UserService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taki użytkownik nie istnieje!';
    }

    findByClientId = (clientIds) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `' + this.tableName + '` WHERE `id_klienta` IN (?) AND `aktywny`=\'on\'', [clientIds], (err, results, fields) => {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(results);
                return;
            });
        });
    }
}

module.exports = new UserService('uzytkownicy');