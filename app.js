var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var path = require('path');
var indexRouter = require('./routes/index');
var twitRouter = require('./routes/twit');
require('dotenv').config();
var mongoose = require('mongoose');
var app = express();

mongoose.connect(process.env.MONGODBURL,(err,result) =>{
  if(err) {
      console.log(err,333)
  }else{
      console.log('Database connected successfully');
  }

})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
 app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/twitts', twitRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
