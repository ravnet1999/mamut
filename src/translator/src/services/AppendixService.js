const Service = require('./Service');
const connection = require('../mysql/connection');

class AppendixService extends Service {
    static appendicesTagTypeName = "załączniki do zgłoszeń";

    constructor(tableName) {
        super(tableName);
    
        this.tagsTableName = 'tagi';
        this.tagTypesTableName = 'tagi_typy';
        this.appendicesTagsTableName = 'obiekty_tagi';
        this.appendicesOperationsTableName = 'zgloszenia_zalaczniki_operacje';
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
        connection.query('INSERT INTO `' + this.tableName + '`(id_zgloszenia, nazwa, nazwa_oryginalna, sciezka, rozmiar, typ_mime, wymiary, kompresja, skalowanie, archiwizacja, godzina) VALUES (?,?,?,?,?,?,?,?,?,?,NOW())', 
          [taskId, file.filename, file.originalFilename, file.path, parseInt(file.size), file.contentType, file.dimensions, file.compressed, file.resized, file.archived], (err, results, fields) => {
            if(err) { 
              console.log(err);           
              reject(err);
              return;
            }

            let taskAppendixId = results.insertId;
            
            resolve(taskAppendixId);
            return;
        });
      });
    }

    createOperation = (taskAppendixId, operation) => {
      return new Promise((resolve, reject) => {
          connection.query('INSERT INTO `' + this.appendicesOperationsTableName + '`(id_zalacznika, id_typu_operacji, godzina, nazwa, sciezka, rozmiar, argumenty, wymiary, konfiguracja, zmienne_czasu_wykonania) VALUES (?,?,NOW(),?,?,?,?,?,?,?)', 
          [taskAppendixId, operation.typeId, operation.filename, operation.filePath, operation.fileSize, JSON.stringify(operation.args), JSON.stringify(operation.dimensions), JSON.stringify(operation.configuration), JSON.stringify(operation.runtimeVars)], (err, results, fields) => {
            if(err) {   
              console.log(err);         
              reject(err);
              return;
            }

            let operationId = results.insertId;
            
            resolve(operationId);
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
      let tagsQuery = `(SELECT ${this.tableName}.id,
        GROUP_CONCAT(CONCAT(${this.tagsTableName}.id, ";",${this.tagsTableName}.nazwa)) ${this.tagsTableName}
        FROM ${this.tableName}
        LEFT JOIN ${this.appendicesTagsTableName} ON ${this.tableName}.id=obiekty_${this.tagsTableName}.id_obiektu
        LEFT JOIN ${this.tagsTableName} ON obiekty_${this.tagsTableName}.id_tagu=${this.tagsTableName}.id
        LEFT JOIN ${this.tagTypesTableName} ON ${this.tagsTableName}.id_typu=${this.tagTypesTableName}.id
        GROUP BY ${this.tableName}.id) ${this.tagsTableName}`;

      let operationCondition = (operationTypeId) => {
        return `
          FROM ${this.tableName} AS ${this.tableName}${operationTypeId}
          LEFT JOIN ${this.appendicesOperationsTableName}
          ON ${this.tableName}${operationTypeId}.id=${this.appendicesOperationsTableName}.id_zalacznika
          JOIN ${this.appendicesOperationTypesTableName}
          ON ${this.appendicesOperationsTableName}.id_typu_operacji=${this.appendicesOperationTypesTableName}.id
          AND ${this.appendicesOperationTypesTableName}.id_rodzaju_operacji=${operationTypeId}
          GROUP BY ${this.tableName}${operationTypeId}.id, ${this.appendicesOperationsTableName}.id`;
      }

      let compressionCondition = operationCondition(1);
      let archivisationCondition = operationCondition(2);
      let scaleCondition = operationCondition(3);

      let sql = `
      SELECT 
        ${this.tableName}.*, 
        JSON_EXTRACT(${this.tableName}.wymiary, "$.height") AS wysokosc,
        JSON_EXTRACT(${this.tableName}.wymiary, "$.width") AS szerokosc,
        ${this.tagsTableName}.tagi,        
        kompresja_sciezka,
        kompresja_rozmiar,
        kompresja_typ_mime,
        kompresja_jakosc,
        kompresja_szerokosc,
        kompresja_wysokosc,
        kompresja_czas_wykonania,
        skalowanie_sciezka,
        skalowanie_rozmiar,
        skalowanie_typ_mime,
        skalowanie_szerokosc,
        skalowanie_wysokosc,
        skalowanie_konfiguracja_szerokosc,
        skalowanie_konfiguracja_wysokosc,
        skalowanie_wyliczona_skala,
        skalowanie_czas_wykonania,
        archiwizacja_sciezka,
        archiwizacja_rozmiar,
        archiwizacja_typ_mime,
        archiwizacja_typ_zawartosci,
        archiwizacja_typ,
        archiwizacja_czas_wykonania,
        coalesce(kompresja_czas_wykonania, 0) + coalesce(skalowanie_czas_wykonania,0) + coalesce(archiwizacja_czas_wykonania, 0) AS czas_wykonania
      FROM ${this.tableName} 
      LEFT JOIN ${tagsQuery}
      ON ${this.tagsTableName}.id=${this.tableName}.id
      LEFT JOIN
        (SELECT
          ${this.tableName}1.id,
          ${this.appendicesOperationTypesTableName}.id_rodzaju_operacji,
          ${this.appendicesOperationsTableName}.sciezka AS kompresja_sciezka,
          ${this.appendicesOperationsTableName}.rozmiar AS kompresja_rozmiar,
          ${this.appendicesOperationTypesTableName}.typ_mime AS kompresja_typ_mime,          
          JSON_EXTRACT(${this.appendicesOperationsTableName}.wymiary, "$.height") AS kompresja_wysokosc,
          JSON_EXTRACT(${this.appendicesOperationsTableName}.wymiary, "$.width") AS kompresja_szerokosc,
          JSON_EXTRACT(${this.appendicesOperationsTableName}.konfiguracja, "$.quality") AS kompresja_jakosc,
          JSON_EXTRACT(${this.appendicesOperationsTableName}.zmienne_czasu_wykonania, "$.timeElapsed") AS kompresja_czas_wykonania
          ${compressionCondition}) kompresja
      ON kompresja.id=${this.tableName}.id 
      LEFT JOIN
        (SELECT
          ${this.tableName}3.id,
          ${this.appendicesOperationTypesTableName}.id_rodzaju_operacji,
          ${this.appendicesOperationsTableName}.sciezka AS skalowanie_sciezka,
          ${this.appendicesOperationsTableName}.rozmiar AS skalowanie_rozmiar,
          ${this.appendicesOperationTypesTableName}.typ_mime AS skalowanie_typ_mime,          
          JSON_EXTRACT(${this.appendicesOperationsTableName}.wymiary, "$.width") AS skalowanie_szerokosc,
          JSON_EXTRACT(${this.appendicesOperationsTableName}.wymiary, "$.height") AS skalowanie_wysokosc,
          JSON_EXTRACT(${this.appendicesOperationsTableName}.konfiguracja, "$.height") AS skalowanie_konfiguracja_wysokosc,
          JSON_EXTRACT(${this.appendicesOperationsTableName}.konfiguracja, "$.width") AS skalowanie_konfiguracja_szerokosc,
          JSON_EXTRACT(${this.appendicesOperationsTableName}.zmienne_czasu_wykonania, "$.scale") AS skalowanie_wyliczona_skala,
          JSON_EXTRACT(${this.appendicesOperationsTableName}.zmienne_czasu_wykonania, "$.timeElapsed") AS skalowanie_czas_wykonania
          ${scaleCondition}) skalowanie
      ON skalowanie.id=${this.tableName}.id    
      LEFT JOIN
        (SELECT
          ${this.tableName}2.id,
          ${this.appendicesOperationTypesTableName}.id_rodzaju_operacji,
          ${this.appendicesOperationsTableName}.sciezka AS archiwizacja_sciezka,
          ${this.appendicesOperationsTableName}.rozmiar AS archiwizacja_rozmiar,
          ${this.appendicesOperationTypesTableName}.typ_mime AS archiwizacja_typ_mime,
          ${this.appendicesOperationTypesTableName}.typ_zawartosci AS archiwizacja_typ_zawartosci,
          ${this.appendicesOperationTypesTableName}.nazwa AS archiwizacja_typ,
          JSON_EXTRACT(${this.appendicesOperationsTableName}.zmienne_czasu_wykonania, "$.timeElapsed") AS archiwizacja_czas_wykonania
          ${archivisationCondition}) archiwizacja
      ON archiwizacja.id=${this.tableName}.id
      HAVING ${condition}
      ORDER BY ${this.tableName}.id DESC;`;

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
      console.log('DELETE FROM ' + this.tagsTableName + ' WHERE ${tagsTableName}.id IN ' + 
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

            // connection.query('DELETE FROM ' + this.tagsTableName + ' WHERE ${tagsTableName}.id_typu IN ' + 
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