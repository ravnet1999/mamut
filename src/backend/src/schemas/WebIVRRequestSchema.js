const mongodb = require("mongoose");
const webIVRRequestBodySchema = require("../schemas/WebIVRRequestBodySchema");
const webIVRRequestObjPropsSchema = require("../schemas/WebIVRRequestObjPropsSchema");
const webIVRRequestHeadersSchema = require("../schemas/WebIVRRequestHeadersSchema");

let webIVRRequestSchema = new mongodb.Schema(
  {
    bodyRaw: String,
    body: webIVRRequestBodySchema,
    objProps: webIVRRequestObjPropsSchema,
    headers: webIVRRequestHeadersSchema,
  },
  {
    timestamps: true,
  }
);

module.exports = webIVRRequestSchema;
