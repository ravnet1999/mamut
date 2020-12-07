const Service = require('../Service');
const connection = require('../../mysql/connection');
const charset = require('../../helpers/charset');

class TaskStampService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taki stempel nie istnieje!';
    }

    stamp = (stampName, taskId, operatorId, description = '') => {
        let stampDetails = {
            description: description
        }

        stampDetails = charset.translateOut(stampDetails);

        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `zgloszenia_stemple` ( `godzina` , `nazwa` , `id_zgloszenia` , `id_informatyka`, `opis` ) VALUES (NOW(), ?, ?, ?, ?)', [stampName, taskId, operatorId, stampDetails.description], (err, results, fields) => {
                if(err) {
                    reject(err);
                    return;     
                }

                resolve(results);
                return;
            });
        });
    }

    stampsForTasks = (taskIds) => {
        return this.find(99999999, 0, 'id', 'DESC', '`id_zgloszenia` IN (' + taskIds.join(',') + ')');
    }

    stampsForTask = (taskId, limit = 999999) => {
        return new Promise((resolve, reject) => {
            this.find(limit, 0, 'id', 'DESC', '`id_zgloszenia` = \'' + taskId + '\'').then((taskStamps) => {
                taskStamps = taskStamps.map((taskStamp) => {
                    return charset.translateIn(taskStamp);
                });
                resolve(taskStamps);
                return;
            }).catch((err) => {
                reject(err);
                return;
            });
        });
    }
}

module.exports = new TaskStampService('zgloszenia_stemple');