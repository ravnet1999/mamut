const Service = require('./Service');

class DepartmentService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taki priorytet nie istnieje!';
    }
}

module.exports = new DepartmentService('sl_priorytety');