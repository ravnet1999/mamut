const mongodb = require("mongoose");
const webIVRRequestSchema = require("../schemas/WebIVRRequestSchema");

module.exports = mongodb.model("WebIVRRequest", webIVRRequestSchema);
