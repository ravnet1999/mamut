const appConfig = require('../../config/appConfig.json');
const taskAppendicesConfig = require('../../config/taskAppendices.json');

const fs = require('fs');
const fsExtra = require('fs-extra');
const sharp = require("sharp");
const path = require('path');
const { createGzip, createBrotliCompress } = require('zlib');
const zlib = require('zlib');
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

    let resizeConfig = taskAppendicesConfig.resize;

    let resizeMaxDimension = resizeConfig.maxDimension;
    let resizeMinDimension = resizeConfig.minDimension;

    let ratioMaxDimension = maxDimension / resizeMaxDimension;
    let ratioMinDimension = minDimension / resizeMinDimension;

    let ratio = Math.max(ratioMaxDimension, ratioMinDimension);
    
    let options = {
      width: Math.round(width / ratio)
    };

    return { options, ratio };
  }

  compressImages = async(contentType, fileBasename, fileExt, uploadDir, uploadPath) => {
    let ref = this;

    return new Promise(async(resolve, reject) => { 
      let compressionUploadDir = uploadDir + '/' + taskAppendicesConfig.compression.uploadDir;

      if(!fs.existsSync(compressionUploadDir)) {   
        fs.mkdirSync(compressionUploadDir, null, err => {
          if(err) {
            console.log(err);
            reject('Wystąpił problem z utworzeniem katalogu do zapisu skompresowanych załączników w formacie jpg i png.');
          }
        })
      }

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
        let compressionOptions = { quality };
        let filenameSuffix = `_${compressionConfig.filenameSuffix}_quality_${quality}`;
        
        if(contentType == "image/jpeg") { 
          compressionOptions.mozjpeg = true; 
          filenameSuffix += ' _mozjpeg';
        }                 
        
        let compressionTypeId = compressionConfig.type;

        let compressedFilename = fileBasename + filenameSuffix + fileExt;
        let compressedFilePath = compressionUploadDir + '/' + compressedFilename;

        let originalImage = await sharp(uploadPath);
        let originalMetadata = await originalImage.metadata();
        let resizeOptions = await ref.resizeOptions(originalMetadata);

        let compressedImage = await originalImage[compressionMethod](compressionFormat, compressionOptions);

        let shouldBeResized = resizeOptions.ratio > 1;

        if(shouldBeResized) {
          compressedImage = await compressedImage.resize(resizeOptions.options);  
        }

        compressedImage = await compressedImage.toFile(compressedFilePath);
        
        fs.unlink(uploadPath, err => {
            if(err) {
              console.log(err);
            }
          });

        resolve({ 
          fileSize: compressedImage.size, 
          dimensions: { 
            width: compressedImage.width, 
            height: compressedImage.height
          }, 
          typeId: compressionTypeId, 
          options: { toFormat: compressionOptions, resize: resizeOptions.options},
          configuration: { toFormat: { quality }, resize: { minDimension: taskAppendicesConfig.resize.minDimension, maxDimension: taskAppendicesConfig.resize.maxDimension, calculatedRatio: resizeOptions.ratio } },
          runtimeVars: { resize: { ratio: resizeOptions.ratio } },
          filename: compressedFilename, 
          filePath: compressedFilePath 
        });
        
      } catch(err) {        
        reject(err);
      }
    });
  }

  createArchivisationObject = (fileSize) => {
    console.log(taskAppendicesConfig.archivisation.type);

    switch(taskAppendicesConfig.archivisation.type) {
      case("zlib_brotli"): return createBrotliCompress({
        chunkSize: 32 * 1024,
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 1,
          [zlib.constants.BROTLI_PARAM_SIZE_HINT]: fileSize
        }
      });
      case("zlib_gzip"): return createGzip();
      default: return createGzip();
    }
  }

  createArchive = async(filePath, fileBasename, fileExt, fileSize, uploadDir) => {
    let ref = this;

    return new Promise(async(resolve, reject) => {      
      let archivisationConfig = taskAppendicesConfig.archivisation[taskAppendicesConfig.archivisation.type];
      let filenameSuffix = `_${archivisationConfig.filenameSuffix}`;
      let archivedFilename = fileBasename + filenameSuffix + fileExt + archivisationConfig.fileExt;
      let archivisationUploadDir = uploadDir + '/' + taskAppendicesConfig.archivisation.uploadDir;
      let archivedFilePath = archivisationUploadDir + '/' + archivedFilename;
      let archivisationTypeId = archivisationConfig.type;    

      if(!fs.existsSync(archivisationUploadDir)) {   
        fs.mkdirSync(archivisationUploadDir, null, err => {
          if(err) {
            console.log(err);
            reject('Wystąpił problem z utworzeniem katalogu do zapisu zarchiwizowanych załączników.');
          }
        })
      }

      const archivisationObject = ref.createArchivisationObject(fileSize);      
      const source = fs.createReadStream(filePath);        
      const destination = fs.createWriteStream(archivedFilePath);

      var archivedFileSize = 0;
      
      archivisationObject.on('data', function(data) {
        archivedFileSize += data.length;
      }); 
      
      try {
        let start = Date.now();
        await pipelineAsync(source, archivisationObject, destination);
        let stop = Date.now();
        console.log(`archivisation time = ${(stop - start)/1000} seconds`);

        fs.unlink(filePath, err => {
          if(err) {
            console.log(err);
          }
        });

        let archivisationData = { fileSize: archivedFileSize, typeId: archivisationTypeId, filename: archivedFilename, filePath: archivedFilePath};  
        resolve(archivisationData);
      } catch(err) {
        console.log(err);
      }
    });  
  }

  sendToTranslator = async(uploadPath, originalFilename, filename, fileSize, contentType, tags, taskId, dimensions, archived, compressed) => {
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
        formData.append("dimensions", JSON.stringify(dimensions));
        formData.append("compressed", compressed);
        formData.append("archived", archived);
        
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
        let metadata = await sharp(uploadPath).metadata();
        dimensions = { width: metadata.width, height: metadata.height };
        
        let result;
        if(contentType == "image/jpeg" || contentType == "image/png") {
          let compressionData = await ref.compressImages(contentType, fileBasename, fileExt, uploadDir, uploadPath);          
          result = await ref.sendToTranslator(uploadPath, originalFilename, filename, fileSize, contentType, tags, taskId, dimensions, "1", "1");          
          let appendixId = result.resources.resources[0].id;
          let archivisationData = await ref.createArchive(compressionData.filePath, compressionData.filename, path.extname(compressionData.filename), fileSize, uploadDir);
          result = ref.sendOperationToTranslator(appendixId, compressionData);
          result = ref.sendOperationToTranslator(appendixId, archivisationData);
        } else {          
          result = await ref.sendToTranslator(uploadPath, originalFilename, filename, fileSize, contentType, tags, taskId, dimensions, "1", "0");
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