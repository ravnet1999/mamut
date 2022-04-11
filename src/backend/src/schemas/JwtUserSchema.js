const mongodb = require("mongoose");

let jwtUserSchema = new mongodb.Schema(
  {
    login: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
  },
  {
    timestamps: false,
  }
);

module.exports = jwtUserSchema;
