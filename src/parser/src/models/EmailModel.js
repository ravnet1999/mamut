const mongodb = require('mongoose');
const emailSchema = require('../schemas/EmailSchema');

module.exports = mongodb.model('Email', emailSchema);