const axios = require('axios');
const tokenService = require('./service/TokenService');
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
                    tokenService.create(result.resources[0].id).then((docToken) => {
                        resolve(docToken);
                        return;
                    }).catch((err) => {
                        reject(err);
                        return;
                    });
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    message: 'Wystąpił problem z połączeniem z translatorem.'
                });
                return;
            });
        });
    }
}

module.exports = new Auth();