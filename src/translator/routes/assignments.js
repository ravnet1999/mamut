const express = require('express');
const router = express.Router();
const query = require('../src/mysql/query');
const response = require('../src/response');
const assignmentService = require('../src/services/AssignmentService');
const userService = require('../src/services/UserService');

router.get('/:operatorId', (req, res, next) => {
    console.log(req.params.operatorId);
    assignmentService.findByOperatorId(req.params.operatorId).then((assignment) => {
        assignment.klient = assignment.klient.split(',').map((client) => { return Number(client) });
        response(res, false, ['Pomyślnie pobrano kompetencje.'], [assignment]);
        return;
    }).catch((err) => {
        response(res, true, ['Coś poszło nie tak podczas próby pobrania kompetencji.', JSON.stringify(err)], []);
        return;
    });
});

router.get('/:clientId/representatives', (req, res, next) => {
    userService.findByClientId(req.params.clientId).then((clients) => {
        response(res, false, ['Pomyślnie pobrano reprezentantów klienta.'], clients);
        return;
    }).catch((err) => {
        response(res, false, ['Coś poszło nie tak podczas próby pobrania reprezentantów klienta.', JSON.stringify(err)], []);
        return;
    });
});

module.exports = router;