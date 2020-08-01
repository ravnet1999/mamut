const express = require('express');
const router = express.Router();
const mailParser = require('../src/parser/emailParser');
const emailService = require('../src/services/EmailService');

/* GET home page. */
router.get('/', function(req, res, next) {
    mailParser().then((emails) => {
        let results = [];

        emails.map((email) => {

            let from = email.from.value[0].address;
            let date = email.date;

            emailService.insertEmail(date, from).then((result) => {
                results.push({
                    date: date,
                    from: from,
                    result: result
                });
            }).catch((err) => {
                results.push({
                    date: date,
                    from: from,
                    result: err
                });
            }).finally(() => {
                if(results.length == emails.length) {
                    res.json(results);
                }
            });
        });
    }).catch((err) => {
        console.log(err);
    })
});

module.exports = router;
