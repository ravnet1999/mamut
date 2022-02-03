const express = require('express');
const router = express.Router();
const userClientService = require('../src/services/UserClientService');
const response = require('../src/response');

router.get('/search/:text', (req, res, next) => {
  let text = req.params.text;
  userClientService.search(text).then((users) => {
      response(res, false, ['Pomyślnie pobrano użytkownika za pomocą numeru komórkowego.'], users);
      return;
  }).catch((err) => {
      response(res, true, ['Wystąpił błąd podczas próby pobrania użytkownika za pomocą numeru komórkowego.', JSON.stringify(err)], []);
      return;
  })
});

module.exports = router;