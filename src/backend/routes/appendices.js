const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const appendixService = require('../src/service/AppendixService');

router.post('/:taskId', [authMiddleware], (req, res, next) => {
  let taskId = req.params.taskId;

  appendixService.create(taskId, req, res).then((result) => {
      response(res, false, ['Pomyślnie utworzono nowy załącznik.'], result.resources);
      return;
  }).catch((err) => {
      response(res, true, ['Wystąpił błąd poczas próby utworzenia nowego załącznika.', JSON.stringify(err)], []);
      return;
  })
});

module.exports = router;
