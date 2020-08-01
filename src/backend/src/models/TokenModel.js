const mongodb = require('mongoose');
const tokenSchema = require('../schemas/TokenSchema');

module.exports = mongodb.model('Token', tokenSchema);