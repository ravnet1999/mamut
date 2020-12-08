const express = require('express');
const router = express.Router();
const serviceService = require('../src/services/ServiceService');
const response = require('../src/response');

router.get('/', (req, res, next) => {
    serviceService.find(99999, 0, `id`, `DESC`).then((services) => {
        response(res, false, ['Pomyślnie pobrano usługi.'], services);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania usług.`, JSON.stringify(err)], [])
    });
});

router.get('/:serviceId', (req, res, next) => {
    serviceService.findById(req.params.serviceId).then((service) => {
        response(res, false, ['Pomyślnie pobrano usługę.'], service);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania usługi.`, JSON.stringify(err)], [])
    });
});

module.exports = router;