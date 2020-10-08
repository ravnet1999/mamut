const mongodb = require('mongoose');

let automationSchema = new mongodb.Schema({
    automationEnabled: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

module.exports = automationSchema;