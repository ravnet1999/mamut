const express = require('express');
const router = express.Router();
const Auth = require('../src/Auth');
const authMiddleware = require('../middleware/auth');
const corsMiddleware = require('../middleware/cors');
const response = require('../src/response');

/* GET users listing. */
router.post('/login', (req, res, next) => {
    Auth.login(req.body.username, req.body.password).then((result) => {
        response(res, false, ['Pomyślnie zalogowano.'], [result], '/clients');
    }).catch((err) => {
        response(res, true, ['Wystąpił problem z logowaniem', JSON.stringify(err)], []);
    });
});

module.exports = router;
