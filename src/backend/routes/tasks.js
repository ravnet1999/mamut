const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const companyService = require('../src/service/CompanyService');
const taskService = require('../src/service/TaskService');
const serviceService = require('../src/service/ServiceService');
const operatorService = require('../src/service/OperatorService');
const appConfig = require('../config/appConfig.json');

router.get('/', [authMiddleware], (req, res, next) => {
    taskService.getTasks(9999, 0, 'open', appConfig.tasks.department, req.operatorId).then((result) => {
        let message = 'Pomyślnie pobrano zadania';
        if(result.length == 0) {
            message = 'Dobra robota. Brak zadań! Proponuję kawę.'
        }
        response(res, false, [message], result);
        return;
    }).catch((err) => {
        response(res, true, ['Coś poszło nie tak podczas próby pobrania zadań.', JSON.stringify(err)], []);
        return;
    });
    // taskService.getTasks(25, 0, 'open', 0, 0).then((result) => {
    //     let message = 'Pomyślnie pobrano zadania';
    //     if(result.length == 0) {
    //         message = 'Dobra robota. Brak zadań! Proponuję kawę.'
    //     }
    //     response(res, false, [message], result);
    //     return;
    // }).catch((err) => {
    //     response(res, true, ['Coś poszło nie tak podczas próby pobrania zadań.', JSON.stringify(err)], []);
    //     return;
    // });
});

router.get('/general', [authMiddleware], (req, res, next) => {
    taskService.getTasks(9999, 0, 'open', 0, 0).then((result) => {
        let message = 'Pomyślnie pobrano zadania';
        if(result.length == 0) {
            message = 'Dobra robota. Brak zadań! Proponuję kawę.'
        }
        result = result.sort((a, b) => {
            return a.id - b.id;
        });
        response(res, false, [message], result);
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

            companyService.getCompany(req.params.clientId).then((companies) => {

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
    taskService.getTaskById(req.params.taskId, req.operatorId).then((task) => {
        if(!task) {
            response(res, true, ['Takie zadanie nie istnieje!'], []);
            return;
        }
        if(task[0].informatyk == 0 && task[0].komorka == 0) {
            taskService.reassignTask(req.params.taskId, {
                departmentId: appConfig.tasks.department,
                targetOperatorId: req.operatorId,
                operatorId: req.operatorId
            }).then((result) => {
                taskService.startTask(req.params.taskId, req.operatorId).then((result) => {
                    response(res, false, ['Pomyślnie wznowiono zadanie.'], [], `/task/${req.params.taskId}`);
                    return;
                }).catch((err) => {
                    response(res, true, ['Wystąpił błąd podczas próby wznowienia zadania.', JSON.stringify(err)], []);
                    return;
                });
            }).catch((err) => {
                response(res, true, ['Wystąpił błąd podczas próby przypisania zadania do innego operatora.', JSON.stringify(err)], []);
                return;
            });   
        } else {
            taskService.startTask(req.params.taskId, req.operatorId).then((result) => {
                response(res, false, ['Pomyślnie wznowiono zadanie.'], [], `/task/${req.params.taskId}`);
                return;
            }).catch((err) => {
                response(res, true, ['Wystąpił błąd podczas próby wznowienia zadania.', JSON.stringify(err)], []);
                return;
            });
        }
    });
});

router.post('/:taskId/close', [authMiddleware], (req, res, next) => {
    taskService.closeTask(req.params.taskId, req.operatorId).then((result) => {
        response(res, false, result.messages, result.resources);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił problem podczas próby zamknięcia zadania', JSON.stringify(err)], []);
        return;
    })
});

router.post('/:taskId/reassign', [authMiddleware], (req, res, next) => {
    let self = typeof req.body.operatorId === 'undefined';
    let targetOperatorId = self ? req.operatorId : req.body.operatorId;

    taskService.reassignTask(req.params.taskId, {
        departmentId: req.body.operatorId === 0 ? req.body.operatorId : appConfig.tasks.department,
        targetOperatorId: targetOperatorId,
        operatorId: req.operatorId
    }).then((result) => {
        operatorService.getOperator(req.operatorId).then((operators) => {
            let operatorFrom = operators[0];
            operatorService.getOperator(req.body.operatorId).then((operators) => {
                let operatorTo = operators[0];
                taskService.getTaskById(req.params.taskId).then((tasks) => {
                    let task = tasks[0];
                    taskService.getEpisodes(req.params.taskId).then((result) => {
                        let episodes = result.resources;
                        companyService.getRepresentative(task.id_zglaszajacy).then((rep) => {
                            companyService.getCompany(rep.id_klienta).then((companies) => {
                                let company = companies[0];
                                if(self) {
                                    taskService.startTask(req.params.taskId, req.operatorId).then((result) => {
                                        response(res, false, ['Pomyślnie przypisano zadanie do innego operatora.'], []);
                                        return;
                                    }).catch((err) => {
                                        response(res, true, ['Wystąpił błąd podczas próby wystartowania zadania po przepisaniu.', JSON.stringify(err)], []);
                                        return;
                                    })
                                } else {
                                    taskService.notifyReassign(task, rep, company, episodes, operatorFrom, operatorTo);

                                    response(res, false, ['Pomyślnie przypisano zadanie do innego operatora.'], []);
                                    return;
                                }
                            }).catch((err) => {
                                response(res, true, ['Wystąpił błąd podczas próby pobrania firmy.', JSON.stringify(err)], []);
                                return;
                            });
                        }).catch((err) => {
                            response(res, true, ['Wystąpił błąd podczas próby pobrania reprezentanta.', JSON.stringify(err)], []);
                            return;
                        });
                    }).catch((err) => {
                        response(res, true, ['Wystąpił błąd podczas próby pobrania etapów.', JSON.stringify(err)], []);
                        return;
                    });
                }).catch((err) => {
                    response(res, true, ['Wystąpił błąd podczas próby pobrania zadania.', JSON.stringify(err)], []);
                    return;
                });
            }).catch((err) => {
                response(res, true, ['Wystąpił błąd podczas próby pobrania operatora docelowego.', JSON.stringify(err)], []);
                return;
            })
        }).catch((err) => {
            response(res, true, ['Wystąpił błąd podczas próby pobrania operatora.', JSON.stringify(err)], []);
            return;
        });
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas próby przypisania zadania do innego operatora.', JSON.stringify(err)], []);
        return;
    });
});

router.get('/:taskId/episodes', [authMiddleware], (req, res, next) => {
    taskService.getEpisodes(req.params.taskId).then((episodes) => {
        response(res, false, ['Pomyślnie pobrano etapy zadania.'], episodes.resources);
        return;
    }).catch((err) => {
        console.log(err);
        response(res, true, ['Wystąpił problem podczas próby pobrania etapów zadania.'], []);
        return;
    })
});

router.patch('/:taskId/description', [authMiddleware], (req, res, next) => {
    taskService.updateDescription(req.params.taskId, req.body.description).then((result) => {
        response(res, false, ['Pomyślnie zaktualizowano opis zadania.'], result.resources);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd poczas próby aktualizacji opisu zadania.', JSON.stringify(err)], []);
        return;
    });
});

router.patch('/:episodeId/lastEpisodeDescription', [authMiddleware], (req, res, next) => {
    taskService.updateLastEpisodeDescription(req.params.episodeId, req.body.description).then((result) => {
        response(res, false, ['Pomyślnie zaktualizowano opis etapu.'], result.resources);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd poczas próby aktualizacji opisu etapu.', JSON.stringify(err)], []);
        return;
    })
});

router.patch('/:episodeId/travel', [authMiddleware], (req, res, next) => {
    taskService.updateEpisodeTravel(req.params.episodeId, req.body.travel).then((result) => {
        response(res, false, ['Pomyślnie zaktualizowano opis etapu.'], result.resources);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd poczas próby aktualizacji opisu etapu.', JSON.stringify(err)], []);
        return;
    })
});

module.exports = router;
