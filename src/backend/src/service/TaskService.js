const axios = require('axios');
const parseResponse = require('../ResponseParser');
const appConfig = require('../../config/appConfig.json');
const Mailer = require('../classess/Mailer');
let mailerReassign = new Mailer('reassign');
let mailerRegister = new Mailer('register');

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
            axios.get(`${appConfig.URLs.translator}/tasks/${taskId}`).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response.resources);
                    return;
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                    return;
                });
            }).catch((err) => {
                console.log(err);
                reject(err);
                return;
            });
        });
    }

    getTaskDetails = (taskId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/tasks/details/${taskId}`).then((response) => {
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

    awaitTask = (taskId, type, description, operatorId) => {
        return new Promise((resolve, reject) => {
            axios.post(`${appConfig.URLs.translator}/tasks/${taskId}/await/${type}`, {
                operatorId: operatorId,
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
                console.log('successful close', response);
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    console.log('close error', err);
                    reject(err);
                    return;
                });
            }).catch((err) => {
                console.log('close error', err);
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
        let message = `${operatorFrom.imie} ${operatorFrom.nazwisko} przekaza?? Ci zadanie ${task.id}.[lineBreak][lineBreak]`;
        message += `Dotyczy ono:[lineBreak][lineBreak]`;
        message += `Klient: ${company.nazwa}[lineBreak]`;
        message += `U??ytkownik: ${rep.imie} ${rep.nazwisko}[lineBreak]`
        message += `Telefon: ${rep.tel_komorkowy}[lineBreak]`;
        message += `Email: ${rep.adres_email}.[lineBreak][lineBreak]`;
        message += `U??ytkownik zg??osi?? problem:[lineBreak]${task.opis}.[lineBreak][lineBreak]`;
        message += `Etapy, kt??re wykonano:[lineBreak][lineBreak]${episodes.map((episode, key) => {
            return `Etap ${episodes.length - key}: ${episode.rozwiazanie}.`
        }).join('[lineBreak][lineBreak]')}`;
        mailerReassign.send(mailerReassign.getConfig().from, operatorTo.adres_email, subject, message.replace(/\[lineBreak\]/g, '\r\n'), message.replace(/\[lineBreak\]/g, '<br />'));
    }

    notifyStop = (task, rep, operator, startStamp) => {
        let subject =  `Zarejestrowano zg??oszenie numer: ${task.id}.`;
        let message = `Data i godzina zg??oszenia: ${startStamp.godzina}[lineBreak][lineBreak]`;
        message += `Opis problemu: ${task.opis}[lineBreak][lineBreak]`;
        message += `Informatyk obs??uguj??cy zg??oszenie: ${operator.imie} ${operator.nazwisko}[lineBreak]`;
        message += `Telefon kontaktowy: 22 869 75 00[lineBreak][lineBreak]`
        message += `Zesp????[lineBreak]`;
        message += `RavNet`;

        console.log(task, rep, operator);

        mailerRegister.send(mailerRegister.getConfig().from, rep.adres_email, subject, message.replace(/\[lineBreak\]/g, '\r\n'), message.replace(/\[lineBreak\]/g, '<br />'));
    }

    notifyClose = (task, lastEpisode, rep, operator) => {
        console.log(task, 'task contents from notifyClose');
        let subject =  `Zamkn??li??my Twoje zg??oszenie, numer: ${task.id}.`;
        let message = `Opis problemu: ${task.opis}[lineBreak][lineBreak]`;
        message += `Ostatni etap: ${lastEpisode.rozwiazanie}[lineBreak][lineBreak]`;
        message += `Informatyk zamykaj??cy zadanie: ${operator.imie} ${operator.nazwisko}.[lineBreak][lineBreak]`;
        message += `Je??li nie rozwi??zali??my Twojego problemu kliknij w <a href="mailto:support@ravnet.pl?subject=Reklamacja:%20Zadanie%20nr%20${task.id}&body=Nie%20musisz%20ju??%20nic%20pisa??.%20Kliknij%20WY??LIJ%20a%20zadanie%20zostanie%20automatycznie%20przywr??cone%20jako%20zadanie%20priorytetowe.">link</a>.[lineBreak]`;
        message += `Twoje zadanie zostanie przywr??cone i oznaczone najwy??szym priorytetem!`;
        message += `Je??li rozwi??zali??my zg??oszony problem to bardzo si?? cieszymy i ??yczymy mi??ego dnia.[lineBreak]`;
        message += `Zesp????[lineBreak]`
        message += `RavNet`;

        mailerRegister.send(mailerRegister.getConfig().from, rep.adres_email, subject, message.replace(/\[lineBreak\]/g, '\r\n'), message.replace(/\[lineBreak\]/g, '<br />'));
    }

    verifyFirstStop = (taskId, firstStopCallback, callback) => {
        this.getStamps(taskId).then((stamps) => {
            console.log('correct 1');

            console.log('stamps for stop: ', stamps);

            let startStamps = stamps.filter((stamp) => {
                return stamp.nazwa == 'START';
            });

            let awaitStamps = stamps.filter((stamp) => {
                return stamp.nazwa == 'OCZEKUJE';
            });

            let reassignStamps = stamps.filter((stamp) => {
                return stamp.nazwa == 'Zmiana przypisania';
            });

            console.log('reassign', reassignStamps);

            if(startStamps.length == 1 && reassignStamps.length == 0 && awaitStamps.length == 0) {
                if(firstStopCallback) firstStopCallback(startStamps[0]);
            }

            if(callback) callback(null);
        }).catch((err) => {
            callback(err);
        });
    }

    getStamps = (taskId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.translator}/tasks/stamps/${taskId}`).then((response) => {
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

    patchTask = (taskId, taskObject) => {
        return new Promise((resolve, reject) => {
            axios.patch(`${appConfig.URLs.translator}/tasks/${taskId}`, taskObject).then((response) => {
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