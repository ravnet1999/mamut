const Service = require('../Service');
const connection = require('../../mysql/connection');

class TaskEpisodeService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taki etap nie istnieje!';
    }

    addEpisode = (taskId, targetOperatorId, departmentId) => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `' + this.tableName + '` (id_zgloszenia, id_informatyka, id_komorki) VALUES (?, ?, ?)', [taskId, targetOperatorId, departmentId], (err, results, fields) => {
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

module.exports = new TaskEpisodeService('zgloszenia_etapy');