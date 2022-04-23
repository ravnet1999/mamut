const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const jwtAuthMiddleware = require('../middleware/jwtAuth');
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

let appendixRoute = async (req, res, next) => { 
  let appendix;

  try{
    appendix = await appendixService.get(req.params.appendixId);
        
    if(!appendix) throw "Wystąpił błąd poczas próby pobrania z translatora informacji o załączniku.";
  } catch (err) {
    console.log(err);
    let newFileName = encodeURIComponent("błąd pobierania");
    res.writeHead(200, {
      'Content-Description': 'File Transfer',    
      'Content-Disposition': `attachment;filename*=UTF-8\'\'${newFileName}`,
      'Content-Type': 'application/octet-stream',
      'Expires': 0,
      'Cache-Control': 'must-revalidate',
      'Pragma': 'public',
      'Set-Cookie': `appendixDownloaded${appendix.id}=false; path=/; max-age=3600`
    });
    return res.end("Wystąpił błąd poczas próby pobrania z translatora informacji o załączniku.");
  }

  let originalFilename = appendix['nazwa_oryginalna'];
  
  let path = appendix['sciezka'];

  fs.readFile(path, function(err, data) {
    if (err) {
      console.log(err);
      let newFileName = encodeURIComponent("błąd pobierania");
      res.writeHead(200, {
        'Content-Description': 'File Transfer',    
        'Content-Disposition': `attachment;filename*=UTF-8\'\'${newFileName}`,
        'Content-Type': 'application/octet-stream',
        'Expires': 0,
        'Cache-Control': 'must-revalidate',
        'Pragma': 'public',
        'Set-Cookie': `appendixDownloaded${appendix.id}=false; path=/; max-age=3600`
      });
      return res.end("Wystąpił błąd poczas próby wczytania załącznika z pliku.");
    }

    // let mimeType = appendix['typ_mime'];
    // res.writeHead(200, {'Content-Disposition': `attachment; filename="${originalFilename}`, 'Content-Type': mimeType});

    let newFileName = encodeURIComponent(originalFilename);

    res.writeHead(200, {
      'Content-Description': 'File Transfer',    
      'Content-Disposition': `attachment;filename*=UTF-8\'\'${newFileName}`, 
      'Content-Type': 'application/octet-stream',
      'Content-Transfer-Encoding': 'binary',
      'Expires': 0,
      'Cache-Control': 'must-revalidate',
      'Pragma': 'public',
      'Content-Length': `${appendix.rozmiar}`,
      'Set-Cookie': `appendixDownloaded${appendix.id}=true; path=/; max-age=3600`
    });

    res.end(data);
  });
}

router.get('/:appendixId/file', [authMiddleware], appendixRoute);

router.get('/:appendixId/file/jwt', [jwtAuthMiddleware], appendixRoute);

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

router.delete('/:appendixId', [authMiddleware], async (req, res, next) => {
  try{
    await appendixService.delete(req.params.appendixId);    
    response(res, false, ['Pomyślnie usunięto załącznik.'], []);  
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby usunięcia załącznika.', JSON.stringify(err)], []);
    return;
  }
});

router.post('/:appendixId/tags', [authMiddleware], async(req, res, next) => {
  try{
    await appendixService.addTags(req.params.appendixId, req.body.tags);    
    response(res, false, ['Pomyślnie dodano tagi do załącznika.'], []);  
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby dodania tagów do załącznika.', JSON.stringify(err)], []);
  } 
});

router.delete('/:appendixId/tag/:tagId', [authMiddleware], async (req, res, next) => {
  try{
    await appendixService.deleteTag(req.params.appendixId, req.params.tagId);    
    response(res, false, ['Pomyślnie usunięto tag do załącznika.'], []);  
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby usunięcia tagu do załącznika.', JSON.stringify(err)], []);
    return;
  }
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
