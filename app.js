const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

const config = require('./config');
const { setSessionFlash } = require('./middlewares/index');

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', err => console.log(err));
db.once('open', () => {
  console.log('数据库连接成功');
});

const index = require('./routes/index');
const user = require('./routes/user');

const app = express();

// view engine setup
app.engine('art', require('express-art-template'));
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: config.SECRET,
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.setFlash = (msg, redirectUrl, msgType = 'error') => {
    req.session.sessionFlash = {
      type: msgType,
      message: msg
    };

    redirectUrl && res.redirect(redirectUrl);
  };
  next();
});

app.use(setSessionFlash);

app.use('/', index);
app.use('/user', user);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.art');
});

module.exports = app;
