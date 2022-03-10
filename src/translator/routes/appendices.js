const express = require('express');
const router = express.Router();
const response = require('../src/response');
const appendixService = require('../src/services/AppendixService');
const multiparty = require('multiparty');

router.post('/:taskId', (req, res, next) => {
  var form = new multiparty.Form({maxFieldsSize: 209715200});
  
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

      // if(files) {
      //   let file = Object.values(files)[0][0];

      //   console.log(file);

      //   appendixService.create(req.params.taskId, file).then((result) => {
      //       response(res, false, ['Pomyślnie utworzono nowy załącznik.'], [result]);
      //       return;
      //   }).catch((err) => {
      //       response(res, true, ['Wystąpił błąd podczas próby utworzenia nowego załącznika', JSON.stringify(err)], []);
      //       return;
      //   });
      // }
    });        
  });  
});

module.exports = router;