const jwt = require("jsonwebtoken");
const appConfig = require('../config/appConfig.json');
const response = require('../src/response');

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    response(res, true, ['Wymagany token.'], [], '/');
  }
  try {
    const decoded = jwt.verify(token, appConfig.JWT_TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    response(res, true, ['Nieprawidłowy.'], [], '/');
  }
  return next();
};

module.exports = verifyToken;