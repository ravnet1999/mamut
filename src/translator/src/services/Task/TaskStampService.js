const Service = require('../Service');
const connection = require('../../mysql/connection');

class TaskStampService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taki stempel nie istnieje!';
    }

    stamp = (stampName, taskId, operatorId, description = '') => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `zgloszenia_stemple` ( `godzina` , `nazwa` , `id_zgloszenia` , `id_informatyka`, `opis` ) VALUES (NOW(), ?, ?, ?, ?)', [stampName, taskId, operatorId, description], (err, results, fields) => {
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

module.exports = new TaskStampService('zgloszenia_stemple');