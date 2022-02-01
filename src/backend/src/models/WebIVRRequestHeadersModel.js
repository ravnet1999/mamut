const mongodb = require("mongoose");
const webIVRRequestHeadersSchema = require("../schemas/WebIVRRequestHeadersSchema");

module.exports = mongodb.model(
  "WebIVRRequestHeaders",
  webIVRRequestHeadersSchema
);
