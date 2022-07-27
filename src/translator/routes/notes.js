const express = require('express');
const router = express.Router();
const response = require('../src/response');
const taskNoteService = require('../src/services/Task/TaskNoteService');

router.get('/:notesIds', (req, res, next) => {
  let notesIds = req.params.notesIds.split(',');  
  taskNoteService.findById(notesIds).then((note) => {
    response(res, false, ['Pomyślnie pobrano dane notatek.'], note);
    return;
  }).catch((err) => {
      response(res, true, [`Wystąpił błąd podczas próby pobrania danych notatek.`, JSON.stringify(err)], [])
  });
});

router.get('/task/:taskId', (req, res, next) => {
  let taskId = req.params.taskId;
  taskNoteService.findByTaskId(taskId).then((notes) => {
    response(res, false, ['Pomyślnie pobrano dane notatek dla wybranego zadania.'], notes);
    return;
  }).catch((err) => {
      response(res, true, [`Wystąpił błąd podczas próby pobrania danych notatek dla wybranego zadania.`, JSON.stringify(err)], [])
  });
});

router.get('/type/:typeId', (req, res, next) => {
  let typeId = req.params.typeId;
  taskNoteService.findByNoteTypeId(typeId).then((notes) => {
    response(res, false, ['Pomyślnie pobrano dane notatek wybranego typu.'], notes);
    return;
  }).catch((err) => {
      response(res, true, [`Wystąpił błąd podczas próby pobrania danych notatek wybranego typu.`, JSON.stringify(err)], [])
  });
});

router.get('/task/:taskId/type/:typeId', (req, res, next) => {
  let taskId = req.params.taskId;
  let typeId = req.params.typeId;
  taskNoteService.findByTaskIdNoteTypeId(taskId, typeId).then((notes) => {
    response(res, false, ['Pomyślnie pobrano dane notatek dla wybranego zadania.'], notes);
    return;
  }).catch((err) => {
      response(res, true, [`Wystąpił błąd podczas próby pobrania danych notatek dla wybranego zadania.`, JSON.stringify(err)], [])
  });
});

module.exports = router;