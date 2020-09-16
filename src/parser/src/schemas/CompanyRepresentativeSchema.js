
const mongodb = require('mongoose');

let companyRepresentativeSchema = new mongodb.Schema({
    repId: {
        type: Number,
        default: null
    },
    name: {
        type: String,
        default: null
    }
});

module.exports = companyRepresentativeSchema;