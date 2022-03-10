const appConfig = require('../../config/appConfig.json');

const fs = require('fs');

const axios = require('axios');
var concat = require('concat-stream');
var FormData = require('form-data');

const parseResponse = require('../ResponseParser');

class AppendixService {
  create = (taskId, file) => {
    return new Promise((resolve, reject) => { 
      fs.createReadStream(file.path).pipe(concat({ encoding: 'buffer' }, function (data) {
        var formData = new FormData();
        formData.append("filename", file.originalFilename);
        formData.append("contentType", file.headers["content-type"]);
        formData.append("size", file.size);
        formData.append("data", data);

        axios({
          method: 'post',
          url: `${appConfig.URLs.translator}/appendices/${taskId}`,
          data: formData,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          // headers: {'Content-Type': 'multipart/form-data;boundary=' + formData.getBoundary()}
          headers: formData.getHeaders()
        })
        // axios.post(`${appConfig.URLs.translator}/appendices/${taskId}`, formData, {
        //   headers: formData.getHeaders()
        // })
        .then((response) => {
          parseResponse(response).then((result) => {
            return resolve({ resources: result });      
          }).catch((err) => {
            return reject(err);                  
          });
        }).catch((err) => {
          console.log(err)
          return reject({
              message: 'Wystąpił problem z połączeniem z translatorem.'
          });
        });
      }))
    })
  }
}

module.exports = new AppendixService();