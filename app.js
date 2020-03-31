const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const indexRouter = require('./api/routes/index');
const usersRouter = require('./api/routes/users');
const productsRouter = require('./api/routes/products');
const ordersRouter = require('./api/routes/orders');
const blogRouter = require('./api/routes/blog')

const app = express();
app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/blog', blogRouter);

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
