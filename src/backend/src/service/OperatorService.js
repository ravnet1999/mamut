const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');

class OperatorService {
    getOperators = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/assignments`).then((response) => {
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

    getOperator = (operatorId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/assignments/${operatorId}`).then((response) => {
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

module.exports = new OperatorService();