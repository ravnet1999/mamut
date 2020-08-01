const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');

class CompanyService {
    getCompanies = (companyIds) => {
        return new Promise((resolve, reject) => {
            companyIds = companyIds.join(',');
            axios.get(`${appConfig.URLs.translator}/companies/${companyIds}`).then((response) => {
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

module.exports = new CompanyService();