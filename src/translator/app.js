var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const endpoints = [
    'auth',
    'assignments',
    'tasks',
    'users',
    'companies',
    'channels',
    'services',
    'request_categories',
    'departments',
    'priorities',
    'episodes'
];

let routers = endpoints.map((endpoint) => {
    return [ endpoint, require(`./routes/${endpoint}`) ];
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

routers.map((router) => {
    app.use(`/${router[0]}`, router[1]);
});



module.exports = app;
