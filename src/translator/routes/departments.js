const express = require('express');
const router = express.Router();
const departmentService = require('../src/services/DepartmentService');
const response = require('../src/response');

router.get('/:channelId', (req, res, next) => {
    departmentService.findById(req.params.channelId).then((department) => {
        response(res, false, ['Pomyślnie pobrano komórkę.'], [department]);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania komórki.`, JSON.stringify(err)], [])
    });
});

module.exports = router;