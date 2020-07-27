const Service = require('./Service');

class RequestCategoryService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taka kategoria zapytania nie istnieje!';
    }
}

module.exports = new RequestCategoryService('sl_kat_zapytanie');