const Cookies = require('universal-cookie');
const response = require('../src/response');
const tokenService = require('../src/service/TokenService');
const appConfig = require('../config/appConfig.json');

const auth = (req, res, next) => {
    const cookies = new Cookies(req.headers.cookie);
    let authCookie = { userId: -1, token: "0" };
    authCookie = cookies.cookies[appConfig.cookies.auth.name] ? JSON.parse(cookies.cookies[appConfig.cookies.auth.name]) : authCookie;

    tokenService.find(authCookie.userId, authCookie.token).then((docToken) => {
        // if(!docToken) {
        //     response(res, true, ['Nie znamy użytkownika, za którego się podajesz.'], [], '/');
        //     return;
        // }
        // req.operatorId = docToken.userId;
        req.operatorId = 1;
        next();
    }).catch((err) => {
        response(res, true, ['Wystąpił problem podczas próby autoryzacji', JSON.stringify(err)], [], '/login');
        return;
    });
}

module.exports = auth;