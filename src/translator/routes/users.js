const express = require('express');
const router = express.Router();
const userService = require('../src/services/UserService');
const response = require('../src/response');
const charset = require('../src/helpers/charset');

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
        users = users.map((user) => {
            return charset.translateIn(user);
        });
        response(res, false, ['Pomyślnie pobrano użytkownika.'], users);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania użytkownika.`, JSON.stringify(err)], [])
    });
});

router.get('/findByEmail/:email', (req, res, next) => {
    userService.find(1, 0, 'id', 'DESC', '`adres_email` = \'' + req.params.email + '\'').then((users) => {
        response(res, false, ['Pomyślnie pobrano użytkownika za pomocą adresu email.'], users);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas próby pobrania użytkownika za pomocą email.', JSON.stringify(err)], []);
        return;
    })
});

router.get('/:clientId/findUnknownUser', (req, res, next) => {
    userService.find(1, 0, 'id', 'DESC', '`nazwisko` = \'Nieznany\' AND `id_klienta` = \'' + req.params.clientId + '\'').then((users) => {
        response(res, false, ['Pomyślnie pobrano nieznanego użytkownika.'], users);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas próby pobrania nieznanego użytkownika.', JSON.stringify(err)], []);
        return;
    })
});

module.exports = router;