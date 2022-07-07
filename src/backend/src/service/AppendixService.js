const appConfig = require('../../config/appConfig.json');

const fs = require('fs');
const fsExtra = require('fs-extra');
const sharp = require("sharp");
const path = require('path');

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

  compressImages = (contentType, fileBasename, fileExt, uploadDir, uploadPath) => {
    return new Promise((resolve, reject) => { 
      let compressedFilenameGen = (fileBasename, fileExt, fileSuffix) => {
        return fileBasename + fileSuffix + fileExt;
      }

      let compressedFilePathGen = (uploadDir, compressedFilename) => {
        return uploadDir + '/' + compressedFilename;
      }

      let fileSuffix;
      let compressionTypeName;
      let compressionParameters;

      let uploadCompressedDir = uploadDir + '/' + appConfig.tasksAppendicesUploadCompressedSubDir;

      if(!fs.existsSync(uploadCompressedDir)) {   
        fs.mkdirSync(uploadCompressedDir, null, err => {
          if(err) {
            console.log(err);
            return reject('Wystąpił problem z utworzeniem katalogu do zapisu skompresowanych załączników w formacie jpg i png.');
          }
        })
      }

      if(contentType == "image/jpeg" || contentType == "image/png"){
        if(contentType == "image/jpeg"){
          fileSuffix = '_jpg_70_mozjpeg';
          compressionTypeName = "jpeg";
          compressionParameters = { quality: 70, mozjpeg: true };        
        } else if(contentType == "image/png") { 
          fileSuffix = '_png_70';
          compressionTypeName = "png";
          compressionParameters = { quality: 70};
        }

        let compressedFilename = compressedFilenameGen(fileBasename, fileExt, fileSuffix);
        let compressedFilePath = compressedFilePathGen(uploadCompressedDir, compressedFilename);

        sharp(uploadPath).toFormat(compressionTypeName, compressionParameters)
        .toFile(compressedFilePath).then((image) => {
          let compressedFileSize = image.size;          
          resolve({ compressedFileSize, compressionTypeName, compressionParameters, compressedFilename, compressedFilePath });
        });
      } else {
        reject();
      }
    });
  }

  sendToTranslator = (uploadPath, originalFilename, filename, fileSize, contentType, tags, taskId, resolve, reject, compressedFileData) => {
    if(compressedFileData) console.log(compressedFileData);
    
    fs.createReadStream(uploadPath).on('error', function(err) {
      console.log(err);
      return reject('Wystąpił problem z utworzeniem strumienia do odczytu pliku załącznika.');
    }).pipe(concat({ encoding: 'buffer' }, function (data) {
      var formData = new FormData();
      formData.append("originalFilename", originalFilename);
      formData.append("filename", filename);
      formData.append("path", uploadPath);
      formData.append("size", fileSize);
      formData.append("contentType", contentType);
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
    }));
  }

  create = (taskId, file, tags) => {
    let ref = this;

    return new Promise((resolve, reject) => { 
      let uploadDir = appConfig.tasksAppendicesUploadDir + '/' + taskId;
      let originalFilename = file.originalFilename;
      let filename = Date.now() + '-' + originalFilename;
      let uploadPath = uploadDir + '/' + filename;
      let filePath = file.path;
      let fileSize = file.size;
      let contentType = file.headers["content-type"];
      let fileExt =  path.extname(uploadPath);
      let fileBasename = path.basename(filename, fileExt);

      if(!fs.existsSync(uploadDir)) {   
        fs.mkdirSync(uploadDir, {'recursive': true}, err => {
          if(err) {
            console.log(err);
            return reject('Wystąpił problem z utworzeniem katalogu do zapisu załączników.');
          }
        })
      }

      try{       
        fsExtra.moveSync(filePath, uploadPath);
      } catch(err) {
        console.log(err);
        return reject('Wystąpił problem z przeniesieniem załącznika do katalogu docelowego.');
      }

      ref.compressImages(contentType, fileBasename, fileExt, uploadDir, uploadPath).then(
        compressedFileData => {
          ref.sendToTranslator(uploadPath, originalFilename, filename, fileSize, contentType, tags, taskId, resolve, reject, compressedFileData);
        }
      ).catch(() => {
        ref.sendToTranslator(uploadPath, originalFilename, filename, fileSize, contentType, tags, taskId, resolve, reject);
      });
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