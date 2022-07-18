const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const jwtAuthMiddleware = require('../middleware/jwtAuth');
const response = require('../src/response');
const appendixService = require('../src/service/AppendixService');
const multiparty = require('multiparty');
const appConfig = require('../config/appConfig.json');
const fs = require('fs');
const { createGunzip, createBrotliDecompress } = require('zlib');
const { pipeline } = require('stream');

let createAppendixRoute = (req, res, next) =>{
  let taskId = req.params.taskId;

  var form = new multiparty.Form({maxFieldsSize: appConfig.maxFieldsSize});

  form.on('error', function(err) {
    response(res, true, ['Wystąpił błąd poczas próby utworzenia nowych załączników.', JSON.stringify(err)], []);
    return;
  });
    
  form.parse(req, function(err, fields, files) {
    if(files) {      
      let tags = fields.tags;

      if(!tags) {
        response(res, true, ['Nie można utworzyć załączników z pustymi tagami.'], []);
        return;
      }

      let promises = Object.values(files).map(file => appendixService.create(taskId, file[0], tags));
            
      Promise.all(promises).then((results) => {
        response(res, false, ['Pomyślnie utworzono nowe załączniki.'], results.map(result => result.resources.resources[0]));
      }).catch((err) => {
        response(res, true, ['Wystąpił błąd poczas próby utworzenia nowych załączników.', JSON.stringify(err)], []);
      });
    }
  });
}

router.post('/:taskId', [authMiddleware], createAppendixRoute);
router.post('/jwt/:taskId', [jwtAuthMiddleware], createAppendixRoute);


let createDearchivisationObject = (archivisationType) => {
  switch(archivisationType) {
    case("zlib_brotli"): return createBrotliDecompress();
    case("zlib_gzip"): return createGunzip();
    default: return createGunzip();
  }
}

let readAppendixRoute = async (req, res, next) => { 
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

  let path = appendixService.getPath(appendix);
  let size = appendixService.getSize(appendix);  

  let newFileName = encodeURIComponent(originalFilename);

  let headers = {
    'Content-Description': 'File Transfer',    
    'Content-Disposition': `attachment;filename*=UTF-8\'\'${newFileName}`, 
    'Content-Type': 'application/octet-stream',
    'Content-Transfer-Encoding': 'binary',
    'Expires': 0,
    'Cache-Control': 'must-revalidate',
    'Pragma': 'public',
    'Content-Length': `${size}`,
    'Set-Cookie': `appendixDownloaded${appendix.id}=true; path=/; max-age=3600`
  };

  let errorFilename = 'blad pobierania';

  let errorHeaders = {
    'Content-Description': 'File Transfer',    
    'Content-Disposition': `attachment;filename*=UTF-8\'\'${errorFilename}`,
    'Content-Type': 'application/octet-stream',
    'Expires': 0,
    'Cache-Control': 'must-revalidate',
    'Pragma': 'public',
    'Set-Cookie': `appendixDownloaded${appendix.id}=false; path=/; max-age=3600`
  };

  let headersSent = false;

  let sentSuccessfulHeaders = function() {
    if(!headersSent) {
      res.writeHead(200, headers); 
      headersSent = true;
    }
  };

  let sentErrorHeaders = function(err) {
    console.log(err);
    if(!headersSent) { 
      headersSent = true;     
      res.writeHead(200, errorHeaders); 
      res.end("Wystąpił błąd poczas próby wczytania załącznika z pliku.");
    }
  };

  if(appendix['archiwizacja'] == 1) {
    let source = fs.createReadStream(path);
    let dearchivisationObject = createDearchivisationObject(appendix['archiwizacja_typ']);

    source.on('error', sentErrorHeaders);
    dearchivisationObject.on('error', sentErrorHeaders);
    dearchivisationObject.on('data', sentSuccessfulHeaders);
    
    let start = Date.now();
    pipeline(source, dearchivisationObject, res, sentErrorHeaders);
    let stop = Date.now();
    console.log(`dearchivisation time = ${(stop - start)/1000} seconds`);
  } else {
    let source = fs.createReadStream(path);
    source.on('error', sentErrorHeaders);

    source.on('open', function () {
      sentSuccessfulHeaders();
      source.pipe(res);
    });
  }
}

router.get('/:appendixId/file', [authMiddleware], readAppendixRoute);

router.get('/:appendixId/file/jwt', [jwtAuthMiddleware], readAppendixRoute);

let readAppendixJsonRoute = async (req, res, next) => { 
  let appendix;

  try{
    appendix = await appendixService.get(req.params.appendixId);
    
    if(!appendix) {
      response(res, true, ['Wystąpił błąd poczas próby pobrania z translatora informacji o załączniku.'], []);  
      return;
    }
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

    appendix['data'] = data.toString('base64');
    response(res, false, ['Pomyślnie pobrano informacje o załączniku.'], appendix); 
  });
};

router.get('/:appendixId/json', [authMiddleware], readAppendixJsonRoute);

router.get('/:appendixId/json/jwt', [jwtAuthMiddleware], readAppendixJsonRoute);

let deleteAppendixRoute = async (req, res, next) => {
  try{
    await appendixService.delete(req.params.appendixId);    
    response(res, false, ['Pomyślnie usunięto załącznik.'], []);  
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby usunięcia załącznika.', JSON.stringify(err)], []);
    return;
  }
}

router.delete('/:appendixId', [authMiddleware], deleteAppendixRoute);

router.delete('/jwt/:appendixId', [jwtAuthMiddleware], deleteAppendixRoute);

router.post('/:appendixId/tags', [authMiddleware], async(req, res, next) => {
  try{
    let result = await appendixService.addTags(req.params.appendixId, req.body.tags);    
    response(res, false, ['Pomyślnie dodano tagi do załącznika.'], result.resources);  
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
    let results = await appendixService.getByTaskId(req.params.taskId); 
    response(res, false, ['Pomyślnie pobrano informacje o załącznikach dla zadania.'], results);   
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby pobrania z translatora informacji o załącznikach dla zadania.', JSON.stringify(err)], []);
  }
});

module.exports = router;
