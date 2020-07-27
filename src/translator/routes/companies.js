const express = require('express');
const router = express.Router();
const companyService = require('../src/services/Company/CompanyService');
const companyLocationService = require('../src/services/Company/CompanyLocationService');
const response = require('../src/response');

router.get('/:companyId', (req, res, next) => {
    companyService.findById(req.params.companyId).then((company) => {
        response(res, false, ['Pomyślnie pobrano firmę.'], [company]);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania firmy.`, JSON.stringify(err)], [])
    });
});

router.get('/:companyId/location', (req, res, next) => {
    companyLocationService.findByCompanyId(req.params.companyId).then((companyLocation) => {
        response(res, false, ['Pomyślnie pobrano lokalizację firmy.'], [companyLocation]);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania lokalizacji firmy.`, JSON.stringify(err)], [])
    });
})

module.exports = router;