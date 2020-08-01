
const mongodb = require('mongoose');

let tokenSchema = new mongodb.Schema({
    userId: Number,
    token: String,
    active: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
});

module.exports = tokenSchema;