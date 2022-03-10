const Service = require('./Service');

class AppendixService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taki załącznik nie istnieje!';
    }

    create = (taskId, file) => {
      return new Promise((resolve, reject) => {
        // resolve(`Super. Teraz wystarczy zapisać w bazie danych załącznik dla zadania ${taskId} zapisany w backendzie w ${file.path}.`);
        resolve(`Super. Teraz wystarczy zapisać w bazie danych załącznik dla zadania ${taskId}.`);
        return;
        // connection.query('SELECT * FROM `' + this.tableName + '` WHERE `id_klienta` IN (?) AND `aktywny`=\'on\'', [clientIds], (err, results, fields) => {
        //     if(err) {
        //         reject(err);
        //         return;
        //     }

        //     resolve(results);
        //     return;
        // });
      });
    }
}

module.exports = new AppendixService('appendices');