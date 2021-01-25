const imap = require('imap-simple');
const mailParser = require('mailparser').simpleParser;
const emailConfig = require('../../config/email.json');

const readEmails = () => {
    let conn = null;

    return imap.connect(emailConfig).then((connection) => {
        conn = connection;
        return conn.openBox('Inbox');
    }).then(() => {
        let searchCriteria = [
            'UNSEEN'
        ];

        let fetchOptions = {
            bodies: [
                'HEADER',
                'TEXT',
                ''
            ],
            markSeen: true
        };

        return conn.search(searchCriteria, fetchOptions);
    }).then((results) => {
        let contents = results.map((result) => {
            let parts = result.parts.filter((part) => {
                return part.which == '';
            });

            return parts[0].body;
        });
        
        let parsedEmails = [];

        return new Promise((resolve, reject) => {
            if(contents.length == 0) {
                reject('No emails to parse.');
                return;
            }
            contents.map((content) => {
                console.log('Parsing: ', content);
                mailParser(content, (err, mail) => {
                    if(err) {
                        conn.end();
                        reject(err);
                        return;
                    }
    
                    parsedEmails.push(mail);
    
                    if(parsedEmails.length == contents.length) {
                        conn.end();
                        resolve(parsedEmails);
                        return;
                    }
                });
            });
        });
    });
}

module.exports = readEmails;