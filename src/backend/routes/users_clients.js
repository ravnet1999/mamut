const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const userClientService = require('../src/service/UserClientService');

router.get('/:phoneNumber', [authMiddleware], (req, res, next) => {
    userClientService.findByPhoneNumber(req.params.phoneNumber).then((representatives) => {
        response(res, false, ['Pomyślnie pobrano reprezentantów klientów.'], representatives);
        return;
    }).catch((err) => {
        console.log(err);
        response(res, true, ['Coś poszło nie tak podczas próby pobrania reprezentantów klientów.', JSON.stringify(err)], []);
        return;
    });
});

module.exports = router;
