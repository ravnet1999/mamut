const express = require('express');
const router = express.Router();
const response = require('../src/response');
const appendixService = require('../src/services/AppendixService');
const multiparty = require('multiparty');
const config = require('../config/config.json');
const charset = require('../src/helpers/charset');

router.get('/:appendicesIds', (req, res, next) => {
  let appendicesIds = req.params.appendicesIds.split(',');
  appendixService.findById(appendicesIds).then((appendices) => {
    appendices = appendices.map((appendix) => {
      delete appendix['zawartosc'];
      return charset.translateIn(appendix);
    });
    response(res, false, ['Pomyślnie pobrano dane załączników.'], appendices);
    return;
  }).catch((err) => {
      response(res, true, [`Wystąpił błąd podczas próby pobrania danych załączników.`, JSON.stringify(err)], [])
  });
});

router.get('/task/:taskId', (req, res, next) => {
  let taskId = req.params.taskId;
  appendixService.findByTaskId(taskId).then((appendices) => {
    appendices = appendices.map((appendix) => {
      delete appendix['zawartosc'];
      return charset.translateIn(appendix);
    });
    response(res, false, ['Pomyślnie pobrano dane załączników dla wybranego zadania.'], appendices);
    return;
  }).catch((err) => {
      response(res, true, [`Wystąpił błąd podczas próby pobrania danych załączników dla wybranego zadania.`, JSON.stringify(err)], [])
  });
});

router.post('/:taskId', (req, res, next) => {
  var form = new multiparty.Form({maxFieldsSize: config.appendices.maxFieldsSize});
  
  return new Promise((resolve, reject) => {  
    form.on('error', function(err) {
      return reject(err);
    });

    form.parse(req, async function(err, fields, files) {   
      if(fields) {   
        console.log(fields.originalFilename[0]);
        console.log(fields.filename[0]);
        console.log(fields.path[0]);        
        console.log(fields.size[0]);
        console.log(fields.contentType[0]);
        
        // console.log(fields.data[0]);
        
        // console.log(fields);

        let tags = JSON.parse(fields.tags[0])[0].split(',');
        console.log(tags);
      
        try {
          let appendixId = await appendixService.create(req.params.taskId, fields);
          await appendixService.addTags(appendixId, tags);
          let appendix = await appendixService.findByIdWithAllData(appendixId);
          
          // console.log(appendix[0]['zawartosc'].toString())
          delete appendix[0]['zawartosc'];          
          response(res, false, ['Pomyślnie utworzono nowy załącznik.'], [appendix[0]]);
          return;
        } catch(err) {
          response(res, true, ['Wystąpił błąd podczas próby utworzenia nowego załącznika', JSON.stringify(err)], []);
          return;
        }
      }
    });        
  });
});

router.post('/:appendixId/tags', async (req, res, next) => {
  try {
    let results = await appendixService.addTags(req.params.appendixId, req.body.tags.split(','));
    response(res, false, ['Pomyślnie dodano tagi do załącznika.'], results);    
  } catch(err) {
    response(res, true, ['Wystąpił błąd podczas próby dodania tagów do załącznika', JSON.stringify(err)], []);    
  }   
});

router.delete('/:appendixId', async (req, res, next) => {  
  try {
    await appendixService.delete(req.params.appendixId);
    response(res, false, ['Pomyślnie usunięto załącznik.']);    
  } catch(err) {
    response(res, true, ['Wystąpił błąd podczas próby usunięcia załącznika', JSON.stringify(err)], []);    
  }  
});

router.delete('/tag/:appendixId/:tagId', async (req, res, next) => {  
  try {
    await appendixService.deleteTag(req.params.appendixId, req.params.tagId);
    response(res, false, ['Pomyślnie usunięto tag do załącznika.']);    
  } catch(err) {
    response(res, true, ['Wystąpił błąd podczas próby usunięcia tagu do załącznika', JSON.stringify(err)], []);    
  }  
});

module.exports = router;