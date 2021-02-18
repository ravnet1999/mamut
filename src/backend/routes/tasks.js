const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const Task = require('../src/classess/Task');
const companyService = require('../src/service/CompanyService');
const taskService = require('../src/service/TaskService');
const serviceService = require('../src/service/ServiceService');
const operatorService = require('../src/service/OperatorService');
const appConfig = require('../config/appConfig.json');
const moment = require('moment');

router.get('/', [authMiddleware], (req, res, next) => {
    taskService.getTasks(9999, 0, 'open', appConfig.tasks.komorka, req.operatorId).then((result) => {
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

router.get('/details/:taskId', [authMiddleware], (req, res, next) => {
    taskService.getTaskDetails(req.params.taskId).then((result) => {
        response(res, false, ['Pomyślnie pobrano szczegóły zadania.'], result.resources);
        return;
    }).catch((err) => {
        response(res, true, ['Coś poszło nie tak podczas próby pobrania szczegółów zadania.', JSON.stringify(err)], []);
        return;
    });
});

router.put('/:clientId/:repId', [authMiddleware], (req, res, next) => {
    let task = new Task(req.params.clientId, req.params.repId);

    task.createTask(req.operatorId).then((task) => {
        return task.startTask(req.operatorId);
    }).then((task) => {
        response(res, false, ['Pomyślnie utworzono zadanie'], [task.body], `/task/${task.body.id}`);
        return;
    }).catch((err) => {
        console.log(err);
        response(res, true, ['Wystąpił błąd podczas tworzenia zadania'], []);
        return;
    });
});

const notificationCallback = (err) => {
    if(err) {
        console.log(err);
        response(res, true, ['Wystąpił problem podczas próby pobrania stempli zadania.', JSON.stringify(err)], []);
        return;    
    }

    response(res, false, ['Pomyślnie wstrzymano zadanie.'], [], '/tasks');
    return;
};

const notifyFirstStop = (taskId, operatorId, callback) => {
    
    let fetchedTask;
    let fetchedRep;
    let fetchedOperator;

    taskService.getTaskById(taskId, operatorId).then((tasks) => {
        fetchedTask = tasks[0];
        return companyService.getRepresentative(fetchedTask.id_zglaszajacy);
    }).then((rep) => {
        fetchedRep = rep;
        return operatorService.getOperator(fetchedTask.informatyk);
    }).then((operators) => {
        fetchedOperator = operators[0];
        taskService.verifyFirstStop(taskId, (startStamp) => {
            startStamp.godzina = moment(startStamp.godzina).format('DD-MM-YYYY HH:mm:ss');
            taskService.notifyStop(fetchedTask, fetchedRep, fetchedOperator, startStamp);
        }, callback);
    })      
}

router.post('/:taskId/await/:type', [authMiddleware], (req, res, next) => {
    if(req.body.description == 'STOP') {
    
        taskService.stopTask(req.params.taskId, req.operatorId).then((result) => {
            notifyFirstStop(req.params.taskId, req.operatorId, notificationCallback);
        }).catch((err) => {
            response(res, true, ['Wystąpił błąd podczas próby zatrzymania zadania.', JSON.stringify(err)], []);
            return;
        });
        return;
    }

    taskService.awaitTask(req.params.taskId, req.params.type, req.body.description, req.operatorId).then((awaitResult) => {
        if(req.body.description.substr(0, 6) == 'Termin') {
            let date = req.body.description.substr(7, req.body.description.length);
            let datetime = moment(date, 'YYYY-MM-DD HH.mm.ss').format('YYYY-MM-DD HH:mm:ss');    

            taskService.patchTask(req.params.taskId, { termin: datetime, terminowe: 1 }).then((result) => {
                notifyFirstStop(req.params.taskId, req.operatorId, notificationCallback);
            }).catch((err) => {
                response(res, true, ['Coś poszło nie tak podczas próby wstrzymania zadania.', JSON.stringify(err)], []);
                return;
            });
        } else {
            notifyFirstStop(req.params.taskId, req.operatorId, notificationCallback);
        }
    }).catch((err) => {
        console.log(err);
        response(res, true, ['Coś poszło nie tak podczas próby wstrzymania zadania.', JSON.stringify(err)], []);
        return;
    });
});

router.post('/:taskId/stop', [authMiddleware], (req, res, next) => {
    let fetchedTask;
    let fetchedResult;
    let fetchedRep;
    let fetchedOperator;

    taskService.stopTask(req.params.taskId, req.operatorId).then((result) => {
        fetchedResult = result;
        return taskService.getTaskById(req.params.taskId, req.operatorId);
    }).then((tasks) => {
        fetchedTask = tasks[0];
        return companyService.getRepresentative(fetchedTask.id_zglaszajacy);
    }).then((rep) => {
        fetchedRep = rep;
        return operatorService.getOperator(fetchedTask.informatyk);
    }).then((operator) => {
        console.log('fetched operator');
        fetchedOperator = operator[0];
        taskService.verifyFirstStop(req.params.taskId, (startStamp) => {
            console.log('stop is here');
            startStamp.godzina = moment(startStamp.godzina).format('DD-MM-YYYY HH:mm:ss');
            taskService.notifyStop(fetchedTask, fetchedRep, fetchedOperator, startStamp);
        }, (err) => {
            console.log('continue');
            if(err) {
                console.log(err);
                response(res, true, ['Wystąpił problem podczas próby pobrania stempli zadania.', JSON.stringify(err)], []);
                return;    
            }

            response(res, false, fetchedResult.messages, fetchedResult.resources);
            return;
        });
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
                departmentId: appConfig.tasks.komorka,
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
    let closeResult;
    let fetchedTask;
    let fetchedLastEpisode;
    let fetchedRep;
    let fetchedOperator;

    taskService.closeTask(req.params.taskId, req.operatorId).then((result) => {
        closeResult = result;
        return taskService.getTaskById(req.params.taskId, req.operatorId);
    }).then((tasks) => {
        fetchedTask = tasks[0];
        return taskService.getEpisodes(req.params.taskId);
    }).then((episodes) => {
        fetchedLastEpisode = episodes.resources[0];
        return companyService.getRepresentative(fetchedTask.id_zglaszajacy);
    }).then((rep) => {
        fetchedRep = rep;
        return operatorService.getOperator(fetchedTask.informatyk);
    }).then((operator) => {
        fetchedOperator = operator[0];
        taskService.notifyClose(fetchedTask, fetchedLastEpisode, fetchedRep, fetchedOperator);
        response(res, false, closeResult.messages, closeResult.resources);
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
        departmentId: req.body.operatorId === 0 ? req.body.operatorId : appConfig.tasks.komorka,
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
                            companyService.getCompany(rep.id_klienta).then((company) => {
                                taskService.verifyFirstStop(req.params.taskId, (startStamp) => {
                                    startStamp.godzina = moment(startStamp.godzina).format('DD-MM-YYYY HH:mm:ss');
                                    taskService.notifyStop(tasks[0], rep, operators[0], startStamp);
                                }, (err) => {
                                    if(err) {
                                        response(res, true, ['Wystąpił problem podczas próby pobrania stempli zadania.', JSON.stringify(err)], []);
                                        return;    
                                    }
        
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
                                });
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

router.patch('/:taskId', [authMiddleware], (req, res, next) => {
    console.log('test');
    new Task().patchTask(req.params.taskId, req.body, req.operatorId).then((result) => {
        res.json(result);
    }).catch((err) => {
        console.log(err);
        res.json(err);
    });
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
