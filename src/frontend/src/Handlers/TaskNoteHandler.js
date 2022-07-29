import axios from 'axios';
import parseResponse from './ApiParser';
import appConfig from '../Config/appConfig.json';

const TaskNoteHandler = {  
  create: (taskId, note) => {
    return new Promise((resolve, reject) => {
        axios.post(`${appConfig.URLs.domain}/${appConfig.URLs.notes}/${taskId}`, {note}, {
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

  getNotesByTaskId: (taskId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.notes}/task/${taskId}`, {
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

  getNoteTypes: () => {
    return new Promise((resolve, reject) => {
      axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.notes}/types`, {
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

  update: (noteId, note) => {
    return new Promise((resolve, reject) => {
        axios.put(`${appConfig.URLs.domain}/${appConfig.URLs.notes}/${noteId}`, {note}, {
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

  remove: (noteId) => {
    return new Promise((resolve, reject) => {
      if(noteId === 0) {
        resolve();
      }

      axios.delete(`${appConfig.URLs.domain}/notes/${noteId}`, {}, {
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

export default TaskNoteHandler;