const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');

class RepresentativeClientService {
    search = (text) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/users_clients/search/${text}`).then((response) => {
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

module.exports = new RepresentativeClientService();