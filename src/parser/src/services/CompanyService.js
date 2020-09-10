const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');
const userService = require('./UserService');
const CompanyEmail = require('../models/CompanyEmailModel');

class CompanyService {
    getCompanies = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/companies`).then((response) => {
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

    getCompanyEmails = () => {
        return new Promise((resolve, reject) => {
            this.getCompanies().then((companies) => {
                userService.getUsers().then((users) => {
        
                    let emails = companies.map((company) => {
                        let clientReps = users.filter((user) => {
                            return user.id_klienta == company.id && String(user.adres_email).includes('@');
                        });
        
                        let clientRepsDomains = [];
        
                        clientReps.map((clientRep) => {
                            let domain = clientRep.adres_email.split('@')[1].toLowerCase();
                            if(!clientRepsDomains.includes(domain)) {
                                clientRepsDomains.push(domain);
                            }
                        });
        
        
                        return { companyId: company.id, companyName: company.nazwa, domains: clientRepsDomains };
                    });
        
                    resolve(emails);
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

    saveCompanyEmails = (companyEmailsArray) => {
        console.log(companyEmailsArray);
        return new Promise((resolve, reject) => {
            let writeObjects = companyEmailsArray.map((companyEmailElement) => {
                return {
                    updateOne: {
                        filter: { companyId: companyEmailElement.companyId },
                        update: { $set: { domains: companyEmailElement.domains, companyName: companyEmailElement.companyName } },
                        upsert: true
                    }
                }
            });

            CompanyEmail.bulkWrite(writeObjects).then((result) => {
                resolve(result);
                return;
            }).catch((err) => {
                reject(err);
                return;
            });
        });
    }
}

module.exports = new CompanyService();