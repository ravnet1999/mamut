const appConfig = require('../../config/appConfig.json');

const multiparty = require('multiparty');
const fs = require('fs');

var request = require('request');
var concat = require('concat-stream');

class AppendixService {
  create = (taskId, req, res) => {
    var form = new multiparty.Form();

    return new Promise((resolve, reject) => {  
      form.on('error', function(err) {
        return reject(err);
      });

      form.parse(req, function(err, fields, files) {
        if(files) {
          let file = Object.values(files)[0][0];

          fs.createReadStream(file.path).pipe(concat({ encoding: 'buffer' }, function (data) {
            var formData = {
              data,
              filename: file.originalFilename,
              contentType: file.headers["content-type"],
              size: file.size
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