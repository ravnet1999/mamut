const nodemailer = require('nodemailer');
const mailerConfig = require('../../config/mailer.json');

class Mailer {
    constructor() {
        this.transporter = nodemailer.createTransport(mailerConfig);
    }

    send = (from, to, subject, text, html) => {
        this.transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html
        });
    }

    getConfig = () => {
        return mailerConfig;
    }
}

module.exports = new Mailer();