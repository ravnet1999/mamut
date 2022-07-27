const Service = require('../Service');
const connection = require('../../mysql/connection');

class TaskNoteService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taka notatka nie istnieje!';
        this.taskNotesTypesTableName = 'zgloszenia_typy_notatek';
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
      this.tableName + ".*, " + this.taskNotesTypesTableName + ".nazwa AS typ " + 
      "FROM " + this.tableName + ", " + this.taskNotesTypesTableName + " " + 
      "WHERE " + this.tableName + ".id_typu_notatki=" + this.taskNotesTypesTableName + ".id "+ 
      "AND " + condition + " " +
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
}

module.exports = new TaskNoteService('zgloszenia_notatki');