const Service = require('./Service');
const connection = require('../mysql/connection');
const charset = require('../helpers/charset');

class AppendixService extends Service {
    static appendicesTagTypeName = "załączniki do zgłoszeń";

    constructor(tableName) {
        super(tableName);
    
        this.tagsTableName = 'tagi';
        this.tagTypesTableName = 'tagi_typy';
        this.appendicesTagsTableName = 'obiekty_tagi';

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
        let sql = 'SELECT ' + this.tableName + '.*, GROUP_CONCAT(CONCAT(' + this.tagsTableName + '.id, ";",' + this.tagsTableName + '.nazwa)) tagi ' +
        'FROM ' + this.tableName + ' ' +  
        'LEFT JOIN ' + this.appendicesTagsTableName + ' ' + 
        'ON ' + this.appendicesTagsTableName + '.id_obiektu=' + this.tableName + '.id ' + 
        'AND ' + this.tableName + '.id_zgloszenia=?' + ' ' + 
        'LEFT JOIN ' + this.tagsTableName + ' ON ' + this.appendicesTagsTableName + '.id_tagu = tagi.id ' +  
        'LEFT JOIN ' + this.tagTypesTableName + ' ' + 
        'ON ' + this.tagsTableName + '.id_typu=' + this.tagTypesTableName + '.id ' + 
        'AND ' + this.tagTypesTableName + '.nazwa=?' + ' ' +
        'GROUP BY ' + this.tableName + '.id ' +  
        'ORDER BY id';
        
        connection.query(sql, [taskId, AppendixService.appendicesTagTypeName], (err, results, fields) => {
          console.log(results);

            if(err) {            
              reject(err);
              return;
            }

            for(let result of results) {    
              if(result.tagi) {          
                let tags = result.tagi.split(',');              

                let tagi = {};

                for(let tag of tags) {
                  tag = tag.split(';');
                  tagi[tag[0]] = tag[1];
                }

                result.tagi = tagi;
              }
            }
            
            resolve(charset.translateOut(results));
            return;
        });
      });
    }

    findByIdWithAppendices = (appendixId) => {
      return new Promise((resolve, reject) => {  
        let sql = 'SELECT ' + this.tableName + '.*, GROUP_CONCAT(CONCAT(' + this.tagsTableName + '.id, ";",' + this.tagsTableName + '.nazwa)) tagi ' +
        'FROM ' + this.tableName + ' ' +  
        'JOIN ' + this.appendicesTagsTableName + ' ' +
        'ON ' + this.tableName + '.id=?' + ' ' + 
        'AND ' + this.tableName + '.id=' + this.appendicesTagsTableName + '.id_obiektu ' +
        'LEFT JOIN ' + this.tagsTableName + ' ON ' + this.appendicesTagsTableName + '.id_tagu = tagi.id ' +  
        'LEFT JOIN ' + this.tagTypesTableName + ' ' + 
        'ON ' + this.tagsTableName + '.id_typu=' + this.tagTypesTableName + '.id ' + 
        'AND ' + this.tagTypesTableName + '.nazwa=?' + ' ' +
        'GROUP BY ' + this.tableName + '.id ' +  
        'ORDER BY id';
        
        connection.query(sql, [appendixId, AppendixService.appendicesTagTypeName], (err, results, fields) => {
          console.log(results);

            if(err) {            
              reject(err);
              return;
            }

            for(let result of results) {    
              if(result.tagi) {          
                let tags = result.tagi.split(',');              

                let tagi = {};

                for(let tag of tags) {
                  tag = tag.split(';');
                  tagi[tag[0]] = tag[1];
                }

                result.tagi = tagi;
              }
            }
            
            resolve(charset.translateOut(results));
            return;
        });
      });
    }

    deleteTag = (appendixId, tagId) => {
      console.log('DELETE FROM ' + this.tagsTableName + ' WHERE tagi.id IN ' + 
      '(SELECT ' + this.tagsTableName + '.id_typu FROM ' + this.tagTypesTableName + ' ' + 
      'WHERE ' + this.tagTypesTableName + '.nazwa=?) ' +
      'AND ' + this.tagsTableName + '.id NOT IN (SELECT id_tagu FROM ' + this.appendicesTagsTableName + ');');

      return new Promise((resolve, reject) => {
        connection.query('DELETE FROM `' + this.appendicesTagsTableName + '` WHERE id_obiektu=? AND id_tagu=? ' + 
        'AND id_tagu IN (' + 
        'SELECT ' + this.tagsTableName + '.id FROM ' + this.tagTypesTableName + ', ' + this.tagsTableName + ' ' +
        'WHERE ' + this.tagTypesTableName + '.id=' + this.tagsTableName + '.id_typu AND ' + this.tagTypesTableName + '.nazwa=?)', 
          [appendixId, tagId, AppendixService.appendicesTagTypeName], (err, results, fields) => {
            if(err) {            
              reject(err);
              return;
            }

            if(results.affectedRows == 0) {
              reject('Nie ma takiego tagu do załącznika.');
              return;
            }

            resolve();
            return;

            // connection.query('DELETE FROM ' + this.tagsTableName + ' WHERE tagi.id_typu IN ' + 
            // '(SELECT ' + this.tagsTableName + '.id_typu FROM ' + this.tagTypesTableName + ' ' + 
            // 'WHERE ' + this.tagTypesTableName + '.nazwa=?) ' +
            // 'AND ' + this.tagsTableName + '.id NOT IN (SELECT id_tagu FROM ' + this.appendicesTagsTableName + ');',

            // [AppendixService.appendicesTagTypeName], (err, results, fields) => {
            //   if(err) {            
            //     reject(err);
            //     return;
            //   }
            
            //   resolve();
            //   return;
            // });
        });
      });    
    }

    addTags = (appendixId, tagNames) => {
      let SelectTagPromise = tagName =>  new Promise((resolve, reject) => {
        connection.query('SELECT id FROM ' + this.tagsTableName + ' WHERE ' + this.tagsTableName + '.nazwa=?;',
          [tagName], (err, result, fields) => {
            if(err) {            
              reject(err);
              return;
            }

            resolve(result);
            return;
        });
      });

      let InsertTagPromise = tagName =>  new Promise((resolve, reject) => {
        connection.query('INSERT INTO ' + this.tagsTableName + '(nazwa, id_typu) ' + 
        'SELECT ?, id FROM ' + this.tagTypesTableName + ' WHERE ' + this.tagTypesTableName + '.nazwa=?;',
          [tagName, AppendixService.appendicesTagTypeName], (err, result, fields) => {
            if(err) {            
              reject(err);
              return;
            }

            resolve(result);
            return;
        });
      });

      let InsertAppendixTag = (appendixId, tagId) => new Promise((resolve, reject) => {
        connection.query('INSERT INTO ' + this.appendicesTagsTableName + '(id_obiektu,id_tagu) VALUES (?,?);',
            [appendixId, tagId], (err, result, fields) => {
            if(err) {            
              reject(err);
              return;
            }

            resolve(result);
            return;
        });
      });

      let promises = tagNames.map(tagName => new Promise(async (resolve, reject) => { 
        let tagId;

        try {    
          let results = await SelectTagPromise(tagName);
          tagId = results[0].id;
        } catch(err1) {
          try {
            let results = await InsertTagPromise(tagName);
            tagId = results.insertId;
          } catch(err2) {
            reject([err1, err2]);
          }
        } finally { 
          try {
            await InsertAppendixTag(appendixId, tagId);
            resolve({id: tagId, name: tagName});
            return;
          } catch(err) {
            reject(err);
          }
        }
      }));

      return Promise.all(promises);
    }
}

module.exports = new AppendixService('zgloszenia_zalaczniki');