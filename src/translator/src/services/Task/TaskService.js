const Service = require('../Service');
const connection = require('../../mysql/connection');

class TaskService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Takie zadanie nie istnieje!';
    }
}

module.exports = new TaskService('zgloszenia_glowne');