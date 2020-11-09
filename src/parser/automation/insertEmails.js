const moment = require('moment');
const appConfig = require('../config/appConfig.json');
const Email = require('../src/models/EmailModel');
const CompanyEmail = require('../src/models/CompanyEmailModel');
const taskBuilderService = require('../src/services/TaskBuilderService');
const taskService = require('../src/services/TaskServices/TaskService');
const episodeService = require('../src/services/TaskServices/EpisodeService');
const companyService = require('../src/services/CompanyService');

const formatDate = (date) => {
    return moment(date, appConfig.date.format.system).format(appConfig.date.format.system)
}

const insertEmail = (rep, databaseEmail) => {
    rep.adres_email = databaseEmail.from;
    console.log(rep.adres_email);
    taskBuilderService.insertTask(rep.id_klienta, rep.id, databaseEmail.subject, rep).then((result) => {
        if(!result.error) {
            databaseEmail.inserted = true;
            databaseEmail.save((err, doc) => {
               console.log(`Dodano zadanie nr. ${result.resources[0].insertId} dla klienta o ID ${rep.id_klienta} i reprezentanta o id ${rep.id}.`);

                episodeService.getEpisodes(result.resources[0].insertId).then((episodeFetchResult) => {
                    episodeService.updateDescription(episodeFetchResult.resources[0].id, databaseEmail.text.length > 2500 ? databaseEmail.text.substr(0, 2500) + '...' : databaseEmail.text).then((descriptionUpdateResult) => {
                        console.log('Update result: ', descriptionUpdateResult);
                    });
                });
            });
        }
    }).catch((err) => {
        console.log('error', err);
    });
}

const insertEmails = () => {
    Email.find({
        inserted: false
    }).then((databaseEmails) => {
        if(databaseEmails.length > 0) {
            console.log(`Znaleziono ${databaseEmails.length} maili, z których nie utworzono jeszcze zadań.`);
        }
        databaseEmails.map((databaseEmail) => {
            let fullEmail = databaseEmail.from;
            let domain = fullEmail.split('@')[1];

            companyService.getRepByEmail(fullEmail).then((rep) => {
                if(rep.length == 0) {
                    
                    CompanyEmail.findOne({
                        domains: domain
                    }).then((companyEmail) => {
                        if(!companyEmail) {
                            return;
                        } 
                        companyService.getUnknownRep(companyEmail.companyId).then((rep) => {
                            if(rep.length == 0) {
                                console.log(`Użytkownik nieznany nie jest przypisany do klienta o id ${companyEmail.companyId}.`);
                                return;
                            };
                            insertEmail(rep[0], databaseEmail);
                        }).catch((err) => {
                            console.log(err);
                            return;
                        })
                    }).catch((err) => {
                        console.log(err);
                        return;
                    });

                    return;
                }

                insertEmail(rep[0], databaseEmail);

            }).catch((err) => {
                console.log(err);
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
