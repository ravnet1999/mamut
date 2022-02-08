const Service = require('../Service');
const connection = require('../../mysql/connection');

class CompanyLocationService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taka lokalizacja firmy nie istnieje!';
    }

    findByCompanyId = (companyId) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `' + this.tableName + '` WHERE `id_klienta` = ?', [companyId], (err, results, fields) => {
                if(err) {
                    reject(err);
                    return;
                }

                if(results.length === 0) {
                    reject(this.findByIdEmpty);
                    return;
                }

                resolve(results);
                return;
            });
        });
    }
}

module.exports = new CompanyLocationService('lokalizacje');