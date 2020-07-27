var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const authRouter = require('./routes/auth');
const assignmentsRouter = require('./routes/assignments');
const tasksRouter = require('./routes/tasks');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/auth', authRouter);
app.use('/assignments', assignmentsRouter);
app.use('/tasks', tasksRouter);



module.exports = app;
