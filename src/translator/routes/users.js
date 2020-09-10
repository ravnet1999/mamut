const express = require('express');
const router = express.Router();
const userService = require('../src/services/UserService');
const response = require('../src/response');

router.get('/', (req, res, next) => {
    userService.find(999999, 0, 'id', 'ASC').then((users) => {
        response(res, false, ['Pomyślnie pobrano wszystkich użytkowników.'], users);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas pobierania wszystkich użytkowników.'], []);
        return;
    });
});

router.get('/:userId', (req, res, next) => {
    userService.findById(req.params.userId).then((users) => {
        response(res, false, ['Pomyślnie pobrano użytkownika.'], users);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania użytkownika.`, JSON.stringify(err)], [])
    });
});
module.exports = router;