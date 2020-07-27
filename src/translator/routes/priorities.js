const express = require('express');
const router = express.Router();
const priorityService = require('../src/services/PriorityService');
const response = require('../src/response');

router.get('/:priorityId', (req, res, next) => {
    priorityService.findById(req.params.priorityId).then((priority) => {
        response(res, false, ['Pomyślnie pobrano priorytet.'], [priority]);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania komórki.`, JSON.stringify(err)], [])
    });
});

module.exports = router;