const express = require('express');
const router = express.Router();
const query = require('../src/mysql/query');

router.post('/login', (req, res, next) => {
    query('SELECT login, haslo FROM `informatycy` WHERE login=?', [req.body.login], (results, fields) => {

        let user = results[0];

        if(user.password == req.body.password) {
            res.json({
                error: false,
                messages: ['test']
            });
            return;
        }

        res.json({
            error: true,
            messages: ['Wrong password...']
        });
    })
});

module.exports = router;