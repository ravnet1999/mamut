const express = require('express');
const router = express.Router();
const response = require('../src/response');
const companyService = require('../src/services/CompanyService');

/* GET home page. */
router.get('/', function(req, res, next) {
    companyService.getCompanyEmails().then((emails) => {
        response(res, false, ['Pomyślnie pobrano powiązania mailowe.'], emails);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas pobierania powiązań mailowych.'], []);
        return;
    });
});

module.exports = router;
