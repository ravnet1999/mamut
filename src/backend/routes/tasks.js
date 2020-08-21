const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const clientRightsMiddleware = require('../middleware/clientRights');
const companyService = require('../src/service/CompanyService');

router.put('/:clientId/:repId', [authMiddleware, clientRightsMiddleware], (req, res, next) => {
    companyService.getRepresentative(req.params.repId).then((representative) => {
        if(!req.clientRights.includes(Number(representative.id_klienta)) || !req.clientRights.includes(Number(req.params.clientId))) {
            response(res, true, ['Nie masz uprawnień do obsługi tego klienta.'], [], '/clients');
            return;
        }

        companyService.getCompanies([req.params.clientId]).then((companies) => {
            let company = companies[0];

            
        }).catch((err) => {
            response(res, true, ['Wystąpił błąd podczas próby pobrania informacji o klientach.', JSON.stringify(err)], []);
            return;
        });
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas próby pobrania informacji o reprezentantach.', JSON.stringify(err)], []);
        return;
    });
});

module.exports = router;
