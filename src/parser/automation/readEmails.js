const moment = require('moment');
const appConfig = require('../config/appConfig.json');
const mailParser = require('../src/parser/emailParser');
const Email = require('../src/models/EmailModel');

let taskRunning = null;

const formatDate = (date) => {
    return moment(date, appConfig.date.format.system).format(appConfig.date.format.system)
}

const getFromAddress = (email) => {
    return email.from.value[0].address;
}

const readEmails = () => {
    if(taskRunning) {
        console.log(`Previous ${taskRunning} readEmails task is still running...`);
        return;
    }
    taskRunning = moment().format('DD-MM-YYYY HH:mm:ss');

    mailParser().then((emails) => {        
        console.log('Got emails:', emails);

        emails.map((email) => {
            console.log('Reading email:', email);
            if(!email.date) {
                return;
            }
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
                        console.log('Wystąpił błąd podczas próby wprowadzenia maili do bazy danych Mongo', err);
                        return;
                    })
                } else {
                    return;
                }
            }).catch((err) => {
                console.log('Wystąpił błąd podczas próby znalezienia maili w bazie danych Mongo', err);
                return;
            });
        });

        console.log('Terminating readEmails...');
        taskRunning = null;

    }).catch((err) => {
        taskRunning = null;
        console.log(err);
    });
}

module.exports = {
    method: readEmails,
    interval: 5000
}
