const express = require('express');
const router = express.Router();
const response = require('../src/response');
const companyService = require('../src/services/CompanyService');
const authMiddleware = require('../middleware/auth');

/* GET home page. */
router.get('/:limit?/:offset?/:sortBy?/:sortWay?', [authMiddleware], function(req, res, next) {
    companyService.getSavedCompanyEmails(req.params.limit, req.params.offset, req.params.sortBy, req.params.sortWay).then((result) => {
        response(res, false, ['Pomyślnie pobrano powiązania mailowe.'], [result]);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas pobierania powiązań mailowych.', JSON.stringify(err)], []);
        return;
    })
});

router.post('/', [authMiddleware], function(req, res, next) {
    companyService.updateCompanyEmails(req.body.companyEmails).then((result) => {
        response(res, false, ['Pomyślnie zapisano zmiany w domenach klientów.'], [result]);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd przy próbie zapisania zmian w domenach klientów.', JSON.stringify(err)], []);
        return;
    });
});

module.exports = router;
