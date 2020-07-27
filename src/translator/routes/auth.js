const express = require('express');
const router = express.Router();
const query = require('../src/mysql/query');
const response = require('../src/response');

router.post('/login', (req, res, next) => {
    query('SELECT * FROM `informatycy` WHERE login=?', [req.body.username], (results, fields) => {

        let user = results[0];

        if(!user) {
            response(res, true, ['Taki użytkownik nie istnieje.'], []);
            return;
        }

        if(user.haslo == req.body.password) {
            delete user.haslo;
            response(res, false, ['Logowanie pomyślne.'], [user]);
            return;
        }

        response(res, true, ['Taki użytkownik nie istnieje.']);
        return;
    });
});

module.exports = router;