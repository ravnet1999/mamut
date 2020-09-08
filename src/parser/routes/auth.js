const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const response = require('../src/response');
const accounts = require('../config/accounts.json');
const Token = require('../src/models/TokenModel');

router.post('/login', (req, res, next) => {
    if(accounts.administrator.username == req.body.username && accounts.administrator.password == req.body.password) {
        Token.updateMany({}, { active: false }).then((status) => {
            Token.create({
                userId: 0,
                token: crypto.randomBytes(16).toString('hex'),
                active: true
            }).then((token) => {
                response(res, false, ['Zalogowano pomyślnie'], [token]);
                return;
            }).catch((err) => {
                response(res, true, ['Wystąpił błąd podczas logowania.', JSON.stringify(err)], [], '/login');
                return;
            });
        }).catch((err) => {
            response(res, true, ['Wystąpił błąd podczas anulowania starych tokenów.', JSON.stringify(err)], [], '/login');
            return;
        });
    } else {
        response(res, true, ['Taki użytkownik nie istnieje.'], [], '/login');
        return;
    }
});

module.exports = router;
