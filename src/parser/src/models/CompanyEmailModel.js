const mongodb = require('mongoose');
const companyEmailSchema = require('../schemas/CompanyEmailSchema');

module.exports = mongodb.model('CompanyEmail', companyEmailSchema);