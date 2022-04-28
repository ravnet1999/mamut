const Service = require('./Service');
const connection = require('../mysql/connection');

class TagService extends Service {
    static appendicesTagTypeName = "załączniki do zgłoszeń";

    constructor(tableName) {
        super(tableName);
    
        this.tagTypesTableName = 'tagi_typy';

        this.findByIdEmpty = 'Taki załącznik nie istnieje!';
    }

    get = (typeId) => {
      return new Promise((resolve, reject) => {
        connection.query('SELECT `' + this.tableName + '`.* FROM `' + this.tableName + '`, `' + this.tagTypesTableName + '` ' +
        'WHERE `' + this.tableName + '`.id_typu=`' + this.tagTypesTableName + '`.id '+
        'AND `' + this.tagTypesTableName + '`.id=?;',
        [typeId], (err, results, fields) => {
            if(err) {            
              reject(err);
              return;
            }

            console.log(results);
            
            resolve(results);
            return;
        });
      });
    }

    search = (typeId, query) => {
      return new Promise((resolve, reject) => {
        connection.query('SELECT `' + this.tableName + '`.* FROM `' + this.tableName + '`, `' + this.tagTypesTableName + '` ' +
        'WHERE `' + this.tableName + '`.id_typu=`' + this.tagTypesTableName + '`.id '+
        'AND `' + this.tagTypesTableName + '`.id=? ' +
        'AND `' + this.tableName + '`.nazwa LIKE ?;',
        [typeId, '%' + query + '%'], (err, results, fields) => {
            if(err) {            
              reject(err);
              return;
            }

            console.log(results);
            
            resolve(results);
            return;
        });
      });
    }
}

module.exports = new TagService('tagi');