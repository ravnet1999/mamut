const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const response = require('../src/response');
const tagService = require('../src/service/TagService.js');

router.get('/search/:typeId/:query', [], async (req, res, next) => { 
  try{
    let results = await tagService.search(req.params.typeId, req.params.query); 
    response(res, false, ['Pomyślnie pobrano informacje o tagach.'], results);   
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby pobrania z translatora informacji o tagach.', JSON.stringify(err)], []);
  }
});

router.get('/:typeId', [], async (req, res, next) => { 
  try{
    let results = await tagService.get(req.params.typeId); 
    response(res, false, ['Pomyślnie pobrano informacje o tagach.'], results);   
  } catch (err) {
    console.log(err);
    response(res, true, ['Wystąpił błąd poczas próby pobrania z translatora informacji o tagach.', JSON.stringify(err)], []);
  }
});

module.exports = router;
