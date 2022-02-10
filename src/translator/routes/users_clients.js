const express = require('express');
const router = express.Router();
const userClientService = require('../src/services/UserClientService');
const response = require('../src/response');

router.get('/search/:text', (req, res, next) => {
  let text = decodeURIComponent(req.params.text);
  userClientService.search(text).then((users) => {
      response(res, false, ['Pomyślnie pobrano użytkownika za pomocą numeru komórkowego.'], users);
      return;
  }).catch((err) => {
      response(res, true, ['Wystąpił błąd podczas próby wyszukania użytkownika.', JSON.stringify(err)], []);
      return;
  })
});

router.get('/user/:userId', (req, res, next) => {
  userClientService.findByUserId(req.params.userId).then((users) => {
      response(res, false, ['Pomyślnie pobrano użytkownika za pomocą numeru komórkowego.'], users);
      return;
  }).catch((err) => {
      response(res, true, ['Wystąpił błąd podczas próby wyszukania użytkownika.', JSON.stringify(err)], []);
      return;
  })
});

module.exports = router;