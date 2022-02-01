const mongodb = require("mongoose");

let webIVRRequestObjPropsSchema = new mongodb.Schema(
  {
    ip: String,
    host: String,
    protocol: String,
    originalUrl: String,
    baseUrl: String,
    path: String,
    method: String,
    queryRaw: String,
  },
  {
    timestamps: false,
  }
);

module.exports = webIVRRequestObjPropsSchema;
