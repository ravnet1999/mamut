const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');

class CompanyService {
    getCompanies = (companyIds) => {
        return new Promise((resolve, reject) => {
            companyIds = companyIds.join(',');
            axios.get(`${appConfig.URLs.translator}/companies/${companyIds}`).then((response) => {
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

    getRepresentatives = (companyIds) => {
        return new Promise((resolve, reject) => {
            companyIds = companyIds.join(',');
            axios.get(`${appConfig.URLs.translator}/assignments/${companyIds}/representatives`).then((response) => {
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

    getCompaniesWithRepresentatives = (companyIds) => {
        return new Promise((resolve, reject) => {
            this.getCompanies(companyIds).then((companies) => {
                this.getRepresentatives(companyIds).then((representatives) => {
                    let companiesWithRepresentatives = companies.map((company) => {
                        company.representatives = representatives.filter((representative) => {
                            return representative.id_klienta == company.id;
                        });
                        return company;
                    });

                    resolve(companiesWithRepresentatives);
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