const express = require('express');
const router = express.Router();
const userService = require('../src/services/UserService');
const response = require('../src/response');

router.get('/:userId', (req, res, next) => {
    userService.findById(req.params.userId).then((user) => {
        response(res, false, ['Pomyślnie pobrano użytkownika.'], [user]);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania użytkownika.`, JSON.stringify(err)], [])
    });
});
module.exports = router;