const appConfig = require('../../config/appConfig.json');

const fs = require('fs');
const fsExtra = require('fs-extra');
const { createGzip } = require('zlib');
const { pipeline } = require('stream');

const axios = require('axios');
var concat = require('concat-stream');
var FormData = require('form-data');

const parseResponse = require('../ResponseParser');


class AppendixService {
  get = (appendicesIds) => {
    return new Promise((resolve, reject) => {
      axios.get(`${appConfig.URLs.translator}/appendices/${appendicesIds}`).then((response) => {        
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

  sendToTranslator = (uploadPath,originalFilename, filename, compressedSize, file, taskId, tags, resolve, reject) => {
    fs.createReadStream(uploadPath).on('error', function(err) {
      console.log(err);
      return reject('Wystąpił problem z utworzeniem strumienia do odczytu pliku załącznika.');
    }).pipe(concat({ encoding: 'buffer' }, function (data) {
      var formData = new FormData();
      formData.append("originalFilename", originalFilename);
      formData.append("filename", filename);
      formData.append("path", uploadPath);
      // TODO
      // formData.append("size", file.size);
      formData.append("size", compressedSize);
      formData.append("contentType", file.headers["content-type"]);
      formData.append("contentEncoding", 'gzip');
      formData.append("tags", JSON.stringify(tags));
      // formData.append("data", data);                  

      axios({
        method: 'post',
        url: `${appConfig.URLs.translator}/appendices/${taskId}`,
        data: formData,
        // maxContentLength: Infinity,
        // maxBodyLength: Infinity,
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
          console.log(err);
          return reject(err);                  
        });
      }).catch((err) => {
        console.log(err);
        return reject('Wystąpił problem z połączeniem z translatorem.');
      });
    }))
  };

  create = (taskId, file, tags) => {
    let ref = this;

    return new Promise((resolve, reject) => { 
      let uploadDir = appConfig.tasksAppendicesUploadDir + '/' + taskId;
      let originalFilename = file.originalFilename + '.gz';
      let filename = Date.now() + '-' + originalFilename;
      let uploadPath = uploadDir + '/' + filename;
      
      if(!fs.existsSync(uploadDir)) {   
        fs.mkdirSync(uploadDir, {'recursive': true}, err => {
          if(err) {
            console.log(err);
            return reject('Wystąpił problem z utworzeniem katalogu do zapisu załączników.');
          }
        })
      }

      try{        
        const gzip = createGzip();
        const source = fs.createReadStream(file.path);        
        const destination = fs.createWriteStream(uploadPath);

        var compressedSize = 0;

        gzip.on('data', function(data) {
          compressedSize += data.length;
        }); 

        pipeline(source, gzip, destination, (err) => {
          if (err) {
            console.error('An error occurred:', err);
            process.exitCode = 1;
          }    
          ref.sendToTranslator(uploadPath, originalFilename, filename, compressedSize, file, taskId, tags, resolve, reject);     
        });              
      } catch(err) {
        console.log(err);
        return reject('Wystąpił problem z przeniesieniem załącznika do katalogu docelowego.');
      }
    });
  }

  

  delete = (appendixId) => {
    return new Promise(async(resolve, reject) => {
      let appendix = await this.get(appendixId);
      let uploadPath = appendix.sciezka;

      fs.unlink(uploadPath, err => {
        if(err) {
          console.log(err);
        }

        axios.delete(`${appConfig.URLs.translator}/appendices/${appendixId}`).then((response) => {        
          parseResponse(response).then((response) => {            
            resolve(`Pomyślnie usunięto plik załącznika ${uploadPath}.`);
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
    });
  }

  addTags = (appendixId, tags) => {
    return new Promise(async(resolve, reject) => {
      axios.post(`${appConfig.URLs.translator}/appendices/${appendixId}/tags`, {
        tags
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

  deleteTag = (appendixId, tagId) => {
    return new Promise(async(resolve, reject) => {
      axios.delete(`${appConfig.URLs.translator}/appendices/tag/${appendixId}/${tagId}`).then((response) => {        
        parseResponse(response).then((response) => {            
          resolve(`Pomyślnie usunięto tag do załącznika.`);
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
      axios.get(`${appConfig.URLs.translator}/appendices/task/${taskId}`).then((response) => {        
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

module.exports = new AppendixService();