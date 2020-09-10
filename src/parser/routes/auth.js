const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const response = require('../src/response');
const accounts = require('../config/accounts.json');
const tokenService = require('../src/services/TokenService');

router.post('/login', (req, res, next) => {
    if(accounts.administrator.username == req.body.username && accounts.administrator.password == req.body.password) {
        tokenService.create(0).then((token) => {
            response(res, false, ['Pomyślnie zalogowano'], [token], '/domains');
            return;
        }).catch((err) => {
            response(res, true, ['Wystąpił błąd podczas logowania.', JSON.stringify(err)], []);
            return;
        })
    } else {
        response(res, true, ['Taki użytkownik nie istnieje.'], []);
        return;
    }
});

module.exports = router;
