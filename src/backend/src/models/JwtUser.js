const mongodb = require("mongoose");
const jwtUserSchema = require("../schemas/JwtUserSchema");

module.exports = mongodb.model(
  "JwtUser",
  jwtUserSchema
);
