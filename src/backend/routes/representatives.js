const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const clientRightsMiddleware = require('../middleware/clientRights');
const companyService = require('../src/service/CompanyService');

/* GET users listing. */
router.get('/:repId', [authMiddleware, clientRightsMiddleware], (req, res, next) => {

    companyService.getRepresentative(req.params.repId).then((representative) => {
        if(!req.clientRights.includes(Number(representative.id_klienta))) {
            response(res, true, ['Nie masz uprawnień do obsługi tego klienta.'], [], '/clients');
            return;
        }
        response(res, false, ['Pomyślnie pobrano reprezentanta.'], [representative]);
        return;
    });
});

module.exports = router;