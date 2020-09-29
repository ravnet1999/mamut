const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const companyService = require('../src/service/CompanyService');
const taskService = require('../src/service/TaskService');
const serviceService = require('../src/service/ServiceService');
const appConfig = require('../config/appConfig.json');

router.get('/', [authMiddleware], (req, res, next) => {
    taskService.getTasks(25, 0, 'open', req.operatorId).then((result) => {
        response(res, false, ['Pomyślnie pobrano zadania.'], result);
        return;
    }).catch((err) => {
        response(res, true, ['Coś poszło nie tak podczas próby pobrania zadań.', JSON.stringify(err)], []);
        return;
    });
});

router.get('/:taskId', [authMiddleware], (req, res, next) => {
    taskService.getTaskById(req.params.taskId, req.operatorId).then((result) => {
        response(res, false, ['Pomyślnie pobrano zadanie.'], result);
        return;
    }).catch((err) => {
        response(res, true, ['Coś poszło nie tak podczas próby pobrania zadania po ID.', JSON.stringify(err)], [], '/tasks');
        return;
    });;
});

router.put('/:clientId/:repId', [authMiddleware], (req, res, next) => {
    let taskObject = appConfig.tasks;

    taskObject.operatorId = req.operatorId;

    serviceService.getService(taskObject.serviceId).then((service) => {
        taskObject.service = service.nazwa;
        companyService.getRepresentative(req.params.repId).then((rep) => {

            taskObject.issuer = rep;

            companyService.getCompanies([req.params.clientId]).then((companies) => {

                taskObject.issuerCompany = companies[0];

                companyService.getCompanyLocation(taskObject.issuerCompany.id).then((location) => {
                    taskObject.issuerCompanyLocation = location;
                    taskService.createTask(taskObject).then((result) => {
                        taskService.startTask(result.resources[0].insertId, req.operatorId).then((taskStartResult) => {
                            response(res, false, result.messages, result.resources, `/task/${result.resources[0].insertId}`);
                            return;                    
                        }).catch((err) => {
                            response(res, true, ['Wystąpił błąd podczas próby wystartowania utworzonego zadania.', JSON.stringify(err)], []);
                            return;
                        });
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

router.post('/:taskId/stop', [authMiddleware], (req, res, next) => {
    taskService.stopTask(req.params.taskId, req.operatorId).then((result) => {
        response(res, false, ['Pomyślnie zatrzymano zadanie.'], [], '/tasks');
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas próby zatrzymania zadania.', JSON.stringify(err)], []);
        return;
    });
});

router.post('/:taskId/start', [authMiddleware], (req, res, next) => {
    taskService.startTask(req.params.taskId, req.operatorId).then((result) => {
        console.log(result);
        response(res, false, ['Pomyślnie wznowiono zadanie.'], [], `/task/${req.params.taskId}`);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas próby wznowienia zadania.', JSON.stringify(err)], []);
        return;
    });
});

router.post('/:taskId/reassign', [authMiddleware], (req, res, next) => {
    taskService.reassignTask(req.params.taskId, {
        departmentId: appConfig.tasks.department,
        targetOperatorId: req.body.operatorId,
        operatorId: req.operatorId
    }).then((result) => {
        response(res, false, ['Pomyślnie przypisano zadanie do innego operatora.'], [], '/tasks');
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas próby przypisania zadania do innego operatora.', JSON.stringify(err)], []);
        return;
    });
});

module.exports = router;
