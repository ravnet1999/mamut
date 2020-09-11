const moment = require('moment');
const appConfig = require('../config/appConfig.json');
const Email = require('../src/models/EmailModel');
const CompanyEmail = require('../src/models/CompanyEmailModel');
const taskService = require('../src/services/TaskService');
const companyService = require('../src/services/CompanyService');

const formatDate = (date) => {
    return moment(date, appConfig.date.format.system).format(appConfig.date.format.system)
}

const insertEmails = () => {
    Email.find({
        inserted: false
    }).then((databaseEmails) => {
        databaseEmails.map((databaseEmail) => {
            let domain = databaseEmail.from.split('@')[1];

            CompanyEmail.findOne({
                domains: domain
            }).then((companyEmail) => {
                if(!companyEmail) {
                    return;
                } 

                companyService.getCompanyRepresentatives(companyEmail.companyId).then((reps) => {
                    console.log(reps[0]);
                }).catch((err) => {
                    console.log(err);
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
