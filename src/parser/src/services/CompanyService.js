const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');
const userService = require('./UserService');

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
        
        
                        return { id: company.id, name: company.nazwa, domains: clientRepsDomains };
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
}

module.exports = new CompanyService();