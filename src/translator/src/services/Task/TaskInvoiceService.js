const Service = require('../Service');

class TaskInvoiceService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taki wpis rozliczenia nie istnieje!';
    }
}

module.exports = new TaskInvoiceService('zgloszenia_rozliczenie');