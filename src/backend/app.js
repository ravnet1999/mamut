var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongodb = require('mongoose');
const dbConfig = require('./config/database.json');
const accessMiddleware = require('./middleware/access');
const jsonMiddleware = require('./middleware/json');
const fs = require('fs');
const https = require('https')

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
    'representatives',
    'services'
];

let routers = endpoints.map((endpoint) => {
    return [ `/api/${endpoint}`, require(`./routes/${endpoint}`) ];
});

var app = express();

app.use(accessMiddleware);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/parser', express.static(path.join(__dirname, 'public', 'parser')));

routers.map((router) => {
    app.use(`${router[0]}`, [accessMiddleware, jsonMiddleware], router[1]);
});

app.use('/admin', [accessMiddleware], express.static(path.join(__dirname, 'public', 'admin')));
app.use('/parser', [accessMiddleware], express.static(path.join(__dirname, 'public', 'parser')));

app.use('/admin/*', [accessMiddleware], express.static(path.join(__dirname, 'public', 'admin')));
app.use('/parser/*', [accessMiddleware], express.static(path.join(__dirname, 'public', 'parser')));

https.createServer({
    // key: fs.readFileSync('/certs/ravnet22.key'),
    // cert: fs.readFileSync('/certs/ravnet22.crt'),
    // passphrase: undefined
}, app).listen(8080);

module.exports = app;
