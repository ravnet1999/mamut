
const mongodb = require('mongoose');

let emailSchema = new mongodb.Schema({
    date: Date,
    from: String,
    inserted: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

module.exports = emailSchema;