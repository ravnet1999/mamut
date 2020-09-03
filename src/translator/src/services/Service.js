const connection = require('../mysql/connection');

class Service {
    constructor(tableName) {
        this.tableName = tableName;
        this.findByIdEmpty = '';
    }

    find = (limit = 25, offset = 0, orderColumn = null, orderWay = 'DESC', where = '') => {
        let orderBy = 'ORDER BY `id` ' + orderWay;

        if(orderColumn) {
            orderBy = 'ORDER BY `' + orderColumn + '` ' + orderWay;
        }

        if(where) {
            where = 'WHERE ' + where;
        }

        console.log('SELECT * FROM `' + this.tableName + '` ' + where + ' ' + orderBy + ' LIMIT ? OFFSET ?');

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `' + this.tableName + '` ' + where + ' ' + orderBy + ' LIMIT ? OFFSET ?', [Number(limit), Number(offset)], (err, results, fields) => {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(results);
                return;
            });
        });
    }

    findById = (ids) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `' + this.tableName + '` WHERE `id` IN (?)', [ids], (err, results, fields) => {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(results);
                return;
            });
        });
    }

    updateById = (id, columns, values) => {
        return new Promise((resolve, reject) => {
            let columnsString = this.parseColumnsForUpdate(columns);

            if(columns.length != values.length) {
                reject('Liczba kolumn musi odpowiadać liczbie wartości');
                return;
            }

            console.log(columnsString, ...values, id);

            connection.query('UPDATE `' + this.tableName + '` SET ' + columnsString +' WHERE `id`=?', [...values, id], (err, results, fields) => {
                if(err) {
                    reject(err);
                    return;
                }

                console.log(results);

                if(!results.affectedRows > 0) {
                    reject(this.findByIdEmpty);
                    return;
                }

                resolve(results[0]);
                return;
            });
        });
    }

    query = (query, values) => {
        return new Promise((resolve, reject) => {
            connection.query(query, values, (err, results, fields) => {
                if(err) {
                    reject('Coś poszło nie tak podczas wykonywania zapytania do bazy danych.');
                    return;
                }

                resolve(results);
                return;
            });
        });
    }

    parseColumnsForUpdate = (columns) => {
        let columnsFormatted = columns.map((column, index) => {
            return '`' + column + '`=?' + (index < (columns.length - 1) ? ', ' : '');
        });

        return columnsFormatted.join('');
    }
}

module.exports = Service;