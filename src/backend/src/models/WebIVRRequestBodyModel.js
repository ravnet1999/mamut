const mongodb = require("mongoose");
const webIVRRequestBodySchema = require("../schemas/WebIVRRequestBodySchema");

module.exports = mongodb.model("WebIVRRequestBody", webIVRRequestBodySchema);
