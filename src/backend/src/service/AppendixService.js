const appConfig = require('../../config/appConfig.json');

const multiparty = require('multiparty');
const fs = require('fs');

const axios = require('axios');
var concat = require('concat-stream');
var FormData = require('form-data');

const parseResponse = require('../ResponseParser');

class AppendixService {
  create = (taskId, req, res) => {
    var form = new multiparty.Form({maxFieldsSize: 2097152000});

    return new Promise((resolve, reject) => {  
      form.on('error', function(err) {
        return reject(err);
      });

      form.parse(req, function(err, fields, files) {
        if(files) {
          let file = Object.values(files)[0][0];

          fs.createReadStream(file.path).pipe(concat({ encoding: 'buffer' }, function (data) {
            var formData = new FormData();
            formData.append("filename", file.originalFilename);
            formData.append("contentType", file.headers["content-type"]);
            formData.append("size", file.size);
            formData.append("data", data);

            axios.post(`${appConfig.URLs.translator}/appendices/${taskId}`, formData, {
              headers: formData.getHeaders()
            }).then((response) => {
              parseResponse(response).then((result) => {
                return resolve({ resources: result });      
              }).catch((err) => {
                return reject(err);                  
              });
            }).catch((err) => {
              return reject({
                  message: 'Wystąpił problem z połączeniem z translatorem.'
              });
            });
          }))
        }
      });        
    });
  }
}

module.exports = new AppendixService();