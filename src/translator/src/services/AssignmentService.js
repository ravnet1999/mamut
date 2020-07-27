const Service = require('./Service');
const connection = require('../mysql/connection');

class AssignmentService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Takie kompetencje nie istnieją!';
    }

    findByOperatorId = (operatorId) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `' + this.tableName + '` WHERE `informatyk`=?', [operatorId], (err, results, fields) => {
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
}

module.exports = new AssignmentService('informatycy_kompetencje');