const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const clientRightsMiddleware = require('../middleware/clientRights');
const companyService = require('../src/service/CompanyService');
const taskService = require('../src/service/TaskService');
const serviceService = require('../src/service/ServiceService');
const appConfig = require('../config/appConfig.json');

router.put('/:clientId/:repId', [authMiddleware, clientRightsMiddleware], (req, res, next) => {
    let taskObject = appConfig.tasks;

    taskObject.operatorId = req.operatorId;

    serviceService.getService(taskObject.serviceId).then((service) => {
        taskObject.service = service.nazwa;
        companyService.getRepresentative(req.params.repId).then((rep) => {

            if(!req.clientRights.includes(Number(rep.id_klienta)) || !req.clientRights.includes(Number(req.params.clientId))) {
                response(res, true, ['Nie masz uprawnień do obsługi tego klienta.'], [], '/clients');
                return;
            }

            taskObject.issuer = rep;

            companyService.getCompanies([req.params.clientId]).then((companies) => {

                taskObject.issuerCompany = companies[0];

                companyService.getCompanyLocation(taskObject.issuerCompany.id).then((location) => {
                    taskObject.issuerCompanyLocation = location;
                    taskService.createTask(taskObject).then((result) => {

                        response(res, false, result.messages, result.resources, `/task/${result.resources[0].insertId}`);
                        return;                    
                    }).catch((err) => {
                        response(res, true, ['Wystąpił błąd podczas próby utworzenia zadania', JSON.stringify(err)], []);
                        return;
                    });
                }).catch((err) => {
                    response(res, true, ['Wystąpił błąd podczas próby pobrania informacji o lokalizacji firmy.', JSON.stringify(err)], []);
                    return;
                });
            }).catch((err) => {
                response(res, true, ['Wystąpił błąd podczas próby pobrania informacji o klientach.', JSON.stringify(err)], []);
                return;
            });
        }).catch((err) => {
            response(res, true, ['Wystąpił błąd podczas próby pobrania informacji o reprezentantach.', JSON.stringify(err)], []);
            return;
        });
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas próby pobrania informacji o usługach.', JSON.stringify(err)], []);
        return;
    });
});

module.exports = router;
