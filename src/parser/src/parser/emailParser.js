const imap = require('imap-simple');
const mailParser = require('mailparser').simpleParser;
const emailConfig = require('../../config/email.json');

const readEmails = () => {
    return new Promise((resolve, reject) => {
        imap.connect(emailConfig).then((connection) => {
            return connection.openBox('Inbox').then(() => {
                let searchCriteria = [
                    'UNSEEN'
                ];
        
                let fetchOptions = {
                    bodies: [
                        'HEADER',
                        'TEXT',
                        ''
                    ],
                    markSeen: false
                };
        
                return connection.search(searchCriteria, fetchOptions).then((results) => {
                    let contents = results.map((result) => {
                        let parts = result.parts.filter((part) => {
                            return part.which == '';
                        });
    
                        return parts[0].body;
                    });
                    
                    let parsedEmails = [];
                    
                    contents.map((content) => {
                        mailParser(content, (err, mail) => {
                            if(err) {
                                reject(err);
                                return;
                            }

                            parsedEmails.push(mail);

                            if(parsedEmails.length == contents.length) {
                                resolve(parsedEmails);
                                return;
                            }
                        });
                    });
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    });
}

module.exports = readEmails;