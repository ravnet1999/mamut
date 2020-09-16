
const mongodb = require('mongoose');
const companyRepresentativeSchema = require('./CompanyRepresentativeSchema');

let companyEmailSchema = new mongodb.Schema({
    companyId: {
        type: Number,
        default: null
    },
    companyName: {
        type: String,
        default: null
    },
    companyNameLowerCase: {
        type: String,
        default: null
    },
    selectedRep: {
        type: Number,
        default: null
    },
    companyRepresentatives: [companyRepresentativeSchema],
    domains: [String]
},{
    timestamps: true
});

module.exports = companyEmailSchema;