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

    getLastStamps = (tasks) => {
        return new Promise((resolve, reject) => {
            let taskIds = tasks.map((task) => {
                return task.id;
            });

            this.stampsForTasks(taskIds).then((taskStamps) => {
                let tasksWithStamps = tasks.map((task) => {
                    let stampsForTask = taskStamps.filter((taskStamp) => {
                        return taskStamp.id_zgloszenia == task.id;
                    });

                    task.lastStamp = stampsForTask[0];
    
                    return task;
                })
    
                resolve(tasksWithStamps);
                return;
            }).catch((err) => {
                reject(err);
                return;
            });
        });
    }

    stampsForTasks = (taskIds) => {
        return new Promise((resolve, reject) => {
            let joinedTaskIds = taskIds.join(',');

            this.find(999999, 0, 'id', 'DESC', '`id_zgloszenia` IN (' + joinedTaskIds + ')').then((taskStamps) => {
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