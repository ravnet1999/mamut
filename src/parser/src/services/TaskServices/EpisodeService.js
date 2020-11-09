const axios = require('axios');
const parseResponse = require('../../ResponseParser');
const appConfig = require('../../../config/appConfig.json');

class EpisodeService {
    getEpisodes = (taskId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/episodes/all/${taskId}`).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject(err);
                return;
            });
        });   
    }

    updateDescription = (episodeId, description) => {
        return new Promise((resolve, reject) => {
            axios.patch(`${appConfig.URLs.translator}/episodes/${episodeId}/description`, {
                description: description
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject(err);
                return;
            });
        });   
    }
}

module.exports = new EpisodeService();