const express = require('express');
const router = express.Router();
const response = require('../src/response');
const assignmentService = require('../src/services/AssignmentService');
const operatorService = require('../src/services/OperatorService');
const userService = require('../src/services/UserService');
const taskService = require('../src/services/Task/TaskService');
const episodeService = require('../src/services/Task/TaskEpisodeService');
const charset = require('../src/helpers/charset');

router.get('/', (req, res, next) => {
    operatorService.find(1024, 0, 'imie', 'ASC', "`upr_1` = 'on'").then((operators) => {
        response(res, false, ['Pomyślnie pobrano operatorów.'], operators);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas pobierania operatorów.', JSON.stringify(err)], []);
        return;
    });
});

router.get('/:operatorId', (req, res, next) => {
    operatorService.findById(req.params.operatorId).then((result) => {
        result[0] = charset.translateIn(result[0]);
        response(res, false, ['Pomyślnie pobrano operatora.'], result);
        return;
    }).catch((err) => {
        response(res, true, ['Coś poszło nie tak podczas próby pobrania operatora.', JSON.stringify(err)], []);
        return;
    });
    // assignmentService.findByOperatorId(req.params.operatorId).then((assignment) => {
    //     assignment.klient = assignment.klient.split(',').map((client) => { return Number(client) });
    //     response(res, false, ['Pomyślnie pobrano kompetencje.'], [assignment]);
    //     return;
    // }).catch((err) => {
    //     response(res, true, ['Coś poszło nie tak podczas próby pobrania kompetencji.', JSON.stringify(err)], []);
    //     return;
    // });
});

module.exports = router;