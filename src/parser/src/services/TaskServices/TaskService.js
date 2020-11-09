const axios = require('axios');
const parseResponse = require('../../ResponseParser');
const appConfig = require('../../../config/appConfig.json');

class TaskService {
    getTasks = (limit = 25, offset = 0, status = '', operatorId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/tasks/${operatorId}/${limit}/${offset}/${status}`).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response.resources);
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

    getTaskById = (taskId, operatorId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/tasks/${operatorId}/${taskId}`).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response.resources);
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

    createTask = (taskObject) => {
        return new Promise((resolve, reject) => {
            axios.put(`${appConfig.URLs.translator}/tasks/`, taskObject).then((response) => {
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

    startTask = (taskId, operatorId) => {
        return new Promise((resolve, reject) => {
            axios.post(`${appConfig.URLs.translator}/tasks/${taskId}/start`, {
                operatorId: operatorId
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

    stopTask = (taskId, operatorId) => {
        return new Promise((resolve, reject) => {
            axios.post(`${appConfig.URLs.translator}/tasks/${taskId}/stop`, {
                operatorId: operatorId
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

    reassignTask = (taskId, reassignObject) => {
        return new Promise((resolve, reject) => {
            axios.post(`${appConfig.URLs.translator}/tasks/${taskId}/reassign`, reassignObject).then((response) => {
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
}

module.exports = new TaskService();