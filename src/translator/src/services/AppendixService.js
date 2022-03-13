const Service = require('./Service');
const connection = require('../mysql/connection');

class AppendixService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taki załącznik nie istnieje!';
    }

    create = (taskId, file) => {
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO `' + this.tableName + '`(id_zgloszenia, nazwa, nazwa_oryginalna, sciezka, rozmiar, typ_mime, zawartosc) VALUES (?,?,?,?,?,?,?)', 
          [taskId, file.filename[0], file.originalFilename[0], file.path[0], parseInt(file.size[0]), file.contentType[0], file.data[0]], (err, results, fields) => {
            if(err) {            
              reject(err);
              return;
            }
            
            resolve(results.insertId);
            return;
        });
      });
    }
}

module.exports = new AppendixService('zgloszenia_zalaczniki');