const Service = require('./Service');
const connection = require('../mysql/connection');
const charset = require('../helpers/charset');

class AppendixService extends Service {
    static appendicesTagTypeName = "załączniki do zgłoszeń";

    constructor(tableName) {
        super(tableName);
    
        this.tagsTableName = 'tagi';
        this.tagTypesTableName = 'tagi_typy';
        this.appendicesTagsTableName = 'zgloszenia_zalaczniki_tagi';

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
        connection.query('SELECT ' + this.tableName + '.*, GROUP_CONCAT(CONCAT(' + this.tagsTableName + '.id, ";", ' + this.tagsTableName + '.nazwa)) tagi ' +
        'FROM ' + this.tableName + ', ' + this.tagsTableName + ', ' + this.tagTypesTableName + ', ' + this.appendicesTagsTableName + ' ' +
        'WHERE id_zgloszenia=? ' +
        'AND ' + this.appendicesTagsTableName + '.id_obiektu=' + this.tableName + '.id ' + 
        'AND ' + this.appendicesTagsTableName + '.id_tagu=tagi.id ' +
        'AND ' + this.tagTypesTableName + '.nazwa=? ' +
        'AND ' + this.tagsTableName + '.id_typu=' + this.tagTypesTableName + '.id ' + 
        'GROUP BY ' + this.tableName + '.id ' + 
        'ORDER BY nazwa_oryginalna'
        , [taskId, AppendixService.appendicesTagTypeName], (err, results, fields) => {
            if(err) {            
              reject(err);
              return;
            }

            for(let result of results) {              
              let tags = result.tagi.split(',');              

              let tagi = {};

              for(let tag of tags) {
                tag = tag.split(';');
                tagi[tag[0]] = tag[1];
              }

              result.tagi = tagi;
            }
            
            resolve(charset.translateOut(results));
            return;
        });
      });
    }
}

module.exports = new AppendixService('zgloszenia_zalaczniki');