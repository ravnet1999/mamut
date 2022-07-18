const appConfig = require('../../config/appConfig.json');
const taskAppendicesConfig = require('../../config/taskAppendices.json');

const fs = require('fs');
const fsExtra = require('fs-extra');
const sharp = require("sharp");
const path = require('path');
const { createGzip, createBrotliCompress } = require('zlib');
const zlib = require('zlib');
const { pipeline } = require('stream');

const axios = require('axios');
var concat = require('concat-stream');
var FormData = require('form-data');

const parseResponse = require('../ResponseParser');

class AppendixService {
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

      let dimensions;      

      try{
        let result;
        if(contentType == "image/jpeg" || contentType == "image/png") {
          let metadata = await sharp(uploadPath).metadata();
          dimensions = { width: metadata.width, height: metadata.height };

          let compressionData = await ref.compressImages(contentType, fileBasename, fileExt, uploadDir, uploadPath);
          let resizeData = await ref.resizeImages(path.basename(compressionData.filename, fileExt), fileExt, uploadDir, compressionData.filePath);

          let archivisationData;

          if(resizeData) {             
            archivisationData = await ref.createArchive(resizeData.filePath, resizeData.filename, fileExt, resizeData.fileSize, uploadDir);            
          } else {
            archivisationData = await ref.createArchive(compressionData.filePath, compressionData.filename, fileExt, compressionData.fileSize, uploadDir);            
          }

          result = await ref.sendToTranslator(uploadPath, originalFilename, filename, fileSize, contentType, tags, taskId, dimensions, "1", "1", resizeData ? "1" : "0");                                  
          let appendixId = result.resources.resources[0].id;
          
          result = ref.sendOperationToTranslator(appendixId, compressionData);
          result = ref.sendOperationToTranslator(appendixId, archivisationData);

          if(resizeData) {            
            result = ref.sendOperationToTranslator(appendixId, resizeData);
          }
        } else {                    
          result = await ref.sendToTranslator(uploadPath, originalFilename, filename, fileSize, contentType, tags, taskId, dimensions, "1", "0", "0");
          let appendixId = result.resources.resources[0].id;          
          let archivisationData = await ref.createArchive(uploadPath, fileBasename, fileExt, fileSize, uploadDir);
          result = ref.sendOperationToTranslator(appendixId, archivisationData);
        }
        
        resolve(result);
      } catch(err) {
        console.log(err);
        reject(err);
      }
    });      
  }

  compressImages = async(contentType, fileBasename, fileExt, uploadDir, uploadPath) => {
    let ref = this;

    return new Promise(async(resolve, reject) => { 
      let start = Date.now();
      
      let compressionUploadDir = ref.createUploadDir(uploadDir, taskAppendicesConfig.compression);

      try {
        let compressionMethod = 'toFormat';
        let compressionFormat;
        let compressionConfig;

        if(contentType == "image/jpeg") {
          compressionFormat = "jpeg";
          compressionConfig = taskAppendicesConfig.compression["sharp_to_format_jpeg"];
        } else if(contentType == "image/png") { 
          compressionFormat = "png";
          compressionConfig = taskAppendicesConfig.compression["sharp_to_format_png"];
        }

        let quality = compressionConfig.quality;
        let compressionArgs = { quality };
        let filenameSuffix = `_${compressionConfig.filenameSuffix}_quality_${quality}`;
        
        if(contentType == "image/jpeg") { 
          compressionArgs.mozjpeg = true; 
          filenameSuffix += ' _mozjpeg';
        }                 
        
        let { filename: compressedFilename, filePath: compressedFilePath } = ref.getProcessedFileData(fileBasename, filenameSuffix, fileExt, compressionUploadDir);
                
        let compressedImage = await sharp(uploadPath)[compressionMethod](compressionFormat, compressionArgs).toFile(compressedFilePath);
        let stop = Date.now();
        let timeElapsed = (stop - start) / 1000;
        
        fs.unlink(uploadPath, err => {
          if(err) {
            console.log(err);
          }
        });

        let compressionTypeId = compressionConfig.type;

        resolve({ 
          fileSize: compressedImage.size, 
          dimensions: { 
            width: compressedImage.width, 
            height: compressedImage.height
          }, 
          typeId: compressionTypeId, 
          args: compressionArgs,
          configuration: compressionConfig,
          runtimeVars: { timeElapsed },
          filename: compressedFilename, 
          filePath: compressedFilePath 
        });
        
      } catch(err) {        
        reject(err);
      }
    });
  }

  resizeImages = async(fileBasename, fileExt, uploadDir, uploadPath) => {
    let ref = this;

    return new Promise(async(resolve, reject) => { 
      let start = Date.now();

      let resizedUploadDir = ref.createUploadDir(uploadDir, taskAppendicesConfig.resize);

      try {
        let resizeMethod = "resize";
        let resizeConfig = taskAppendicesConfig.resize["sharp_resize"];

        let originalImage = await sharp(uploadPath);
        let originalMetadata = await originalImage.metadata();        
        let resizeArgs = await ref.resizeArgs(resizeConfig, originalMetadata);
        
        let shouldBeResized = resizeArgs.scale > 1;

        if(!shouldBeResized) {
          resolve(false);
          return;
        }

        let filenameSuffix = `_${resizeConfig.filenameSuffix}_ratio_${resizeArgs.scale}`;
        
        let { filename: resizedFilename, filePath: resizedFilePath } = ref.getProcessedFileData(fileBasename, filenameSuffix, fileExt, resizedUploadDir, resizeConfig.fileExtToAppend);

        let resizedImage = originalImage;
        let timeElapsed;

        if(shouldBeResized) {          
          resizedImage = await originalImage[resizeMethod](resizeArgs.args);
        }

        resizedImage = await resizedImage.toFile(resizedFilePath);

        if(shouldBeResized) {          
          let stop = Date.now();
          timeElapsed = (stop - start) / 1000;
        }
        
        fs.unlink(uploadPath, err => {
            if(err) {
              console.log(err);
            }
          });

        let runtimeVars = { scale: resizeArgs.scale };
        
        if(shouldBeResized) runtimeVars.timeElapsed = timeElapsed;

        let resizeTypeId = resizeConfig.type;

        resolve({ 
          fileSize: resizedImage.size, 
          dimensions: { 
            width: resizedImage.width, 
            height: resizedImage.height
          }, 
          typeId: resizeTypeId, 
          args: resizeArgs.args,
          configuration: resizeConfig,
          runtimeVars,
          filename: resizedFilename, 
          filePath: resizedFilePath 
        });
        
      } catch(err) {        
        reject(err);
      }
    });
  }

  resizeArgs = async (resizeConfig, metadata) => {
    let width = metadata.width;
    let height = metadata.height;

    let longerSide = Math.max(width, height);
    let shorterSide = Math.min(width, height);

    let expectedLongerSide = Math.max(resizeConfig.width, resizeConfig.height);
    let expectedShorterSide = Math.min(resizeConfig.width, resizeConfig.height);

    let scale = Math.max(longerSide / expectedLongerSide, shorterSide / expectedShorterSide);
    
    let args = {
      width: Math.round(width / scale)
    };

    return { args, scale };
  }

  createArchive = async(filePath, fileBasename, fileExt, fileSize, uploadDir) => {
    let ref = this;

    return new Promise(async(resolve, reject) => { 
      let start = Date.now();

      let archivisationUploadDir = ref.createUploadDir(uploadDir, taskAppendicesConfig.archivisation);

      let archivisationConfig = taskAppendicesConfig.archivisation[taskAppendicesConfig.archivisation.type];
      let filenameSuffix = `_${archivisationConfig.filenameSuffix}`;
      
      let { filename: archivedFilename, filePath: archivedFilePath } = ref.getProcessedFileData(fileBasename, filenameSuffix, fileExt, archivisationUploadDir);

      let archivisationObject;
      let archivisationArgs;
      
      switch(taskAppendicesConfig.archivisation.type) {
        case("zlib_brotli"): 
          archivisationArgs = {
            chunkSize: 32 * 1024,
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]: 9,
              [zlib.constants.BROTLI_PARAM_SIZE_HINT]: fileSize
            }
          };
          archivisationObject = createBrotliCompress(archivisationArgs);
          break;
        case("zlib_gzip"): archivisationObject = createGzip();
        default: archivisationObject = createGzip();
      }

      const source = fs.createReadStream(filePath);        
      const destination = fs.createWriteStream(archivedFilePath);

      var archivedFileSize = 0;
      
      archivisationObject.on('data', function(data) {
        archivedFileSize += data.length;
      }); 
             
        pipeline(source, archivisationObject, destination, (err) => {
          if(err) {
            console.log(err);
            reject(err);
          }

          let stop = Date.now();
          let timeElapsed = (stop - start)/1000;

          fs.unlink(filePath, err => {
            if(err) {
              console.log(err);
            }
          });

          let archivisationTypeId = archivisationConfig.type;

          let archivisationData = { 
            fileSize: archivedFileSize, 
            typeId: archivisationTypeId, 
            args: archivisationArgs,
            configuration: archivisationConfig,
            filename: archivedFilename, 
            filePath: archivedFilePath,
            runtimeVars: { timeElapsed },
          };

          resolve(archivisationData);
        });
    });  
  }

  createUploadDir = (uploadDir, operationConfig) => {
    let operationUploadDir = uploadDir + '/' + operationConfig.uploadDir;

    if(!fs.existsSync(operationUploadDir)) {   
      fs.mkdirSync(operationUploadDir, null, err => {
        if(err) {
          console.log(err);            
        }
        return operationUploadDir;
      })
    }

    return operationUploadDir;
  }

  getProcessedFileData = (fileBasename, filenameSuffix, fileExt, uploadDir, fileExtToAppend) => {
    let filename = fileBasename + filenameSuffix + fileExt;
    let filePath = uploadDir + '/' + filename;
    if(fileExtToAppend) filePath += `.${fileExtToAppend}`;
    return { filename, filePath };
  }

  sendToTranslator = async(uploadPath, originalFilename, filename, fileSize, contentType, tags, taskId, dimensions, archived, compressed, resized) => {
    return new Promise(async(resolve, reject) => {      
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
        if(dimensions) formData.append("dimensions", JSON.stringify(dimensions));
        formData.append("compressed", compressed);
        formData.append("archived", archived);
        formData.append("resized", resized);
        
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
            resolve({ resources: result });      
          }).catch((err) => {
            console.log(err);
            reject(err);                  
          });
        }).catch((err) => {
          console.log(err);
          reject('Wystąpił problem z połączeniem z translatorem.');
        });
      // }));
    });
  }

  sendOperationToTranslator = async(appendixId, operationData) => {
    return new Promise(async(resolve, reject) => {
        var formData = new FormData();
        formData.append("operationData", JSON.stringify(operationData));

        axios({
          method: 'post',
          url: `${appConfig.URLs.translator}/appendices/operations/${appendixId}`,
          data: formData,
          headers: formData.getHeaders()
        })
        .then((response) => {
          parseResponse(response).then((result) => {
            resolve({ resources: result });      
          }).catch((err) => {
            console.log(err);
            reject(err);                  
          });
        }).catch((err) => {
          console.log(err);
          reject('Wystąpił problem z połączeniem z translatorem.');
        });
      // }));
    });
  }

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

  getPath = (appendix) => {
    let path;

    if(appendix['archiwizacja'] == 1) {
      path = appendix['archiwizacja_sciezka'];
    } else if(appendix['skalowanie'] == 1) {
      path = appendix['skalowanie_sciezka'];   
    } else if(appendix['kompresja'] == 1) {
      path = appendix['kompresja_sciezka'];   
    } else {
      path = appendix['sciezka'];
    }

    return path;
  }

  getSize = (appendix) => {
    let size;
  
    if(appendix['skalowanie'] == 1) {
      size = appendix['skalowanie_rozmiar']
    } else if(appendix['kompresja'] == 1) {
      size = appendix['kompresja_rozmiar']
    } else {
      size = appendix['rozmiar'];
    }

    return size;
  }
}

module.exports = new AppendixService();