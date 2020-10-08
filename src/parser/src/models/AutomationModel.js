const mongodb = require('mongoose');
const automationSchema = require('../schemas/AutomationSchema');

module.exports = mongodb.model('Automation', automationSchema);