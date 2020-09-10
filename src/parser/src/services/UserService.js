const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');

class UserService {
    getUsers = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/users`).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response.resources);
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

module.exports = new UserService();