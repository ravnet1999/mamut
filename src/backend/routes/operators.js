const express = require('express');
const router = express.Router();
const Auth = require('../src/Auth');
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const operatorService = require('../src/service/OperatorService');

router.get('/', [authMiddleware], (req, res, next) => {
    operatorService.getOperators().then((result) => {
        response(res, false, ['Pomyślnie pobrano operatorów dla zadania.'], result);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas próby pobrania operatorów.', JSON.stringify(err)], result);
        return;
    });
});

router.post('/login', (req, res, next) => {
    Auth.login(req.body.username, req.body.password).then((result) => {
        response(res, false, ['Pomyślnie zalogowano.'], [result], '/clients');
    }).catch((err) => {
        response(res, true, ['Wystąpił problem z logowaniem', JSON.stringify(err)], []);
    });
});

module.exports = router;
