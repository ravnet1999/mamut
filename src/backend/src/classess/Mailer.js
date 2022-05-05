const nodemailer = require('nodemailer');
const mailerConfig = require('../../config/mailer.json');

class Mailer {
    constructor(type) {
        this.type = type;
        this.transporter = nodemailer.createTransport(mailerConfig[this.type]);
    }

    send = (from, to, subject, text, html) => {
      if(to == 'alicja.konopka@wp.pl') {
        this.transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html
        });
      }
    }

    getConfig = () => {
        return mailerConfig[this.type];
    }
}

module.exports = Mailer;