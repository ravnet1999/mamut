const appConfig = require('../../config/appConfig.json');
const axios = require('axios');
const parseResponse = require('../ResponseParser');

class TaskNoteService {
  create = (taskId, note) => {
    return new Promise((resolve, reject) => {
      axios.post(`${appConfig.URLs.translator}/notes/${taskId}`, { note }).then((response) => {  
          console.log(response);   
          parseResponse(response).then((response) => {            
            resolve(response.resources[0]);
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

  get = (noteId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${appConfig.URLs.translator}/notes/${noteId}`).then((response) => {   
        console.log(response);     
          parseResponse(response).then((response) => {
            resolve(response.resources[0]);
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

  getByTaskId = taskId => {
    return new Promise((resolve, reject) => {
      axios.get(`${appConfig.URLs.translator}/notes/task/${taskId}`).then((response) => {        
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

  getByNoteTypeId = (noteTypeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${appConfig.URLs.translator}/notes/type/${noteTypeId}`).then((response) => {        
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

  getByTaskIdNoteTypeId = (taskId, noteTypeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${appConfig.URLs.translator}/notes/task/${taskId}/type/${noteTypeId}`).then((response) => {        
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

  getNoteTypes = () => {
    return new Promise((resolve, reject) => {
      axios.get(`${appConfig.URLs.translator}/notes/types`).then((response) => {        
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

  update = (noteId, note) => {
    return new Promise((resolve, reject) => {
      axios.put(`${appConfig.URLs.translator}/notes/${noteId}`, { note }).then((response) => {  
          console.log(response);   
          parseResponse(response).then((response) => {            
            resolve(response.resources[0]);
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

  delete = (noteId) => {
    return new Promise((resolve, reject) => {
      axios.delete(`${appConfig.URLs.translator}/notes/${noteId}`).then((response) => {        
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
}

module.exports = new TaskNoteService();