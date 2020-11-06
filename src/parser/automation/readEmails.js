const moment = require('moment');
const appConfig = require('../config/appConfig.json');
const mailParser = require('../src/parser/emailParser');
const Email = require('../src/models/EmailModel');

const formatDate = (date) => {
    return moment(date, appConfig.date.format.system).format(appConfig.date.format.system)
}

const getFromAddress = (email) => {
    return email.from.value[0].address;
}

const readEmails = () => {
    mailParser().then((emails) => {        
        emails.map((email) => {
            Email.findOne({
                from: getFromAddress(email),
                date: formatDate(email.date)
            }).then((databaseEmail) => {
                if(!databaseEmail) {
                    Email.create({
                        from: getFromAddress(email),
                        date: formatDate(email.date),
                        text: email.text,
                        subject: email.subject,
                        inserted: false
                    }).then((result) => {
                        console.log(`Wprowadzono email od ${getFromAddress(email)} z dnia ${formatDate(email.date)} do bazy danych.`);
                        return;
                    }).catch((err) => {
                        console.log('Wystąpił błąd podczas próby wprowadzenia maili do bazy danych Mongo');
                        return;
                    })
                } else {
                    // console.log('Baza maili aktualna.');
                    return;
                }
            }).catch((err) => {
                console.log('Wystąpił błąd podczas próby znalezienia maili w bazie danych Mongo');
                return;
            });
        });

    }).catch((err) => {
        console.log(err);
    });
}

module.exports = {
    method: readEmails,
    interval: 30000
}
