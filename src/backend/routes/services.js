const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const Task = require('../src/classess/Task');
const taskService = require('../src/service/TaskService');
const serviceService = require('../src/service/ServiceService');

router.get('/', [authMiddleware], (req, res, next) => {
    serviceService.getServices().then((services) => {
        response(res, false, ['Pomyślnie pobrano usługi.'], services);
        return;
    }).catch((err) => {
        console.log(err);
        response(res, true, ['Wystąpił błąd podczas próby pobrania usług'], []);
        return;
    })
});

router.get('/:serviceId', [authMiddleware], (req, res, next) => {
    serviceService.getService(req.params.serviceId).then((result) => {
        response(res, false, ['Pomyślnie pobrano usługę.'], [result]);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas próby pobrania usługi.'], []);
        return;
    });
});

module.exports = router;
