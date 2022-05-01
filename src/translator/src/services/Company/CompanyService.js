const Service = require('../Service');
const connection = require('../../mysql/connection');

class CompanyService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taka firma nie istnieje!';
    }

    updateById = (id, columns, values) => {
        return new Promise((resolve, reject) => {
            let columnsString = this.parseColumnsForUpdate(columns);

            if(columns.length != values.length) {
                reject('Liczba kolumn musi odpowiadać liczbie wartości');
                return;
            }

            console.log(columnsString, ...values, id);

            connection.query('UPDATE `' + this.tableName + '` SET ' + columnsString +' WHERE `id`=? AND `aktywny` = \'on\'', [...values, id], (err, results, fields) => {
                if(err) {
                    reject(err);
                    return;
                }

                console.log(results);

                if(!results.affectedRows > 0) {
                    reject(this.findByIdEmpty);
                    return;
                }

                resolve(results[0]);
                return;
            });
        });
    }

}

module.exports = new CompanyService('sl_klientow');