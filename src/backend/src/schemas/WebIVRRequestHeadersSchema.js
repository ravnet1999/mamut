const mongodb = require("mongoose");

let webIVRRequestHeadersSchema = new mongodb.Schema(
  {
    userAgent: String,
    contentType: String,
    contentLength: Number,
  },
  {
    timestamps: false,
  }
);

module.exports = webIVRRequestHeadersSchema;
