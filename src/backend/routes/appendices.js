const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const appendixService = require('../src/service/AppendixService');
const multiparty = require('multiparty');
const appConfig = require('../config/appConfig.json');
const fs = require('fs');

router.post('/:taskId', [authMiddleware], (req, res, next) => {
  let taskId = req.params.taskId;

  var form = new multiparty.Form({maxFieldsSize: appConfig.maxFieldsSize});

  form.on('error', function(err) {
    response(res, true, ['Wystąpił błąd poczas próby utworzenia nowych załączników.', JSON.stringify(err)], []);
    return;
  });
    
  form.parse(req, function(err, fields, files) {
    if(files) {      
      let promises = Object.values(files).map(file => appendixService.create(taskId, file[0]))

      Promise.all(promises).then((results) => {
        response(res, false, ['Pomyślnie utworzono nowe załączniki.'], results.map(result => result.resources.resources[0]));
      }).catch((err) => {
          response(res, true, ['Wystąpił błąd poczas próby utworzenia nowych załączników.', JSON.stringify(err)], []);
      });
    }
  });
});

router.get('/:appendixId/file', [authMiddleware], async (req, res, next) => { 
  let appendix;

  try{
    appendix = await appendixService.get(req.params.appendixId);
        
    if(!appendix) throw "Wystąpił błąd podczas próby pobrania załącznika z translatora";
  } catch (err) {
    console.log(err);
    res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
    return res.end("Wystąpił błąd poczas próby pobrania załącznika");
  }

  let originalFilename = appendix['nazwa_oryginalna'];
  
  let path = appendix['sciezka'];

  fs.readFile(path, function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
      return res.end("Wystąpił błąd poczas próby pobrania załącznika");
    }

    // let mimeType = appendix['typ_mime'];
    // res.writeHead(200, {'Content-Disposition': `attachment; filename="${originalFilename}`, 'Content-Type': mimeType});

    res.writeHead(200, {
      'Content-Description': 'File Transfer',    
      'Content-Disposition': `attachment; filename="${originalFilename}`, 
      'Content-Type': 'application/octet-stream',
      'Content-Transfer-Encoding': 'binary',
      'Expires': 0,
      'Cache-Control': 'must-revalidate',
      'Pragma': 'public',
      'Content-Length': `${appendix.rozmiar}`
    });

    res.end(data);
  });
});

router.get('/:appendixId/json', [authMiddleware], async (req, res, next) => { 
  let appendix;

  try{
    appendix = await appendixService.get(req.params.appendixId);
    
    if(!appendix) response(res, true, ['Wystąpił błąd poczas próby pobrania z translatora informacji o załączniku.'], []);  
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby pobrania z translatora informacji o załączniku.', JSON.stringify(err)], []);
    return;
  }

  let path = appendix['sciezka'];

  fs.readFile(path, function(err, data) {
    if (err) {
      console.log(err);
      response(res, true, ['Wystąpił błąd poczas próby pobrania z translatora informacji o załączniku.', JSON.stringify(err)], []);
      return;
    }

    appendix['data'] = data;
    response(res, false, ['Pomyślnie pobrano informacje o załączniku.'], appendix); 
  });
});

router.get('/task/:taskId', [authMiddleware], async (req, res, next) => { 
  try{
    results = await appendixService.getByTaskId(req.params.taskId); 
    response(res, false, ['Pomyślnie pobrano informacje o załącznikach dla zadania.'], results);   
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby pobrania z translatora informacji o załącznikach dla zadania.', JSON.stringify(err)], []);
  }
});

module.exports = router;
