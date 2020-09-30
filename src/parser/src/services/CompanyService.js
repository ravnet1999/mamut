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

    getCompany = (companyId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/companies/${companyId}`).then((response) => {
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

    getRepresentative = (repId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/users/${repId}`).then((response) => {
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

    getCompanyLocation = (companyId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/companies/${companyId}/location`).then((response) => {
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

    getCompanyEmails = () => {
        return new Promise((resolve, reject) => {
            this.getCompaniesWithRepresentatives().then((companies) => {
                userService.getUsers().then((users) => {
        
                    let emails = companies.map((company) => {
                        let clientReps = users.filter((user) => {
                            return user.id_klienta == company.id && String(user.adres_email).includes('@');
                        });

                        let clientRepObjects = company.representatives.map((clientRep) => {
                            return {
                                repId: clientRep.id,
                                name: clientRep.imie + ' ' + clientRep.nazwisko
                            }
                        });
        
                        let clientRepsDomains = [];
        
                        clientReps.map((clientRep) => {
                            let domain = clientRep.adres_email.split('@')[1].toLowerCase();
                            if(!clientRepsDomains.includes(domain)) {
                                clientRepsDomains.push(domain);
                            }
                        });

                        let selectedRep = clientRepObjects[0] ? clientRepObjects[0].repId : null;
        
        
                        return { companyId: company.id, companyName: company.nazwa, domains: clientRepsDomains, companyRepresentatives: clientRepObjects, selectedRep: selectedRep};
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
        return new Promise((resolve, reject) => {
            let writeObjects = companyEmailsArray.map((companyEmailElement) => {
                return {
                    updateOne: {
                        filter: { companyId: companyEmailElement.companyId },
                        update: {
                            $set: {
                                domains: companyEmailElement.domains.map((domain) => { return domain.trim() }),
                                companyName: companyEmailElement.companyName,
                                companyNameLowerCase: companyEmailElement.companyName.toLowerCase(),
                                companyRepresentatives: companyEmailElement.companyRepresentatives,
                                selectedRep: companyEmailElement.selectedRep
                            }
                        },
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

    getSavedCompanyEmails = (limit = undefined, offset = 0, sortBy = 'companyId', sortWay = 'DESC') => {
        return new Promise((resolve, reject) => {
            CompanyEmail.countDocuments({}).then((count) => {
                CompanyEmail.find({}).sort({ [sortBy]: sortWay }).skip(Number(offset)).limit(Number(limit)).then((companyEmails) => {
                    resolve({
                        count: count,
                        result: companyEmails
                    });
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

    getCompanyRepresentatives = (clientId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/assignments/${clientId}/representatives`).then((response) => {
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

    // getCompanies = (companyIds) => {
    //     return new Promise((resolve, reject) => {
    //         companyIds = companyIds.join(',');
    //         axios.get(`${appConfig.URLs.translator}/companies/${companyIds}`).then((response) => {
    //             parseResponse(response).then((response) => {
    //                 resolve(response.resources);
    //                 return;
    //             }).catch((err) => {
    //                 reject(err);
    //                 return;
    //             });
    //         }).catch((err) => {
    //             reject(err);
    //             return;
    //         });
    //     });
    // }

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

    getCompaniesWithRepresentatives = () => {
        return new Promise((resolve, reject) => {
            this.getCompanies().then((companies) => {
                let companyIds = companies.map((company) => {
                    return company.id;
                });
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