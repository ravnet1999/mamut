const Service = require('./Service');
const connection = require('../mysql/connection');
const charset = require('../helpers/charset');

class AppendixService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taki załącznik nie istnieje!';
    }

    translateAppendixOut = file => {
      for(let key in file) {
        file[key] = file[key][0];
      }
      charset.translateOut(file);
    }

    create = (taskId, file) => {
      this.translateAppendixOut(file)

      return new Promise((resolve, reject) => {
        // connection.query('INSERT INTO `' + this.tableName + '`(id_zgloszenia, nazwa, nazwa_oryginalna, sciezka, rozmiar, typ_mime, zawartosc) VALUES (?,?,?,?,?,?,?)', 
        // [taskId, file.filename[0], file.originalFilename[0], file.path[0], parseInt(file.size[0]), file.contentType[0], file.data[0]], (err, results, fields) => {
        connection.query('INSERT INTO `' + this.tableName + '`(id_zgloszenia, nazwa, nazwa_oryginalna, sciezka, rozmiar, typ_mime, godzina) VALUES (?,?,?,?,?,?,NOW())', 
          [taskId, file.filename, file.originalFilename, file.path, parseInt(file.size), file.contentType], (err, results, fields) => {
            if(err) {            
              reject(err);
              return;
            }
            
            resolve(results.insertId);
            return;
        });
      });
    }

    delete = (appendixId) => {
      return new Promise((resolve, reject) => {
        connection.query('DELETE FROM `' + this.tableName + '` WHERE id=?', 
          [appendixId], (err, results, fields) => {
            if(err) {            
              reject(err);
              return;
            }

            if(results.affectedRows == 0) {
              reject('Nie ma takiego załącznika.');
              return;
            }
            
            resolve();
            return;
        });
      });
    }

    findByTaskId = (taskId) => {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM `' + this.tableName + '` WHERE id_zgloszenia=? ORDER BY nazwa_oryginalna', 
          [taskId], (err, results, fields) => {
            if(err) {            
              reject(err);
              return;
            }
            
            resolve(charset.translateOut(results));
            return;
        });
      });
    }
}

module.exports = new AppendixService('zgloszenia_zalaczniki');