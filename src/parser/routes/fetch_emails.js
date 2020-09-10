const express = require('express');
const router = express.Router();
const response = require('../src/response');
const companyService = require('../src/services/CompanyService');
const authMiddleware = require('../middleware/auth');

/* GET home page. */
router.post('/', [authMiddleware], function(req, res, next) {
    companyService.getCompanyEmails().then((emails) => {
        companyService.saveCompanyEmails(emails).then((result) => {
            response(res, false, ['Zapisano powiązania mailowe.'], [result]);
            return;
        }).catch((err) => {
            response(res, true, ['Wystąpił błąd podczas zapisywania powiązań mailowych.', JSON.stringify(err)], []);
            return;            
        })
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas pobierania powiązań mailowych.', JSON.stringify(err)], []);
        return;
    });
});

module.exports = router;
