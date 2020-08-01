const mongodb = require('mongoose');

class Service {
    constructor(model) {
        this.model = model;
    }

    insert = (values) => {
        return new Promise((resolve, reject) => {
            this.model.create(values).then((result) => {
                resolve(result);
                return;
            }).catch((err) => {
                reject(err);
                return;
            });
        });
    }

    checkIfExists = (query) => {
        return new Promise((resolve, reject) => {
            this.model.findOne(query).then((result) => {
                resolve(result ? true : false);
                return;
            }).catch((err) => {
                reject(err);
                return;
            });
        });
    }
}

module.exports = Service;