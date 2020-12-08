const express = require('express');
const router = express.Router();
const response = require('../src/response');
const Task = require('../src/classes/TaskClass');
const TaskStamps = require('../src/classes/TaskStampsClass');
const taskService = require('../src/services/Task/TaskService');
const charset = require('../src/helpers/charset');
const query = require('../src/mysql/query')

router.get('/:taskId', (req, res, next) => {
    new Task(req.params.taskId).fetchTask().then((task) => {
        return TaskStamps.fetchTasksStamps([task]);
    }).then((tasks) => {
        tasks[0].body.lastStamp = tasks[0].stamps ? tasks[0].stamps[0] : {};
        console.log('Current task', tasks[0].body);
        response(res, false, ['Pomyślnie pobrano zadania.'], [tasks[0].body]);
        return;
    }).catch((err) => {
        console.log(err);
        response(res, true, ['Coś poszło nie tak podczas próby pobrania zadania.', JSON.stringify(err)], []);
        return;
    });
});

router.get('/stamps/:taskId', (req, res, next) => {
    new Task(req.params.taskId).fetchTask().then((task) => {
        return TaskStamps.fetchTasksStamps([task]);
    }).then((tasks) => {
        response(res, false, ['Pomyślnie pobrano stemple.'], tasks[0].stamps);
        return;
    }).catch((err) => {
        console.log(err);
        response(res, true, ['Coś poszło nie tak podczas próby pobrania stempli.', JSON.stringify(err)], []);
        return;
    });
});


router.get('/:departmentId/:operatorId/:limit?/:offset?/:status?', (req, res, next) => {
    Task.fetchTasks(req.params.departmentId, req.params.operatorId, req.params.limit, req.params.offset, req.params.status).then((tasks) => {
        return TaskStamps.fetchTasksStamps(tasks);  
    }).then((tasksWithStamps) => {
        let message = tasksWithStamps.length > 0 ? 'Pomyślnie pobrano zadania' : 'Dobra robota. Brak zadań! Proponuję kawę.';
        let taskBodies = tasksWithStamps.map((task) => {
            task.body.lastStamp = task.stamps[0];
            return task.body;
        })
        response(res, false, [message], taskBodies);
    }).catch((err) => {
        console.log(err);
        response(res, true, ['Coś poszło nie tak podczas próby pobrania zadań.', JSON.stringify(err)], []);
        return;
    });
});

router.put('/', (req, res, next) => {
    let task = new Task();
    req.body.task = charset.translateOut(req.body.task);
    task.createTask(req.body.task, req.body.operatorId).then((task) => {
        query('INSERT INTO zgloszenia_etapy ( id_zgloszenia , id_informatyka , id_komorki) VALUES ( ?, ?, ? )', [task.body.id, req.body.operatorId, task.body.komorka], (episodeInsertResult, fields) => {
            response(res, false, ['Pomyślnie utworzono zadanie.'], [task.body]);
            return;
        });
    }).catch((err) => {
        console.log(err);
        response(res, true, ['Coś poszło nie tak podczas próby utworzenia zadania.', JSON.stringify(err)], []);
        return;
    });
});

router.post('/:taskId/start', (req, res, next) => {
    new Task(req.params.taskId).fetchTask().then((task) => {
        return task.startTask(req.body.operatorId);
    }).then((result) => {
        response(res, false, ['Pomyślnie rozpoczęto zadanie.'], [result], `/task/${req.params.taskId}`);
        return;
    }).catch((err) => {
        console.log('starting error', err);
        response(res, true, ['Wystąpił problem podczas próby wystartowania zadania.', JSON.stringify(err)], []);
        return;
    });
});

router.post('/:taskId/stop', (req, res, next) => {
    new Task(req.params.taskId).fetchTask().then((task) => {
        return task.stopTask(req.body.operatorId);
    }).then((result) => {
        response(res, false, ['Pomyślnie zamknięto zadanie.'], [result], `/tasks`);
        return;
    }).catch((err) => {
        console.log(err);
        response(res, true, ['Wystąpił błąd podczas próby zatrzymania zadania.', JSON.stringify(err)], []);
        return;
    })
});

router.post('/:taskId/reassign', (req, res, next) => {
    new Task(req.params.taskId).fetchTask().then((task) => {
        return task.reassignTask(req.body.operatorId, req.body.targetOperatorId, req.body.departmentId);
    }).then((taskUpdateResult) => {
        response(res, false, ['Pomyślnie przypisano zadanie do innego operatora.'], [taskUpdateResult]);
        return;
    }).catch((err) => {
        console.log(err);
        response(res, true, ['Wystąpił błąd podczas próby przypisania zadania do innego operatora.', JSON.stringify(err)]);
        return;
    });
});

router.post('/:taskId/close', (req, res, next) => {
    new Task(req.params.taskId).fetchTask().then((task) => {
        return task.closeTask(req.body.operatorId);
    }).then((closeResult) => {
        response(res, false, ['Pomyślnie zamknięto zadanie.'], [closeResult]);
        return;
    }).catch((err) => {
        console.log(err);
        response(res, true, ['Wystąpił błąd podczas próby zamknięcia zadania.', JSON.stringify(err)], []);
        return;
    });

    return;

});

router.patch('/:taskId', (req, res, next) => {
    new Task(req.params.taskId).fetchTask().then((task) => {
        req.body = charset.translateOut(req.body);
        return task.patchTask(req.body);
    }).then((task) => {
        response(res, false, ['Pomyślnie zaktualizowano zadanie.'], [task.body]);
        return;
    }).catch((err) => {
        console.log(err);
        response(res, true, ['Coś poszło nie tak podczas próby aktualizacji zadania.', JSON.stringify(err)], []);
        return;
    })
});

router.patch('/:taskId/description', (req, res, next) => {
    let translate = {
        description: req.body.description
    };

    let description = charset.translateOut(translate).description;

    taskService.updateById(req.params.taskId, ['opis'], [description]).then((result) => {
        response(res, false, ['Pomyślnie zmodyfikowano opis zadania.'], [result]);
        return;
    }).catch((err) => {
        response(res, true, ['Wystąpił błąd podczas próby modyfikacji opisu zadania', JSON.stringify(err)], []);
        return;
    });
});

module.exports = router;