const Service = require('../Service');
const connection = require('../../mysql/connection');

class TaskClosureService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Takie zamknięcie nie istnieje!';
    }
}

module.exports = new TaskClosureService('zgloszenia_zamkniecie');