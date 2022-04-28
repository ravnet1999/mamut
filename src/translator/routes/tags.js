const express = require('express');
const router = express.Router();
const response = require('../src/response');
const tagService = require('../src/services/TagService');

router.get('/:typeId', (req, res, next) => {
  tagService.get(req.params.typeId).then((tags) => {   
    response(res, false, ['Pomyślnie wyszukano tagi.'], tags);
    return;
  }).catch((err) => {
      response(res, true, [`Wystąpił błąd podczas próby wyszukania tagów.`, JSON.stringify(err)], [])
  });
});

router.get('/search/:typeId/:query', (req, res, next) => {
  tagService.search(req.params.typeId, req.params.query).then((tags) => {   
    response(res, false, ['Pomyślnie wyszukano tagi.'], tags);
    return;
  }).catch((err) => {
      response(res, true, [`Wystąpił błąd podczas próby wyszukania tagów.`, JSON.stringify(err)], [])
  });
});

module.exports = router;