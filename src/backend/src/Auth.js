const axios = require('axios');
const parseResponse = require('../src/ResponseParser');
const appConfig = require('../config/appConfig.json');

class Auth {
    login = (username, password) => {
        return new Promise((resolve, reject) => {
            axios.post(`${appConfig.URLs.translator}/auth/login`, {
                username: username,
                password: password
            }).then((response) => {
                parseResponse(response).then((result) => {
                    resolve(result);
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

module.exports = new Auth();