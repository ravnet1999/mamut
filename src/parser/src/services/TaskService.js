const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');

class TaskService {
    insertTask = (clientId) => {
        return new Promise((resolve, reject) => {
            if(1 == 2) {
                reject('not ok');
            }
            resolve('ok');
        });
    }
}

module.exports = new TaskService();