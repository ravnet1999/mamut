const appConfig = require('../../config/appConfig.json');
const multer = require('multer');

const multiparty = require('multiparty');
const fs = require('fs');

var request = require('request');
var concat = require('concat-stream');

// var storage = taskId => {
//   var uploadDir = appConfig.tasksAppendicesUploadDir + '/' + taskId;
//   if (!fs.existsSync(uploadDir)){
//     fs.mkdirSync(uploadDir);
//   }

//   return multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname );
//     }
//   });
// }

class AppendixService {
  create = (taskId, req, res) => {
  //   var upload = multer({ storage: storage(taskId) }).single('task-appendix');

  //   return new Promise((resolve, reject) => {    
  //     upload(req, res, function (err) {
  //       if (err instanceof multer.MulterError) {
  //           return reject(err);
  //       } else if (err) {
  //           return reject(err);
  //       }
  //       return resolve({ resources: req.file });  
  //     }) 
  //   });
    
    // var form = new multiparty.Form({ autoFields: true, autoFiles: true, uploadDir: appConfig.tasksAppendicesUploadDir + '/' + taskId});
    var form = new multiparty.Form();

    return new Promise((resolve, reject) => {  
      form.on('error', function(err) {
        return reject(err);
      });

      form.parse(req, function(err, fields, files) {
        if(files) {
          let file = Object.values(files)[0][0];

          // var formData = {
          //   fields: ['task-appendix'],
          //   "task-appendix": fs.createReadStream(file.path)
          // };

          // request.post({
          //     url: `${appConfig.URLs.translator}/appendices/${taskId}`,
          //     formData
          // }, function optionalCallback(err, httpResponse, body) {
          //     if (err) {
          //       return reject(err);
          //     }
          //     return resolve({ resources: body });
          // });

          fs.createReadStream(file.path).pipe(concat({ encoding: 'buffer' }, function (data) {
            // let r = request.post(`${appConfig.URLs.translator}/appendices/${taskId}`, function (err, resp, body) {    
               
            // });
    
            // const form = r.form();
            // form.append('uploaded_file', data, {
            //   filename: file.originalFilename,
            //   contentType: file.headers["content-type"]
            // });

            var formData = {
              data,
              filename: file.originalFilename,
              contentType: file.headers["content-type"]
            };

            console.log(file)

            let r = request.post({url: `${appConfig.URLs.translator}/appendices/${taskId}`, formData}, function (err, resp, body) {    
              return resolve({ resources: body });  
            });
          }))
        }
      });        
    });
  }
}

module.exports = new AppendixService();