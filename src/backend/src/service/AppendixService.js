const appConfig = require('../../config/appConfig.json');
const taskAppendicesConfig = require('../../config/taskAppendices.json');

const fs = require('fs');
const fsExtra = require('fs-extra');
const sharp = require("sharp");
const path = require('path');
const { createGzip } = require('zlib');
const { promisify } = require('util');
const { pipeline } = require('stream');
const pipelineAsync = promisify(pipeline);

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

  resizeOptions = async (metadata) => {
    let width = metadata.width;
    let height = metadata.height;

    let maxDimension = Math.max(width, height);
    let minDimension = Math.min(width, height);

    let preferredMaxDimension = taskAppendicesConfig.imgResizeMaxDimension;
    let preferredMinDimension = taskAppendicesConfig.imgResizeMinDimension;

    let ratioMaxDimension = maxDimension / preferredMaxDimension;
    let ratioMinDimension = minDimension / preferredMinDimension;

    let ratio = Math.max(ratioMaxDimension, ratioMinDimension);
    
    let options = {
      width: Math.round(width / ratio)
    };

    return options;
  }

  compressImages = async(contentType, fileBasename, fileExt, uploadDir, uploadPath) => {
    let ref = this;

    return new Promise(async(resolve, reject) => { 
      let uploadCompressedDir = uploadDir + '/' + taskAppendicesConfig.uploadCompressedSubDir;

      if(!fs.existsSync(uploadCompressedDir)) {   
        fs.mkdirSync(uploadCompressedDir, null, err => {
          if(err) {
            console.log(err);
            reject('Wystąpił problem z utworzeniem katalogu do zapisu skompresowanych załączników w formacie jpg i png.');
          }
        })
      }

      let compressionTypeId;
      let compressionTypeNameSuffix;
      let fileSuffix;

      try {
        let compressionMethod = 'toFormat';
        let compressionFormat;
        let quality;
        let compressionOptions;        

        if(contentType == "image/jpeg") {
          compressionFormat = "jpeg";
          quality = taskAppendicesConfig.imgCompressionQualitySharpToFormatJpeg;
          compressionOptions = { quality, mozjpeg: true };
          
          compressionTypeNameSuffix = taskAppendicesConfig.imgCompressionTypeNameSuffixSharpToFormatJpeg;
          fileSuffix = `_${compressionTypeNameSuffix}_quality_${quality}_mozjpeg`;          
          
          compressionTypeId = taskAppendicesConfig.imgCompressionTypeSharpToFormatJpeg;      
        } else if(contentType == "image/png") { 
          compressionFormat = "png";
          quality = taskAppendicesConfig.imgCompressionQualitySharpToFormatPng;
          compressionOptions = { quality };
          
          compressionTypeNameSuffix = taskAppendicesConfig.imgCompressionTypeNameSuffixSharpToFormatPng;
          fileSuffix = `_${compressionTypeNameSuffix}_quality_${quality}`;           
          
          compressionTypeId = taskAppendicesConfig.imgCompressionTypeSharpToFormatPng;
        }

        let compressedFilename = fileBasename + fileSuffix + fileExt;
        let compressedFilePath = uploadCompressedDir + '/' + compressedFilename;

        let originalImage = await sharp(uploadPath);
        let originalMetadata = await originalImage.metadata();
        let resizeOptions = await ref.resizeOptions(originalMetadata);

        let compressedImage = await originalImage[compressionMethod](compressionFormat, compressionOptions)
          .resize(resizeOptions)
          .toFile(compressedFilePath);

        console.log(originalMetadata, compressedImage);
        
        fs.unlink(uploadPath, err => {
            if(err) {
              console.log(err);
            }
          });

        resolve({ 
          fileSize: compressedImage.size, 
          metaData: { 
            width: compressedImage.width, 
            height: compressedImage.height, 
            originalWidth: originalMetadata.width , 
            originalHeight: originalMetadata.height
          }, 
          typeId: compressionTypeId, 
          options: compressionOptions, 
          filename: compressedFilename, 
          filePath: compressedFilePath 
        });
        
      } catch(err) {        
        reject(err);
      }
    });
  }

  createArchive = async(filePath, fileBasename, fileExt, uploadDir) => {
    return new Promise(async(resolve, reject) => {
      let archivisationTypeNameSuffix = taskAppendicesConfig.archivisationTypeNameSuffixZlibGzip;
      let fileSuffix = `_${archivisationTypeNameSuffix}`;
      let archivedFilename = fileBasename + fileSuffix + fileExt + '.gz';
      let uploadArchivedDir = uploadDir + '/' + taskAppendicesConfig.uploadArchivedSubDir;
      let archivedFilePath = uploadArchivedDir + '/' + archivedFilename;
      let archivisationTypeId = taskAppendicesConfig.archivisationTypeZlibGzip;    

      if(!fs.existsSync(uploadArchivedDir)) {   
        fs.mkdirSync(uploadArchivedDir, null, err => {
          if(err) {
            console.log(err);
            reject('Wystąpił problem z utworzeniem katalogu do zapisu zarchiwizowanych załączników.');
          }
        })
      }

      const gzip = createGzip();
      const source = fs.createReadStream(filePath);        
      const destination = fs.createWriteStream(archivedFilePath);

      var archivedFileSize = 0;
      
      gzip.on('data', function(data) {
        archivedFileSize += data.length;
      }); 
      
      try {
        await pipelineAsync(source, gzip, destination);

        fs.unlink(filePath, err => {
          if(err) {
            console.log(err);
          }
        });

        let archivisationData = { fileSize: archivedFileSize, typeId: archivisationTypeId, filename: archivedFilename, filePath: archivedFilePath };  
        resolve(archivisationData);
      } catch(err) {
        console.log(err);
      }
    });  
  }

  sendToTranslator = (uploadPath, originalFilename, filename, fileSize, contentType, tags, taskId, resolve, reject, archivisationData, compressionData) => {
    // fs.createReadStream(uploadPath).on('error', function(err) {
    //   console.log(err);
    //   return reject('Wystąpił problem z utworzeniem strumienia do odczytu pliku załącznika.');
    // }).pipe(concat({ encoding: 'buffer' }, function (data) {
      var formData = new FormData();
      formData.append("originalFilename", originalFilename);
      formData.append("filename", filename);
      formData.append("path", uploadPath);
      formData.append("size", fileSize);
      formData.append("contentType", contentType);
      formData.append("tags", JSON.stringify(tags));
      // formData.append("data", data);                  

      if(compressionData) {
        formData.append("compressed", 1);
        formData.append("compression", JSON.stringify(compressionData));
      } else {
        formData.append("compressed", 0);
      }

      if(archivisationData) {
        formData.append("archived", 1);
        formData.append("archivisation", JSON.stringify(archivisationData));
      } else {
        formData.append("archived", 0);
      }

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
    // }));
  }

  create = async (taskId, file, tags) =>  {
    let ref = this;

    return new Promise(async (resolve, reject) => { 
      let uploadDir = taskAppendicesConfig.uploadDir + '/' + taskId;
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
            reject('Wystąpił problem z utworzeniem katalogu do zapisu załączników.');
          }
        })
      }

      try{       
        fsExtra.moveSync(filePath, uploadPath);
      } catch(err) {
        console.log(err);
        reject('Wystąpił problem z przeniesieniem załącznika do katalogu docelowego.');
      }

      try{
        if(contentType == "image/jpeg" || contentType == "image/png") {
          let compressionData = await ref.compressImages(contentType, fileBasename, fileExt, uploadDir, uploadPath);
          let archivisationData = await ref.createArchive(compressionData.filePath, compressionData.filename, path.extname(compressionData.filename), uploadDir);
          ref.sendToTranslator(uploadPath, originalFilename, filename, fileSize, contentType, tags, taskId, resolve, reject, archivisationData, compressionData);
        } else {
          let archivisationData = await ref.createArchive(uploadPath, fileBasename, fileExt, uploadDir);
          ref.sendToTranslator(uploadPath, originalFilename, filename, fileSize, contentType, tags, taskId, resolve, reject, archivisationData);
        }
      } catch(err) {
        console.log(err);
        reject(err);
      }
    });
      
  }

  delete = (appendixId) => {
    return new Promise(async(resolve, reject) => {
      let appendix = await this.get(appendixId);
      let path;
      
      if(appendix['archiwizacja'] == 1) {
        path = appendix['archiwizacja_sciezka'];
      } else if(appendix['kompresja'] == 1) {
        path = appendix['kompresja_sciezka'];   
      } else {
        path = appendix['sciezka'];
      }

      fs.unlink(path, err => {
        if(err) {
          console.log(err);
        }

        axios.delete(`${appConfig.URLs.translator}/appendices/${appendixId}`).then((response) => {        
          parseResponse(response).then((response) => {            
            resolve(`Pomyślnie usunięto plik załącznika ${path}.`);
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