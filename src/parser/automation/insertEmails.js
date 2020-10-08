const moment = require('moment');
const appConfig = require('../config/appConfig.json');
const Email = require('../src/models/EmailModel');
const CompanyEmail = require('../src/models/CompanyEmailModel');
const taskService = require('../src/services/TaskBuilderService');
const companyService = require('../src/services/CompanyService');

const formatDate = (date) => {
    return moment(date, appConfig.date.format.system).format(appConfig.date.format.system)
}

const insertEmails = () => {
    Email.find({
        inserted: false
    }).then((databaseEmails) => {
        if(databaseEmails.length > 0) {
            console.log(`Znaleziono ${databaseEmails.length} maili, z których nie utworzono jeszcze zadań.`);
        }
        databaseEmails.map((databaseEmail) => {
            let domain = databaseEmail.from.split('@')[1];

            CompanyEmail.findOne({
                domains: domain
            }).then((companyEmail) => {
                if(!companyEmail) {
                    return;
                } 

                console.log(`Znaleziono email z domeny ${domain} dla ${companyEmail.companyName}`);

                taskService.insertTask(companyEmail.companyId, companyEmail.selectedRep, databaseEmail.text, 30).then((result) => {
                    if(!result.error) {
                        databaseEmail.inserted = true;
                        databaseEmail.save((err, doc) => {
                           console.log(`Dodano zadanie nr. ${result.resources[0].insertId} dla ${companyEmail.companyName}.`) 
                        });
                    }
                }).catch((err) => {
                    console.log('error', err);
                });
            }).catch((err) => {
                console.log(err);
                return;
            });
        })
    }).catch((err) => {
        console.log('Wystąpił błąd podczas próby pobrania maili z bazy danych Mongo.');
        return;
    });
}

module.exports = {
    method: insertEmails,
    interval: 10000
}
