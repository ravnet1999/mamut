const appConfig = require('../../config/appConfig.json');
const axios = require('axios');
const parseResponse = require('../ResponseParser');

class TagService {
  get = (typeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${appConfig.URLs.translator}/tags/${typeId}`).then((response) => {        
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

  search = (typeId, query) => {
    return new Promise((resolve, reject) => {
      axios.get(`${appConfig.URLs.translator}/tags/search/${typeId}/${query}`).then((response) => {        
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

module.exports = new TagService();