const Service = require('./Service');

class DepartmentService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taka komórka nie istnieje!';
    }
}

module.exports = new DepartmentService('sl_komorek');