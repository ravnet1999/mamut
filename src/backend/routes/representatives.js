const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const companyService = require('../src/service/CompanyService');

/* GET users listing. */
router.get('/:repId', [authMiddleware], (req, res, next) => {

    companyService.getRepresentative(req.params.repId).then((representative) => {
        response(res, false, ['Pomyślnie pobrano reprezentanta.'], [representative]);
        return;
    }).catch((err) => {
        response(res, true, ['Coś poszło nie tak podczas próby pobrania reprezentanta.', JSON.stringify(err)], [representative]);
        return;
    });
});

router.patch('/:repId', [authMiddleware], (req, res, next) => {
    companyService.changeRepresentative(req.params.repId, req.body).then((representative) => {
        response(res, false, ['Pomyślnie zmodyfikowano reprezentanta.'], [representative]);
        return;
    }).catch((err) => {
        response(res, true, ['Coś poszło nie tak podczas próby pobrania reprezentanta.', JSON.stringify(err)], [representative]);
        return;
    });
});

module.exports = router;