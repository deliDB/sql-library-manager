const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { sequelize } = require('./models/index.js');
const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

//Test connection to the database and sync the model
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch(error){
    console.error('Error connecting to the database.');
  }
})();

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  const err = new Error('err');
  err.status = 404;
  err.message = "Oops! Page not found. Looks like this page doesn't exist.";
  next(err);
});

// error handler
app.use( (err, req, res, next) => {
    if(err.status === 404){
    res.render('page-not-found', { err })
    console.error(`${err.status} - ${err.message}`);
  } else {
    err.status = err.status || 500;
    err.message = "Sorry! There was an unexpected error on the server."
    res.render('error', { err })
    console.error(`${err.status} - ${err.message}`);
  }
});

module.exports = app;
