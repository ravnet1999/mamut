const Service = require('./Service');
const mongodb = require('mongoose');
const moment = require('moment');
const Email = require('../models/EmailModel');
const appConfig = require('../../config/appConfig.json');

class EmailService extends Service {
    constructor(model) {
        super(model);
    }

    insertEmail = (date, from) => {
        return new Promise((resolve, reject) => {
            let formattedDate = moment(date, appConfig.date.format.system).format(appConfig.date.format.system);

            this.checkIfExists({
                $and: [
                    { date: formattedDate },
                    { from: from }
                ]
            }).then((exists) => {
                if(!exists) {
                    this.insert({
                        date: formattedDate,
                        from: from,
                        inserted: false
                    }).then((result) => {
                        resolve({ 
                            saved: true,
                            result: result
                        });
                        return;
                    }).catch((err) => {
                        reject(err);
                        return;
                    });
                } else {
                    resolve({
                        saved: false,
                        retsult: null
                    });
                    return;
                }
            }).catch((err) => {
                reject(err);
                return;
            });
        });
    }
}

module.exports = new EmailService(Email);