const express = require('express');
const router = express.Router();
const response = require('../src/response');
const helpers = require('../src/tasks/helpers');
const taskEpisodeService = require('../src/services/Task/TaskEpisodeService');

router.get('/last/:taskId', (req, res, next) => {
    taskEpisodeService.find(1, 0, 'id', 'DESC', '`id_zgloszenia` = \'' + req.params.taskId + '\' ').then((taskEpisode) => {
        response(res, false, ['Pomyślnie pobrano ostatni etap zadania.'], taskEpisode);
        return;
    });
});

router.get('/all/:taskId', (req, res, next) => {
    taskEpisodeService.find(9999, 0, 'id', 'DESC', '`id_zgloszenia` = \'' + req.params.taskId + '\' ').then((taskEpisodes) => {
        response(res, false, ['Pomyślnie pobrano etapy zadania.'], taskEpisodes);
        return;
    });
});

router.patch('/:episodeId/description', (req, res, next) => {
    taskEpisodeService.updateById(req.params.episodeId, ['rozwiazanie'], [req.body.description]).then((taskEpisode) => {
        response(res, false, ['Pomyślnie pobrano ostatni etap zadania.'], taskEpisode);
        return;
    });
});

module.exports = router;