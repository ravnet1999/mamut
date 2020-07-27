const express = require('express');
const router = express.Router();
const query = require('../src/mysql/query');
const response = require('../src/response');

router.get('/', (req, res, next) => {
    query('SELECT `informatyk`, `klient` FROM `informatycy_kompetencje` WHERE `informatyk`=?', [req.body.operatorId], (assignments, fields) => {
        let assignment = assignments[0];
        let result = {
            operatorId: assignment.informatyk,
            clients: assignment.klient.split(',').map((client) => { return Number(client) })
        };

        response(res, false, ['Pomyślnie pobrano klientów.'], [result]);
    });
});

router.get('/:clientId', (req, res, next) => {
    query('SELECT `informatyk`, `klient` FROM `informatycy_kompetencje` WHERE `informatyk`=?', [req.body.operatorId], (assignments, fields) => {
        let assignment = assignments[0];
        let result = {
            operatorId: assignment.informatyk,
            clients: assignment.klient.split(',').map((client) => { return Number(client) })
        };

        if(!result.clients.includes(Number(req.params.clientId))) {
            response(res, true, ['Nie masz uprawnień do obsługiwania tego klienta.'], []);
            return;
        }

        query('SELECT `id`, `imie`, `nazwisko` FROM `uzytkownicy` WHERE `id_klienta`=?', [req.params.clientId], (customers, fields) => {
            response(res, false, ['Pomyślnie pobrano reprezentantów klientów.'], customers);
            return;
        });
    });
});

module.exports = router;