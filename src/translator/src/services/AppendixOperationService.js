const Service = require('./Service');

class AppendixOperationService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taka operacja na załączniku nie istnieje!';
    }
}

module.exports = new AppendixOperationService('zgloszenia_zalaczniki_operacje');