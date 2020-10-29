const Service = require('./Service');

class ChangeHistoryService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taki wpis historii zmian nie istnieje!';
    }
}

module.exports = new ChangeHistoryService('historia_zmian');