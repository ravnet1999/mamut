const appConfig = require('../../config/appConfig.json');

const fs = require('fs');

const axios = require('axios');
var concat = require('concat-stream');
var FormData = require('form-data');

const parseResponse = require('../ResponseParser');

class AppendixService {
  create = (taskId, file) => {
    return new Promise((resolve, reject) => { 
      let uploadDir = appConfig.tasksAppendicesUploadDir + '/' + taskId;
      let filename = Date.now() + '-' + file.originalFilename;
      let uploadPath = uploadDir + '/' + filename;
      
      if(!fs.existsSync(uploadDir)) {   
        fs.mkdirSync(uploadDir, {'recursive': true}, err => {
          if(err) {
            return reject({
              message: 'Wystąpił problem z utworzeniem katalogu do zapisu załączników.'
            });
          }
        })
      }
       
      fs.copyFileSync(file.path, uploadPath), err => {
        if(err) {
          return reject({
            message: 'Wystąpił problem z przeniesieniem załącznika do katalogu docelowego.'
          });
        }
      }

      fs.createReadStream(uploadPath).pipe(concat({ encoding: 'buffer' }, function (data) {
        var formData = new FormData();
        formData.append("filename", filename);
        formData.append("path", uploadPath);
        formData.append("size", file.size);
        formData.append("contentType", file.headers["content-type"]);
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