const express = require('express');
const router = express.Router();
const response = require('../src/response');
const operatorService = require('../src/services/OperatorService');

router.post('/login', (req, res, next) => {
    operatorService.login(req.body.username, req.body.password).then((user) => {
        response(res, false, ['Logowanie pomyślne.'], [user]);
        return;
    }).catch((err) => {
        response(res, true, ['Coś poszło nie tak podczas próby logowania.', JSON.stringify(err)], []);
        return;
    })
});

module.exports = router;