const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');

class CompanyService {
    getCompanies = (clientIds) => {
        return new Promise((resolve, reject) => {
            let url=`${appConfig.URLs.translator}/companies`;
            if(clientIds) {
              url += `/${clientIds}`;
            }
            console.log(url);
            axios.get(url).then((response) => {
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

    getRepresentativeWithTasks = (repId) => {
      return new Promise((resolve, reject) => {
          axios.get(`${appConfig.URLs.translator}/users/getWithTasks/${repId}`).then((response) => {
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

    changeRepresentative = (repId, rep) => {
        return new Promise((resolve, reject) => {
            axios.patch(`${appConfig.URLs.translator}/users/${repId}`, rep).then((response) => {
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

    createRepresentative = (rep) => {
      return new Promise((resolve, reject) => {
          axios.put(`${appConfig.URLs.translator}/users`, rep).then((response) => {
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

    getRepresentatives = (companyId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/users/findByClientIds/${companyId}`).then((response) => {
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

    getCompaniesWithRepresentatives = (companyId) => {
        return new Promise((resolve, reject) => {
            this.getCompanies(companyId).then((companies) => {
                this.getRepresentatives(companyId).then((representatives) => {
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

    getCompanyLocations = (companyId) => {
      return new Promise((resolve, reject) => {
          axios.get(`${appConfig.URLs.translator}/companies/${companyId}/locations`).then((response) => {
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

  updateDocumentation = (companyId, documentation) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${appConfig.URLs.translator}/companies/${companyId}/documentation`, {
            documentation
        }).then((response) => {
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