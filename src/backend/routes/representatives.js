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
    });
});

module.exports = router;