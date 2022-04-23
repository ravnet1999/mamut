import axios from 'axios';
import parseResponse from './ApiParser';
import appConfig from '../Config/appConfig.json';

const AppendixHandler = {
  getByTaskId: (taskId) => {
    return new Promise((resolve, reject) => {
        axios.get(`${appConfig.URLs.domain}/${appConfig.URLs.appendices}/task/${taskId}`, {
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

  delete: (appendixId) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendixId}`, {
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

  deleteTag: (appendixId, tagId) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendixId}/tag/${tagId}`, {
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

  addTags: (appendixId, tags) => {
    return new Promise((resolve, reject) => {
        axios.post(`${appConfig.URLs.domain}/${appConfig.URLs.appendices}/${appendixId}/tags`, {
          tags
        },
        {
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

export default AppendixHandler;