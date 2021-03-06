const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');

class ServiceService {
    getServices = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/services`).then((response) => {
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

    getService = (serviceId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/services/${serviceId}`).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response.resources[0]);
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

module.exports = new ServiceService();