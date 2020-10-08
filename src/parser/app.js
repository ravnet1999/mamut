var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongodb = require('mongoose');
const dbConfig = require('./config/database.json');
const accessMiddleware = require('./middleware/access');
const jsonMiddleware = require('./middleware/json');
const readEmailsAutomation = require('./automation/readEmails');
const insertEmailsAutomation = require('./automation/insertEmails');

const endpoints = [
    'emails',
    'auth',
    'fetch_emails',
    'company_emails'
];

let routers = endpoints.map((endpoint) => {
    return [ `/api/${endpoint}`, require(`./routes/${endpoint}`) ];
});

const dbPath = 'mongodb://' + dbConfig.username + ':' + dbConfig.password + '@' + dbConfig.host + ':' + dbConfig.port + dbConfig.database;

mongodb.connect(dbPath, {
    useNewUrlParser: true,
    poolSize: 10,
    useUnifiedTopology: true
});

let db = mongodb.connection;

db.once('error', () => {
    console.log('MongoDB connection error!');
});

let automations = [
    // readEmailsAutomation,
    // insertEmailsAutomation
];

let intervals = [];

db.once('open', () => {
    console.log('Connected to MongoDB');
    // insertEmailsAutomation.method();

    intervals = automations.map((automation) => {
        return setInterval(automation.method, automation.interval);
    });
});

var app = express();

app.use(accessMiddleware);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

routers.map((router) => {
    app.use(`${router[0]}`, [accessMiddleware, jsonMiddleware], router[1]);
});

app.use('/admin/', [accessMiddleware], express.static(path.join(__dirname, 'public', 'admin')));
app.use('/admin/*', [accessMiddleware], express.static(path.join(__dirname, 'public', 'admin')));

module.exports = app;
