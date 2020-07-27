const express = require('express');
const router = express.Router();
const channelService = require('../src/services/ChannelService');
const response = require('../src/response');

router.get('/:channelId', (req, res, next) => {
    channelService.findById(req.params.channelId).then((channel) => {
        response(res, false, ['Pomyślnie pobrano kanał.'], [channel]);
        return;
    }).catch((err) => {
        response(res, true, [`Wystąpił błąd podczas próby pobrania kanału.`, JSON.stringify(err)], [])
    });
});

module.exports = router;