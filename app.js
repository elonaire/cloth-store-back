const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

const indexRouter = require('./api/routes/index');
const usersRouter = require('./api/routes/users');
const productsRouter = require('./api/routes/products');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);

app.use((err, req, res, next) => {
    if (err) {
      res.status(500).json(err);
    }else {
      res.status(404).json({
        message: 'Resource not found'
      });
    }
  });

module.exports = app;
