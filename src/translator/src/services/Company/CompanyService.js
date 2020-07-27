const Service = require('../Service');

class CompanyService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taka firma nie istnieje!';
    }
}

module.exports = new CompanyService('sl_klientow');