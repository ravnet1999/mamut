const mongodb = require("mongoose");
const webIVRRequestObjPropsSchema = require("../schemas/WebIVRRequestObjPropsSchema");

module.exports = mongodb.model(
  "WebIVRRequestObjProps",
  webIVRRequestObjPropsSchema
);
