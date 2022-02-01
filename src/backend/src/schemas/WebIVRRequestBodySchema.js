const mongodb = require("mongoose");

let webIVRRequestBodySchema = new mongodb.Schema(
  {
    userId: Number,
    token: String,
    active: {
      type: Boolean,
      default: true,
    },
    API: String,
    Id: Number,
    Name: String,
    Digits: Number,
    Timeout: Number,
    Called: Number,
    Calling: String,
    Connected: Number,
    State: String,
    UserTag: String,
  },
  {
    timestamps: false,
  }
);

module.exports = webIVRRequestBodySchema;
