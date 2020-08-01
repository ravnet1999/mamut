const Token = require('../models/TokenModel');
const crypto = require('crypto');

class TokenService {
    create = (userId) => {
        return new Promise((resolve, reject) => {
            Token.create({
                userId: userId,
                token: crypto.randomBytes(16).toString('hex'),
                active: true
            }).then((docToken) => {
                resolve(docToken);
                return;
            }).catch((err) => {
                reject(err);
                return;
            });
        });
    }

    find = (userId, token) => {
        return new Promise((resolve, reject) => {
            Token.findOne({
                userId: userId,
                token: token,
                active: true
            }).then((docToken) => {
                resolve(docToken);
                return;
            }).catch((err) => {
                reject(err);
                return;
            });
        });
    }
}

module.exports = new TokenService();