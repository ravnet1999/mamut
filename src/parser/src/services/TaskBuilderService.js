const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');
const serviceService = require('./TaskServices/ServiceService');
const companyService = require('./CompanyService');
const taskService = require('./TaskServices/TaskService');

class TaskBuilderService {
    insertTask = (clientId, repId, description, customRep = null) => {
        return new Promise((resolve, reject) => {
            let taskObject = appConfig.tasks;

            taskObject.description = description;
        
            serviceService.getService(taskObject.serviceId).then((service) => {
                taskObject.service = service.nazwa;
                companyService.getRepresentative(repId).then((rep) => {
        
                    taskObject.issuer = customRep ? customRep : rep;
        
                    companyService.getCompany(clientId).then((companies) => {
        
                        taskObject.issuerCompany = companies[0];
        
                        companyService.getCompanyLocation(taskObject.issuerCompany.id).then((location) => {
                            taskObject.issuerCompanyLocation = location;
                            taskService.createTask(taskObject).then((result) => {
                                resolve(result);
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
                        reject(err);
                        return;
                    });
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

module.exports = new TaskBuilderService();