const express = require('express');
const router = express.Router();
const response = require('../src/response');
const helpers = require('../src/tasks/helpers');
const taskEpisodeService = require('../src/services/Task/TaskEpisodeService');
const charset = require('../src/helpers/charset');

router.get('/last/:taskId', (req, res, next) => {
    taskEpisodeService.find(1, 0, 'id', 'DESC', '`id_zgloszenia` = \'' + req.params.taskId + '\' ').then((taskEpisode) => {
        taskEpisode = taskEpisode.map((taskEp) => {
            return charset.translateIn(taskEp);
        });
        response(res, false, ['Pomyślnie pobrano ostatni etap zadania.'], taskEpisode);
        return;
    });
});

router.get('/all/:taskId', (req, res, next) => {
    taskEpisodeService.find(9999, 0, 'id', 'DESC', '`id_zgloszenia` = \'' + req.params.taskId + '\' ').then((taskEpisodes) => {
        taskEpisodes = taskEpisodes.map((taskEpisode) => {
            return charset.translateIn(taskEpisode);
        });
        response(res, false, ['Pomyślnie pobrano etapy zadania.'], taskEpisodes);
        return;
    });
});

router.patch('/:episodeId/description', (req, res, next) => {
    let translate = {
        description: req.body.description
    };

    let description = charset.translateOut(translate).description;

    taskEpisodeService.updateById(req.params.episodeId, ['rozwiazanie'], [description]).then((taskEpisode) => {
        response(res, false, ['Pomyślnie pobrano ostatni etap zadania.'], taskEpisode);
        return;
    });
});

router.patch('/:episodeId/travel', (req, res, next) => {

    taskEpisodeService.updateById(req.params.episodeId, ['forma_interwencji'], [req.body.travel ? req.body.travel : 0]).then((taskEpisode) => {
        response(res, false, ['Pomyślnie pobrano ostatni etap zadania.'], taskEpisode);
        return;
    });
});

module.exports = router;