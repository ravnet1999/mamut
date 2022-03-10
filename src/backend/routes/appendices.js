const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const appendixService = require('../src/service/AppendixService');
const multiparty = require('multiparty');

router.post('/:taskId', [authMiddleware], (req, res, next) => {
  let taskId = req.params.taskId;

  var form = new multiparty.Form({maxFieldsSize: 2097152000});

  form.on('error', function(err) {
    response(res, true, ['Wystąpił błąd poczas próby utworzenia nowego załącznika.', JSON.stringify(err)], []);
    return;
  });
    
  form.parse(req, function(err, fields, files) {
    if(files) {
      let file = Object.values(files)[0][0];

      appendixService.create(taskId, file).then((result) => {
          response(res, false, ['Pomyślnie utworzono nowy załącznik.'], result.resources);
          return;
      }).catch((err) => {
          response(res, true, ['Wystąpił błąd poczas próby utworzenia nowego załącznika.', JSON.stringify(err)], []);
          return;
      })
    } else {
      response(res, true, ['Wystąpił błąd poczas próby utworzenia nowego załącznika.'], []);
      return;  
    }
  });
});

module.exports = router;
