const Service = require('./Service');
const connection = require('../mysql/connection');

class AppendixService extends Service {
    static appendicesTagTypeName = "załączniki do zgłoszeń";

    constructor(tableName) {
        super(tableName);
    
        this.tagsTableName = 'tagi';
        this.tagTypesTableName = 'tagi_typy';
        this.appendicesTagsTableName = 'obiekty_tagi';
        this.appendicesOperationTableName = 'zgloszenia_zalaczniki_operacje';
        this.appendicesOperationKindTableName = 'zgloszenia_zalaczniki_rodzaje_operacji';
        this.appendicesOperationTypesTableName = 'zgloszenia_zalaczniki_typy_operacji';

        this.findByIdEmpty = 'Taki załącznik nie istnieje!';
    }

    create = (taskId, file) => {
      for(let key in file) {
        file[key] = file[key][0];
      }

      return new Promise((resolve, reject) => {
        // connection.query('INSERT INTO `' + this.tableName + '`(id_zgloszenia, nazwa, nazwa_oryginalna, sciezka, rozmiar, typ_mime, zawartosc) VALUES (?,?,?,?,?,?,?)', 
        // [taskId, file.filename[0], file.originalFilename[0], file.path[0], parseInt(file.size[0]), file.contentType[0], file.data[0]], (err, results, fields) => {
        connection.query('INSERT INTO `' + this.tableName + '`(id_zgloszenia, nazwa, nazwa_oryginalna, sciezka, rozmiar, typ_mime, kompresja, archiwizacja, godzina) VALUES (?,?,?,?,?,?,?,?,NOW())', 
          [taskId, file.filename, file.originalFilename, file.path, parseInt(file.size), file.contentType,  file.compressed, file.archived], (err, results, fields) => {
            if(err) { 
              console.log(err);           
              reject(err);
              return;
            }

            let taskAppendixId = results.insertId;

            if(file.compressed == 1 && file.hasOwnProperty("compression")) {
              let compressionData = JSON.parse(file.compression);
              console.log(compressionData);

              connection.query('INSERT INTO `' + this.appendicesOperationTableName + '`(id_zalacznika, id_typu_operacji, godzina, nazwa, sciezka, rozmiar, argumenty, wymiary, parametry) VALUES (?,?,NOW(),?,?,?,?,?,?)', 
                [taskAppendixId, compressionData.typeId, compressionData.filename, compressionData.filePath, parseInt(compressionData.fileSize), JSON.stringify(compressionData.options), JSON.stringify(compressionData.dimensions), JSON.stringify(compressionData.parameters)], (err, results, fields) => {
                  if(err) {   
                    console.log(err);         
                    reject(err);
                    return;
                  }
              });
            }

            if(file.archived == 1 && file.hasOwnProperty("archivisation")) {
              let archivisationData = JSON.parse(file.archivisation);
              console.log(archivisationData);

              connection.query('INSERT INTO `' + this.appendicesOperationTableName + '`(id_zalacznika, id_typu_operacji, godzina, nazwa, sciezka, rozmiar) VALUES (?,?,NOW(),?,?,?)', 
                [taskAppendixId, archivisationData.typeId, archivisationData.filename, archivisationData.filePath, parseInt(archivisationData.fileSize)], (err, results, fields) => {
                  if(err) {   
                    console.log(err);         
                    reject(err);
                    return;
                  }
              });
            }
            
            resolve(taskAppendixId);
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

    findQuery = (condition, parameters) => {
      let tagsQuery = `(SELECT zgloszenia_zalaczniki.id,
        GROUP_CONCAT(CONCAT(tagi.id, ";",tagi.nazwa)) tagi
        FROM zgloszenia_zalaczniki
        LEFT JOIN obiekty_tagi ON zgloszenia_zalaczniki.id=obiekty_tagi.id_obiektu
        LEFT JOIN tagi ON obiekty_tagi.id_tagu=tagi.id
        LEFT JOIN tagi_typy ON tagi.id_typu=tagi_typy.id
        GROUP BY zgloszenia_zalaczniki.id) tagi`;

      let operationCondition = (operationTypeId) => {
        return `
          FROM zgloszenia_zalaczniki AS zgloszenia_zalaczniki2
          LEFT JOIN zgloszenia_zalaczniki_operacje
          ON zgloszenia_zalaczniki2.id=zgloszenia_zalaczniki_operacje.id_zalacznika
          JOIN zgloszenia_zalaczniki_typy_operacji
          ON zgloszenia_zalaczniki_operacje.id_typu_operacji=zgloszenia_zalaczniki_typy_operacji.id
          AND zgloszenia_zalaczniki_typy_operacji.id_rodzaju_operacji=${operationTypeId}
          GROUP BY zgloszenia_zalaczniki2.id, zgloszenia_zalaczniki_operacje.id`;
      }

      let compressionCondition = operationCondition(1);
      let archivisationCondition = operationCondition(2);

      let sql = `
      SELECT 
        zgloszenia_zalaczniki.*, 
        tagi.tagi,        
        kompresja.kompresja_sciezka,
        kompresja.kompresja_rozmiar,
        kompresja.kompresja_typ_mime,
        kompresja.kompresja_jakosc,
        kompresja_szerokosc,
        kompresja_wysokosc,
        kompresja_szerokosc_oryginalna,
        kompresja_wysokosc_oryginalna,
        kompresja_minimalny_wymiar,
        kompresja_maksymalny_wymiar,
        kompresja_wyliczona_skala,
        archiwizacja.archiwizacja_sciezka,
        archiwizacja.archiwizacja_rozmiar,
        archiwizacja.archiwizacja_typ_mime,
        archiwizacja.archiwizacja_typ_zawartosci,
        archiwizacja.archiwizacja_typ
      FROM zgloszenia_zalaczniki 
      LEFT JOIN ${tagsQuery}
      ON tagi.id=zgloszenia_zalaczniki.id
      LEFT JOIN
        (SELECT
          zgloszenia_zalaczniki2.id,
          zgloszenia_zalaczniki_typy_operacji.id_rodzaju_operacji,
          zgloszenia_zalaczniki_operacje.sciezka AS kompresja_sciezka,
          zgloszenia_zalaczniki_operacje.rozmiar AS kompresja_rozmiar,
          zgloszenia_zalaczniki_typy_operacji.typ_mime AS kompresja_typ_mime,          
          JSON_EXTRACT(zgloszenia_zalaczniki_operacje.wymiary, "$.height") AS kompresja_szerokosc,
          JSON_EXTRACT(zgloszenia_zalaczniki_operacje.wymiary, "$.width") AS kompresja_wysokosc,
          JSON_EXTRACT(zgloszenia_zalaczniki_operacje.wymiary, "$.originalHeight") AS kompresja_szerokosc_oryginalna,
          JSON_EXTRACT(zgloszenia_zalaczniki_operacje.wymiary, "$.originalWidth") AS kompresja_wysokosc_oryginalna,
          JSON_EXTRACT(zgloszenia_zalaczniki_operacje.parametry, "$.toFormat.quality") AS kompresja_jakosc,
          JSON_EXTRACT(zgloszenia_zalaczniki_operacje.parametry, "$.resize.minDimension") AS kompresja_minimalny_wymiar,
          JSON_EXTRACT(zgloszenia_zalaczniki_operacje.parametry, "$.resize.maxDimension") AS kompresja_maksymalny_wymiar,
          JSON_EXTRACT(zgloszenia_zalaczniki_operacje.parametry, "$.resize.calculatedRatio") AS kompresja_wyliczona_skala
          ${compressionCondition}) kompresja
      ON kompresja.id=zgloszenia_zalaczniki.id    
      LEFT JOIN
        (SELECT
          zgloszenia_zalaczniki2.id,
          zgloszenia_zalaczniki_typy_operacji.id_rodzaju_operacji,
          zgloszenia_zalaczniki_operacje.sciezka AS archiwizacja_sciezka,
          zgloszenia_zalaczniki_operacje.rozmiar AS archiwizacja_rozmiar,
          zgloszenia_zalaczniki_typy_operacji.typ_mime AS archiwizacja_typ_mime,
          zgloszenia_zalaczniki_typy_operacji.typ_zawartosci AS archiwizacja_typ_zawartosci,
          zgloszenia_zalaczniki_typy_operacji.nazwa AS archiwizacja_typ
          ${archivisationCondition}) archiwizacja
      ON archiwizacja.id=zgloszenia_zalaczniki.id
      HAVING ${condition};`;

      console.log(sql);

      return new Promise((resolve, reject) => { 
        connection.query(sql, parameters, (err, results, fields) => {
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
            
            resolve(results);
            return;
        });
      });      
    }

    findByTaskId = (taskId) => {
      return this.findQuery(`${this.tableName}.id_zgloszenia=?`,[taskId, AppendixService.appendicesTagTypeName]);
    }

    findByIdWithAllData = (appendixId) => {
      return this.findQuery(`${this.tableName}.id=?`, [appendixId, AppendixService.appendicesTagTypeName]);
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
      let InsertTagPromise = tagName =>  new Promise((resolve, reject) => {
        connection.query('INSERT INTO ' + this.tagsTableName + '(nazwa, id_typu) ' + 
        'SELECT ?, id FROM ' + this.tagTypesTableName + ' WHERE ' + this.tagTypesTableName + '.nazwa=? ' + 
        'ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(`' + this.tagsTableName + '`.`id`);',
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
          let results = await InsertTagPromise(tagName);
          tagId = results.insertId;

          await InsertAppendixTag(appendixId, tagId);
          resolve({id: tagId, name: tagName});
          return;
        } catch(err) {
          reject(err);
        } 
      }));

      return Promise.all(promises);
    }
}

module.exports = new AppendixService('zgloszenia_zalaczniki');