import axios from 'axios';
import parseResponse from '../Handlers/ApiParser';
import appConfig from '../Config/appConfig.json';

const TaskHandler = {
    getTaskById: (taskId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.tasks}/${taskId}`, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },
    getTasks: (general = false) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.tasks}/${general ? 'general' : ''}`, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },

    getTaskDetails: (taskId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.tasks}/details/${taskId}`, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },

    stopTask: (taskId) => {
        return new Promise((resolve, reject) => {
            axios.post(`${appConfig.URLs.domain}/${appConfig.URLs.tasks}/${taskId}/stop`, {}, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },

    awaitTask: (taskId, type, description) => {
        return new Promise((resolve, reject) => {
            axios.post(`${appConfig.URLs.domain}/${appConfig.URLs.tasks}/${taskId}/await/${type}`, {
                description: description
            }, {
                withCredentials: true
            }).then((response) => {
                console.log('task handler recieved description: ', description);
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },

    startTask: (taskId) => {
        return new Promise((resolve, reject) => {
            axios.post(`${appConfig.URLs.domain}/${appConfig.URLs.tasks}/${taskId}/start`, {}, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },

    closeTask: (taskId) => {
        return new Promise((resolve, reject) => {
            axios.post(`${appConfig.URLs.domain}/${appConfig.URLs.tasks}/${taskId}/close`, {}, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },

    createTask: (clientId, repId) => {
        return new Promise((resolve, reject) => {
            axios.put(`${appConfig.URLs.domain}/${appConfig.URLs.tasks}/${clientId}/${repId}`, {}, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },

    patchTask: (taskId, taskObject) => {
        return new Promise((resolve, reject) => {
            axios.patch(`${appConfig.URLs.domain}/${appConfig.URLs.tasks}/${taskId}`, taskObject, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },

    reassignTask: (taskId, operatorId, takeOver = false) => {
        return new Promise((resolve, reject) => {
            let reassignObject = {
                operatorId: operatorId
            }

            if(operatorId === 0) reassignObject.departmentId = 0;

            console.log(reassignObject);

            axios.post(`${appConfig.URLs.domain}/${appConfig.URLs.tasks}/${taskId}/reassign/${takeOver ? 'true' : ''}`, reassignObject, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },

    getEpisodes: (taskId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.tasks}/${taskId}/episodes`, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },

    updateTaskDescription: (taskId, description) => {
        return new Promise((resolve, reject) => {
            axios.patch(`${appConfig.URLs.domain}/tasks/${taskId}/description`, { description: description }, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },

    updateLastEpisodeDescription: (episodeId, description) => {
        return new Promise((resolve, reject) => {
            axios.patch(`${appConfig.URLs.domain}/tasks/${episodeId}/lastEpisodeDescription`, { description: description }, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },

    updateEpisodeTravel: (episodeId, travel) => {
        return new Promise((resolve, reject) => {
            axios.patch(`${appConfig.URLs.domain}/tasks/${episodeId}/travel`, { travel: travel }, {
                withCredentials: true
            }).then((response) => {
                parseResponse(response).then((response) => {
                    resolve(response);
                    return;
                }).catch((err) => {
                    reject(err);
                    return;
                });
            }).catch((err) => {
                reject({
                    error: true,
                    messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                    resources: []
                });
                return;
            });
        });
    },

    addAppendices: (taskId, formData, tags) => {
      return new Promise((resolve, reject) => {
          axios.post(`${appConfig.URLs.domain}/appendices/${taskId}`, formData, {
              withCredentials: true
          }).then((response) => {
              parseResponse(response).then((response) => {
                  resolve(response);
                  return;
              }).catch((err) => {
                  reject(err);
                  return;
              });
          }).catch((err) => {
              reject({
                  error: true,
                  messages: ['Wystąpił problem z połączeniem z serwerem.', JSON.stringify(err)],
                  resources: []
              });
              return;
          });
      });
  }
}

export default TaskHandler;