const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const taskNoteService = require('../src/service/TaskNoteService');

router.get('/types', [authMiddleware], async (req, res, next) => { 
  try{
    let results = await taskNoteService.getNoteTypes(); 
    response(res, false, ['Pomyślnie pobrano informacje o typach notatek.'], results);   
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby pobrania z translatora informacji o typach notatek.', JSON.stringify(err)], []);
  }
});

router.get('/:noteId', [authMiddleware], async (req, res, next) => { 
  try{
    let results = await taskNoteService.get(req.params.noteId); 
    response(res, false, ['Pomyślnie pobrano informacje o notatce.'], results);   
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby pobrania z translatora informacji o notatce.', JSON.stringify(err)], []);
  }
});

router.get('/task/:taskId', [authMiddleware], async (req, res, next) => { 
  try{
    let results = await taskNoteService.getByTaskId(req.params.taskId); 
    response(res, false, ['Pomyślnie pobrano informacje o notatkach dla zadania.'], results);   
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby pobrania z translatora informacji o notatkach dla zadania.', JSON.stringify(err)], []);
  }
});

router.get('/type/:typeId', [authMiddleware], async (req, res, next) => { 
  try{
    let results = await taskNoteService.getByNoteTypeId(req.params.typeId); 
    response(res, false, ['Pomyślnie pobrano informacje o notatkach wybranego typu.'], results);   
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby pobrania z translatora informacji o notatkach wybranego typu.', JSON.stringify(err)], []);
  }
});

router.get('/task/:taskId/type/:typeId', [authMiddleware], async (req, res, next) => { 
  try{
    let results = await taskNoteService.getByTaskIdNoteTypeId(req.params.taskId, req.params.typeId); 
    response(res, false, ['Pomyślnie pobrano informacje o notatkach dla zadania wybranego typu.'], results);   
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby pobrania z translatora informacji o notatkach dla zadania wybranego typu.', JSON.stringify(err)], []);
  }
});

module.exports = router;
