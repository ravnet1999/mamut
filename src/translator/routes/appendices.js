const express = require('express');
const router = express.Router();
const response = require('../src/response');
const appendixService = require('../src/services/AppendixService');
const multiparty = require('multiparty');
const config = require('../config/config.json');

router.post('/:taskId', (req, res, next) => {
  var form = new multiparty.Form({maxFieldsSize: config.appendices.maxFieldsSize});
  
  return new Promise((resolve, reject) => {  
    form.on('error', function(err) {
      return reject(err);
    });

    form.parse(req, function(err, fields, files) {   
      if(fields) {   
        console.log(fields.filename[0])
        console.log(fields.contentType[0])
      
        appendixService.create(req.params.taskId, fields['data'][0]).then((result) => {
          response(res, false, ['Pomyślnie utworzono nowy załącznik.'], [result]);
          return;
        }).catch((err) => {
            response(res, true, ['Wystąpił błąd podczas próby utworzenia nowego załącznika', JSON.stringify(err)], []);
            return;
        });
      }
    });        
  });  
});

module.exports = router;