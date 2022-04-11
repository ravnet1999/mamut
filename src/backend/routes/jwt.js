const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const response = require('../src/response');
const appConfig = require('../config/appConfig.json');

const JwtUser = require("../src/models/JwtUser");


router.post('/register', [], async (req, res, next) => {
  // Our register logic starts here
  try {
    // Get user input
    const { login, password } = req.body;

    // Validate user input
    if (!(login && password)) {      
      response(res, true, ['Wymagany login i hasło.', JSON.stringify(err)], []);
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await JwtUser.findOne({ login });

    if (oldUser) {      
      response(res, true, ['Taki użytkownik już istnieje.'], []);
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const jwtUser = await JwtUser.create({
      login: login.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: jwtUser._id, login },
      appConfig.JWT_TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    jwtUser.token = token;

    // return new user
    response(res, false, ['Pomyślnie zarejestrowano.'], [ jwtUser ]);

  } catch (err) {
    response(res, true, ['Wystąpił problem z rejestracją.', JSON.stringify(err)], []);
  }    
});

router.post('/login', [], async (req, res, next) => {
  // Our login logic starts here
  try {
    // Get user input
    const { login, password } = req.body;

    // Validate user input
    if (!(login && password)) {
      response(res, true, ['Wymagany login i hasło.'], []);
    }
    // Validate if user exist in our database
    const jwtUser = await JwtUser.findOne({ login });

    if (jwtUser && (await bcrypt.compare(password, jwtUser.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: jwtUser._id, login },
        appConfig.JWT_TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      jwtUser.token = token;

      // user
      response(res, false, ['Pomyślnie zalogowano.'], [ jwtUser ]);
    }    
    response(res, true, ['Nieprawidłowy login lub hasło.'], []);
  } catch (err) {
    console.log(err)
    response(res, true, ['Wystąpił problem z logowaniem.', JSON.stringify(err)], []);
  }
    
});

module.exports = router;



