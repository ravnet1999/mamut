
const mongodb = require('mongoose');

let companyEmailSchema = new mongodb.Schema({
    companyId: {
        type: Number,
        default: null
    },
    companyName: {
        type: String,
        default: null
    },
    domains: [String]
},{
    timestamps: true
});

module.exports = companyEmailSchema;