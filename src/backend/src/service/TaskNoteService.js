const appConfig = require('../../config/appConfig.json');
const axios = require('axios');
const parseResponse = require('../ResponseParser');

class TaskNoteService {
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
}

module.exports = new TaskNoteService();