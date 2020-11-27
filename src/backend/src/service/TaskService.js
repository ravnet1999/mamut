const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');
const mailer = require('../classess/Mailer');

class TaskService {
    getTasks = (limit = 25, offset = 0, status = '', departmentId, operatorId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/tasks/${departmentId}/${operatorId}/${limit}/${offset}/${status}`).then((response) => {
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

    closeTask = (taskId, operatorId) => {
        return new Promise((resolve, reject) => {
            axios.post(`${appConfig.URLs.translator}/tasks/${taskId}/close`, {
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
                    console.log(response);
                    resolve(response);
                    return;
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject(err);
                return;
            });
        });   
    }

    notifyReassign = (task, rep, company, episodes, operatorFrom, operatorTo) => {
        let subject =  `Przekazano ci zadanie ${task.id}.`;
        let message = `${operatorFrom.imie} ${operatorFrom.nazwisko} przekazał Ci zadanie ${task.id}.[lineBreak][lineBreak]`;
        message += `Dotyczy ono:[lineBreak][lineBreak]`;
        message += `Klient: ${company.nazwa}[lineBreak]`;
        message += `Użytkownik: ${rep.imie} ${rep.nazwisko}[lineBreak]`
        message += `Telefon: ${rep.tel_komorkowy}[lineBreak]`;
        message += `Email: ${rep.adres_email}.[lineBreak][lineBreak]`;
        message += `Użytkownik zgłosił problem:[lineBreak]${task.opis}.[lineBreak][lineBreak]`;
        message += `Etapy, które wykonano:[lineBreak][lineBreak]${episodes.map((episode, key) => {
            return `Etap ${episodes.length - key}: ${episode.rozwiazanie}.`
        }).join('[lineBreak][lineBreak]')}`;

        console.log(message.replace(/\[lineBreak\]/g, '<br />'));

        mailer.send(mailer.getConfig().from, operatorTo.adres_email, subject, message.replace(/\[lineBreak\]/g, '\r\n'), message.replace(/\[lineBreak\]/g, '<br />'));
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

    updateDescription = (taskId, description) => {
        return new Promise((resolve, reject) => {
            axios.patch(`${appConfig.URLs.translator}/tasks/${taskId}/description`, {
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

    updateLastEpisodeDescription = (episodeId, description) => {
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

    updateEpisodeTravel = (episodeId, travel) => {
        return new Promise((resolve, reject) => {
            axios.patch(`${appConfig.URLs.translator}/episodes/${episodeId}/travel`, {
                travel: travel
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

module.exports = new TaskService();