const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');

class TaskService {
    createTask = (taskObject) => {
        return new Promise((resolve, reject) => {
            axios.put(`${appConfig.URLs.translator}/tasks/`, taskObject).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject(err);
                return;
            });
        });   
    }

    reassignTask = (taskId, reassignObject) => {
        return new Promise((resolve, reject) => {
            axios.post(`${appConfig.URLs.translator}/tasks/${taskId}/reassign`, reassignObject).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject(err);
                return;
            });
        });   
    }
}

module.exports = new TaskService();