const Service = require('./Service');

class ChannelService extends Service {
    constructor(tableName) {
        super(tableName);
        this.findByIdEmpty = 'Taki kanał nie istnieje!';
    }
}

module.exports = new ChannelService('sl_kanaly');