const Service = require('./Service');

class ServiceService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taka usługa nie istnieje!';
    }
}

module.exports = new ServiceService('sl_uslugi');