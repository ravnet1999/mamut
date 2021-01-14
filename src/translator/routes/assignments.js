const express = require('express');
const router = express.Router();
const response = require('../src/response');
const assignmentService = require('../src/services/AssignmentService');
const operatorService = require('../src/services/OperatorService');
const userService = require('../src/services/UserService');
const taskService = require('../src/services/Task/TaskService');
const charset = require('../src/helpers/charset');

router.get('/', (req, res, next) => {
    operatorService.find(1024, 0, 'imie', 'ASC', "`upr_1` = 'on'").then((operators) => {
        response(res, false, ['Pomyślnie pobrano operatorów.'], operators);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas pobierania operatorów.', JSON.stringify(err)], []);
        return;
    });
});

router.get('/:operatorId', (req, res, next) => {
    operatorService.findById(req.params.operatorId).then((result) => {
        result[0] = charset.translateIn(result[0]);
        response(res, false, ['Pomyślnie pobrano operatora.'], result);
        return;
    }).catch((err) => {
        response(res, true, ['Coś poszło nie tak podczas próby pobrania operatora.', JSON.stringify(err)], []);
        return;
    });
    // assignmentService.findByOperatorId(req.params.operatorId).then((assignment) => {
    //     assignment.klient = assignment.klient.split(',').map((client) => { return Number(client) });
    //     response(res, false, ['Pomyślnie pobrano kompetencje.'], [assignment]);
    //     return;
    // }).catch((err) => {
    //     response(res, true, ['Coś poszło nie tak podczas próby pobrania kompetencji.', JSON.stringify(err)], []);
    //     return;
    // });
});

router.get('/:clientIds/representatives', (req, res, next) => {
    let clientIds = req.params.clientIds.split(',');

    let allTasks = [];

    taskService.find(9999999, 0, 'id', 'DESC', '`status` = \'open\'').then((tasks) => {
        let operatorIds = tasks.map((task) => {
            return task.informatyk;
        });
        operatorIds = operatorIds.filter((operatorId, index, self) => {
            return self.indexOf(operatorId) === index;
        });
        allTasks = tasks;
        return operatorService.findById(operatorIds);
    }).then((operators) => {
        allTasks = allTasks.map((task) => {
            task.operator = {};

            let taskOperators = operators.filter((operator) => {
                return operator.id == task.informatyk;
            });

            if(taskOperators.length > 0) {
                delete taskOperators[0].login;
                delete taskOperators[0].haslo;
                task.operator = taskOperators[0];
            }

            return task;
        })
        return userService.findByClientId(clientIds);
    }).then((clients) => {
        let clientsWithTasks = clients.map((client) => {
            client = charset.translateIn(client);
            client.activeTasks = allTasks.filter((task) => {
                task = charset.translateIn(task);
                return task.id_klienta == client.id_klienta && task.id_zglaszajacy == client.id;
            });
            console.log(client.activeTasks, 'active tasks');
            return client;
        });

        response(res, false, ['Pomyślnie pobrano reprezentantów klienta.'], clientsWithTasks);
        return;
    }).catch((err) => {
        console.log(err);
        response(res, false, ['Coś poszło nie tak podczas próby pobrania aktywnych zadań reprezentantów', JSON.stringify(err)], []);
        return;
    });
    // userService.findByClientId(clientIds).then((clients) => {
    //     clients = clients.map((client) => {
    //         client = charset.translateIn(client);
    //         return client;
    //     });
    //     response(res, false, ['Pomyślnie pobrano reprezentantów klienta.'], clients);
    //     return;
    // }).catch((err) => {
    //     response(res, false, ['Coś poszło nie tak podczas próby pobrania reprezentantów klienta.', JSON.stringify(err)], []);
    //     return;
    // });
});

module.exports = router;