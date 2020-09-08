
const mongodb = require('mongoose');

let tokenSchema = new mongodb.Schema({
    userId: {
        type: Number,
        default: null
    },
    token: {
        type: String,
        default: null
    },
    active: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
});

module.exports = tokenSchema;