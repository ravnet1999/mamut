const express = require('express');
const router = express.Router();
const userClientService = require('../src/services/UserClientService');
const response = require('../src/response');

router.get('/findByPhone/:phoneNumber', (req, res, next) => {
  let phoneNumber = req.params.phoneNumber;
  userClientService.findByPhoneNumber(phoneNumber).then((users) => {
      response(res, false, ['Pomyślnie pobrano użytkownika za pomocą numeru komórkowego.'], users);
      return;
  }).catch((err) => {
      response(res, true, ['Wystąpił błąd podczas próby pobrania użytkownika za pomocą numeru komórkowego.', JSON.stringify(err)], []);
      return;
  })
});

module.exports = router;