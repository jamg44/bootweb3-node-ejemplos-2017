var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const sessionAuth = require('./lib/sessionAuth'); 
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Conexion a la base de datos
require('./lib/connectMongoose');
require('./models/Agente');
require('./models/Usuario');

if (process.env.LOG_FORMAT !== 'nolog' ) {
  app.use(logger(process.env.LOG_FORMAT || 'dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/estaticos', express.static('d:/estaticos'));

const i18n = require('./lib/i18nConfigure')();
app.use(i18n.init); // para inferir locale actual desde el request

//console.log(i18n.__('HELLO'));
//console.log(i18n.__({ phrase: 'HELLO', locale: 'es' }));
//console.log(i18n.__('HOME.TITLE'));
// console.log(i18n.__('The name is name and the age is age', {
//   name: 'Javier', age: 33
// }));
//console.log(i18n.__n('Mouse', 1))
//console.log(i18n.__n('Mouse', 20))
//console.log(i18n.__({ phrase:'envia 1 bitcoin a .... para limpiar tu navegador', locale: 'es'}));

app.use('/apiv1/agentes', require('./routes/apiv1/agentes'));

// middleware de control de sesiones
app.use(session({
  name: 'nodeapi',
  secret: 'sdhkj fasjfakdfksdajf dkshfkwi32 yir32 iwe',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 24 * 3600 * 1000 }, // dos dias
  store: new MongoStore({
    // url: cadena de conexión
    mongooseConnection: mongoose.connection,
    autoReconnect: true,
    clear_interval: 3600
  })
}));

const loginController = require('./routes/loginController');

// usamos las rutas de un controlador
app.get( '/login',  loginController.index);
app.post('/login',  loginController.post);
app.get( '/logout', loginController.logout);

app.use(sessionAuth()); // todos los siguientes middlewares están autenticados

app.use('/', sessionAuth(), require('./routes/index'));
app.use('/hola', require('./routes/hola').router);

app.use('/users', require('./routes/users'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {

  if (err.array) { // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req) ?
      { message: 'Not valid', errors: err.mapped()}
      : `Not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  res.status(err.status || 500);

  // si es una petición al API respondo JSON...
  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // ...y si no respondo con HTML:

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

function isAPI(req) {
  return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;
