const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const Automation = require('../src/models/AutomationModel');
const readEmailsAutomation = require('../automation/readEmails');
const insertEmailsAutomation = require('../automation/insertEmails');

let automations = [
    readEmailsAutomation,
    insertEmailsAutomation
];

intervals = [];

const stopAutomations = () => {
    intervals.map((interval) => {
        clearInterval(interval);
    });
    intervals = [];
}

const startAutomations = () => {
    stopAutomations();
    intervals = automations.map((automation) => {
        return setInterval(automation.method, automation.interval);
    });    
}

/* GET home page. */
router.get('/', [authMiddleware], function(req, res, next) {
    let automationStatus = {
        automationEnabled: intervals.length > 0
    };
    response(res, false, ['Pomyślnie pobrano status automatyzacji.'], [automationStatus]);
});

router.post('/enable', [authMiddleware], function(req, res, next) {
    Automation.updateOne({}, { automationEnabled: true }, { upsert: true }).then((status) => {
        startAutomations();
        response(res, false, ['Pomyślnie uruchomiono automatyzację'], [status]);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas próby uruchomienia automatyzacji.', JSON.stringify(err)], []);
        return;
    })
});

router.post('/disable', [authMiddleware], function(req, res, next) {
    Automation.updateOne({}, { automationEnabled: false }, { upsert: true }).then((status) => {
        stopAutomations();
        response(res, false, ['Pomyślnie wyłączono automatyzację'], [status]);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas próby wyłączenia automatyzacji.', JSON.stringify(err)], []);
        return;
    })
});

module.exports = router;
