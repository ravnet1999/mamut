var express = require('express');
var router = express.Router();
const Auth = require('../src/Auth');

/* GET users listing. */
router.post('/login', function(req, res, next) {
    Auth.login(req.body.username, req.body.password).then((result) => {
        res.json(result);
    }).catch((err) => {
        res.json(err);
    });
});

module.exports = router;
