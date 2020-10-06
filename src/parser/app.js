var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongodb = require('mongoose');
const dbConfig = require('./config/database.json');
const corsMiddleware = require('./middleware/cors');
const readEmailsAutomation = require('./automation/readEmails');
const insertEmailsAutomation = require('./automation/insertEmails');

const endpoints = [
    'emails',
    'auth',
    'fetch_emails',
    'company_emails'
];

let routers = endpoints.map((endpoint) => {
    return [ endpoint, require(`./routes/${endpoint}`) ];
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

    intervals = automations.map((automation) => {
        return setInterval(automation.method, automation.interval);
    });
});

var app = express();

app.use(corsMiddleware);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

routers.map((router) => {
    app.use(`/${router[0]}`, router[1]);
});

module.exports = app;
