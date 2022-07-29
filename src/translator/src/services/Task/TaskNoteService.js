const Service = require('../Service');
const connection = require('../../mysql/connection');

class TaskNoteService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taka notatka nie istnieje!';
        this.taskNotesTypesTableName = 'zgloszenia_typy_notatek';
        this.taskNotesNotesTypesTableName = 'zgloszenia_notatki_typy_notatek';
    }

    create = (taskId, note) => {      
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO `' + this.tableName + '`(id_zgloszenia, tresc) VALUES (?,?)', 
          [taskId, note.tresc], (err, results, fields) => {
            if(err) { 
              console.log(err);           
              reject(err);
              return;
            }

            note.id = results.insertId;            
            resolve([note]);
            return;
        });
      });
    }

    findById = (noteId) => {
      return this.findQuery(`${this.tableName}.id IN (?)`, [noteId]);
    }

    findByTaskId = (taskId) => {
      return this.findQuery(`${this.tableName}.id_zgloszenia=? `,[taskId]);
    }

    findByNoteTypeId = (noteTypeId) => {
      return this.findQuery(`${this.tableName}.id_typu_notatki=? `, [noteTypeId]);
    }

    findByTaskIdNoteTypeId = (taskId, noteTypeId) => {
      return this.findQuery(`${this.tableName}.id_zgloszenia=? AND ${this.tableName}.id_typu_notatki=? `, [taskId, noteTypeId]);
    }

    findQuery = (condition, parameters) => {
      let sql = "SELECT "+
      this.tableName + ".*, " + 
      'GROUP_CONCAT(CONCAT(' + this.taskNotesTypesTableName + '.id, ";",' + this.taskNotesTypesTableName + ".nazwa)) AS typy " + 
      "FROM " + this.tableName + ", " + this.taskNotesTypesTableName + ",  " + this.taskNotesNotesTypesTableName + " " +
      "WHERE " + this.taskNotesNotesTypesTableName + ".id_notatki=" + this.tableName + ".id "+ 
      "AND " + this.taskNotesNotesTypesTableName + ".id_typu_notatki=" + this.taskNotesTypesTableName + ".id " + 
      "AND " + condition + " " +
      "GROUP BY " + this.tableName + ".id ";
      "ORDER BY " + this.tableName + ".id DESC;";

      console.log(sql);

      return new Promise((resolve, reject) => { 
        connection.query(sql, parameters, (err, results, fields) => {
          console.log(results);

          if(err) {            
            reject(err);
            return;
          }
          
          resolve(results);
          return;
        });
      });      
    }

    findTypes = () => {
      let sql = "SELECT * FROM " + this.taskNotesTypesTableName + " " + 
      "ORDER BY " + this.taskNotesTypesTableName + ".id;";

      console.log(sql);

      return new Promise((resolve, reject) => { 
        connection.query(sql, [], (err, results, fields) => {
          console.log(results);

          if(err) {            
            reject(err);
            return;
          }
          
          resolve(results);
          return;
        });
      });   
    }

    update = (noteId, note) => {      
      return new Promise((resolve, reject) => {
        connection.query('UPDATE `' + this.tableName + '`set tresc=? WHERE id=?', 
          [note.tresc, noteId], (err, results, fields) => {
            if(err) { 
              console.log(err);           
              reject(err);
              return;
            }
            
            resolve([note]);
            return;
        });
      });
    }

    delete = (noteIds) => {
      let sql = "DELETE FROM " + this.tableName + " " + 
      "WHERE id IN (?);";

      console.log(sql);

      return new Promise((resolve, reject) => { 
        connection.query(sql, [noteIds], (err, results, fields) => {
          console.log(results);

          if(err) {            
            reject(err);
            return;
          }

          resolve(results.affectedRows);
        });
      });   
    }
}

module.exports = new TaskNoteService('zgloszenia_notatki');