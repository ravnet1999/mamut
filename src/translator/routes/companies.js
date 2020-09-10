const express = require('express');
const router = express.Router();
const companyService = require('../src/services/Company/CompanyService');
const companyLocationService = require('../src/services/Company/CompanyLocationService');
const response = require('../src/response');

router.get('/', (req, res, next) => {
    companyService.find(9999999, 0, 'id', 'ASC').then((companies) => {
        response(res, false, ['Pomyślnie pobrano firmy.'], companies);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania firmy.`, JSON.stringify(err)], []);
        return;
    });
});

router.get('/:companyIds', (req, res, next) => {
    let companyIds = req.params.companyIds.split(',');
    companyService.findById(companyIds).then((companies) => {
        response(res, false, ['Pomyślnie pobrano firmę.'], companies);
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
});

module.exports = router;