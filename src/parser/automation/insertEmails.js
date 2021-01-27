const moment = require('moment');
const appConfig = require('../config/appConfig.json');
const Email = require('../src/models/EmailModel');
const CompanyEmail = require('../src/models/CompanyEmailModel');
const taskBuilderService = require('../src/services/TaskBuilderService');
const taskService = require('../src/services/TaskServices/TaskService');
const episodeService = require('../src/services/TaskServices/EpisodeService');
const companyService = require('../src/services/CompanyService');
const Task = require('../src/classes/Task');

console.log(moment().format('DD-MM-YYYY, HH:mm:ss'), 'Initializing insertEmails.');

let taskRunning = null;
let lastRemind = null;

const formatDate = (date) => {
    return moment(date, appConfig.date.format.system).format(appConfig.date.format.system)
}

const insertEmail = (rep, databaseEmail) => {
    console.log(moment().format('DD-MM-YYYY, HH:mm:ss'), 'Running insertEmail (singular) function.', 'Email from: ', databaseEmail.from);

    rep.adres_email = databaseEmail.from;
    let newTask;
    
    new Task(rep.id_klienta, rep.id).createTask(0, {
        opis: databaseEmail.subject
    }).then((task) => {
        newTask = task;
        return episodeService.getEpisodes(task.body.id);
    }).then((episodeFetchResult) => {
        return episodeService.updateDescription(episodeFetchResult.resources[0].id, databaseEmail.text.length > 2500 ? databaseEmail.text.substr(0, 2500) + '...' : databaseEmail.text);
    }).then((descriptionUpdateResult) => {
        databaseEmail.inserted = true;
        return databaseEmail.save();
    }).then((doc) => {
        taskRunning = null;
        console.log(moment().format('DD-MM-YYYY, HH:mm:ss'), 'Pomyślnie zaktualizowano opis pierwszego etapu dla zadania: ', newTask.body.id);
    }).catch((err) => {
        taskRunning = null;
        console.log(moment().format('DD-MM-YYYY, HH:mm:ss'), 'Wystąpił błąd podczas próby wprowadzenia maila jako zadanie.');
        console.log(err);
    });
}

const insertEmails = () => {
    if(taskRunning) {
        console.log(`Previous (${taskRunning}) insertEmails task is still running...`);
        return;
    };
    taskRunning = moment().format('DD-MM-YYYY HH:mm:ss');


    Email.find({
        initialized: true,
        inserted: false
    }).then((emails) => {
        if(emails.length == 0) return;
        if(lastRemind != moment().format('DD-MM-YYYY HH')) {
            console.log('Znalazłem maile, które nie zostały w pełni zapisane jako zadania. ID obiektów w bazie danych: ', emails.map((email) => { return email._id }).join(', '));
            lastRemind = moment().format('DD-MM-YYYY HH');
        }
    }).catch((err) => {
        console.log(err);
    });

    Email.find({
        initialized: false,
        inserted: false
    }).then((databaseEmails) => {
        if(databaseEmails.length == 0) {
            taskRunning = null;
            return;
        }
        databaseEmails.map((databaseEmail) => {
            databaseEmail.initialized = true;
            databaseEmail.save().then((doc) => {
                let fullEmail = databaseEmail.from;
                let domain = fullEmail.split('@')[1];
    
                companyService.getRepByEmail(fullEmail).then((rep) => {
                    if(rep.length == 0) {
                        CompanyEmail.findOne({
                            domains: domain
                        }).then((companyEmail) => {
                            if(!companyEmail) {
                                taskRunning = null;
                                return;
                            } 
                            companyService.getUnknownRep(companyEmail.companyId).then((rep) => {
                                if(rep.length == 0) {
                                    taskRunning = null;
                                    console.log(moment().format('DD-MM-YYYY, HH:mm:ss'), `Użytkownik nieznany nie jest przypisany do klienta o id ${companyEmail.companyId}.`);
                                    return;
                                };
                                console.log(moment().format('DD-MM-YYYY, HH:mm:ss'), 'Found email (unknown rep):', databaseEmail.from);
                                insertEmail(rep[0], databaseEmail);
                            }).catch((err) => {
                                taskRunning = null;
                                console.log(err);
                                return;
                            })
                        }).catch((err) => {
                            taskRunning = null;
                            console.log(err);
                            return;
                        });
    
                        return;
                    }
    
                    console.log(moment().format('DD-MM-YYYY, HH:mm:ss'), 'Found email:', databaseEmail.from);
                    insertEmail(rep[0], databaseEmail);
    
                }).catch((err) => {
                    taskRunning = null;
                    console.log(err);
                }); 
            }).catch((err) => {
                taskRunning = null;
                console.log(err);
            }); 
        })
    }).catch((err) => {
        taskRunning = null;
        console.log(moment().format('DD-MM-YYYY, HH:mm:ss'), 'Wystąpił błąd podczas próby pobrania maili z bazy danych Mongo.');
        return;
    });
}

module.exports = {
    method: insertEmails,
    interval: 5000
}
