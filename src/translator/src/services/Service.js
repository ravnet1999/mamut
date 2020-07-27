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

    findById = (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `' + this.tableName + '` WHERE `id`=?', [id], (err, results, fields) => {
                if(err) {
                    reject(err);
                    return;
                }

                if(!results[0]) {
                    reject(this.findByIdEmpty);
                    return;
                }

                resolve(results[0]);
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

            connection.query('UPDATE `' + this.tableName + '` SET ' + columnsString +' WHERE `id`=?', [...values, id], (err, results, fields) => {
                if(err) {
                    reject(err);
                    return;
                }

                if(!results[0]) {
                    reject(this.findByIdEmpty);
                    return;
                }

                resolve(results[0]);
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