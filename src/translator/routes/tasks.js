const express = require('express');
const router = express.Router();
const query = require('../src/mysql/query');
const response = require('../src/response');
const helpers = require('../src/tasks/helpers');
const taskService = require('../src/services/Task/TaskService');
const taskStampService = require('../src/services/Task/TaskStampService');
const taskEpisodeService = require('../src/services/Task/TaskEpisodeService');

router.get('/:limit?/:offset?/:status?', (req, res, next) => {
    let limit = req.params.limit || 25;
    let offset = req.params.offset || 0;
    let status = req.params.status ? '`status`=\'' + req.params.status + '\'' : ''; 

    taskService.find(limit, offset, 'id', 'DESC', status ).then((tasks) => {
        response(res, false, ['Pomyślnie pobrano zadania.'], tasks);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił problem podczas próby znalezienia zamówień.', JSON.stringify(err)], []);
        return;        
    });
});

router.put('/', (req, res, next) => {

    console.log(req.body);

    if(!req.body.concernedUser) {
        req.body.concernedUser = req.body.issuer;
        req.body.concernedCompany = req.body.issuerCompany;
        req.body.concernedCompanyLocation = req.body.issuerCompanyLocation;
        req.body.concernedRoomNumber = req.body.issuerRoomNumber;
        req.body.concernedPcId = req.body.issuerPcId;
        req.body.concernedPc = req.body.issuerPc;
    }

    let taskQuery = helpers.buildTaskQuery(req.body);

    taskService.query(taskQuery.query, taskQuery.values).then((results) => {
        taskStampService.stamp('dodanie zg³.', results.insertId, req.body.operatorId).then((stampAddTaskResult) => {
            taskStampService.stamp('nowy etap', results.insertId, req.body.operatorId).then((stampAddEpisodeResult) => {
                taskService.updateById(results.insertId, ['komorka', 'informatyk'], [req.body.department, req.body.operatorId]).then((taskUpdateResult) => {
                    query('INSERT INTO zgloszenia_etapy ( id_zgloszenia , id_informatyka , id_komorki) VALUES ( ?, ?, ? )', [results.insertId, req.body.operatorId, req.body.department], (episodeInsertResult, fields) => {
                        response(res, false, ['Pomyślnie dodano zadanie.'], [results]);
                        return;
                    });
                }).catch((err) => {
                    response(res, true, ['Coś poszło nie tak podczas aktualizacji zadania.', JSON.stringify(err)], []);
                    return;
                });
            }).catch((err) => {
                response(res, true, ['Coś poszło nie tak podczas próby utworzenia stempla rozpoczynającego nowy etap zadania.', JSON.stringify(err)], [stampResults]);
                return;
            });
        }).catch((err) => {
            response(res, true, ['Coś poszło nie tak podczas próby utworzenia stempla rozpoczynającego zadanie.', JSON.stringify(err)], [stampResults]);
            return;
        });
    }).catch((err) => {
        response(res, true, ['Coś poszło nie tak podczas tworzenia nowego zadania.', JSON.stringify(err)], []);
        return;
    });

    // res.json(taskQuery);

    // query(taskQuery.query, taskQuery.values, (taskInsertResult, fields) => {
    //     console.log(taskInsertResult);
    // });
});

router.post('/:taskId/start', (req, res, next) => {
    taskStampService.stamp('START', req.params.taskId, req.body.operatorId, '').then((result) => {
        response(res, false, ['Poprawnie rozpoczęto zadanie.'], [result]);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił problem podczas próby rozpoczęcia zadania.'], [result]);
        return;
    });
});

router.post('/:taskId/stop', (req, res, next) => {
    taskStampService.stamp('OCZEKUJE', req.params.taskId, req.body.operatorId, 'Pauza w aplikacji mobilnej.').then((result) => {
        response(res, false, ['Poprawnie wstrzymano zadanie.'], [result]);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił problem podczas próby wstrzymania zadania.'], [result]);
        return;
    });
});

router.post('/:taskId/reassign', (req, res, next) => {
    taskStampService.stamp('Zmiana przypisania', req.params.taskId, req.body.operatorId, '').then((stampResult) => {
        taskService.updateById(req.params.taskId, ['komorka', 'informatyk'], [req.body.departmentId, req.body.targetOperatorId]).then((taskUpdateResult) => {
            taskEpisodeService.addEpisode(req.params.taskId, req.body.targetOperatorId, req.body.departmentId).then((addEpisodeResult) => {
                response(res, false, ['Pomyślnie przypisano zadanie do innego operatora'], [taskUpdateResult]);
                return;
            }).catch((err) => {
                response(res, true, ['Coś poszło nie tak podczas próby przypisania zadania do innego operatora', JSON.stringify(err)], []);
                return;
            })
        }).catch((err) => {
            response(res, true, ['Coś poszło nie tak podczas próby przypisania zadania do innego operatora', JSON.stringify(err)], []);
            return;
        });
    }).catch((err) => {
        response(res, true, ['Coś poszło nie tak podczas próby przypisania zadania do innego operatora', JSON.stringify(err)], []);
        return;
    }) 
});
module.exports = router;