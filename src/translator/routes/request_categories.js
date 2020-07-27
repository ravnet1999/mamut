const express = require('express');
const router = express.Router();
const requestCategoryService = require('../src/services/RequestCategoryService');
const response = require('../src/response');

router.get('/:requestCategoryId', (req, res, next) => {
    requestCategoryService.findById(req.params.requestCategoryId).then((requestCategory) => {
        response(res, false, ['Pomyślnie pobrano kategorię zapytania.'], [requestCategory]);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania kategorii zapytań.`, JSON.stringify(err)], [])
    });
});

module.exports = router;