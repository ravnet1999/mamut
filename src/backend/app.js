var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongodb = require('mongoose');
const dbConfig = require('./config/database.json');
const corsMiddleware = require('./middleware/cors');

this.dbPath = 'mongodb://' + dbConfig.username + ':' + dbConfig.password + '@' + dbConfig.host + ':' + dbConfig.port + dbConfig.database;

mongodb.connect(this.dbPath, {
    useNewUrlParser: true,
    poolSize: 10,
    useUnifiedTopology: true
});

let db = mongodb.connection;

db.once('error', () => {
    console.log('MongoDB connection error!');
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

const endpoints = [
    'operators',
    'clients',
    'tasks',
    'representatives'
];

let routers = endpoints.map((endpoint) => {
    return [ endpoint, require(`./routes/${endpoint}`) ];
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
