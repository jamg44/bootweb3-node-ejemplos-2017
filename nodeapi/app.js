var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Conexion a la base de datos
require('./lib/connectMongoose');
require('./models/Agente');

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

const loginController = require('./routes/loginController');

app.use('/', require('./routes/index'));
app.use('/hola', require('./routes/hola').router);

// usamos las rutas de un controlador
app.get('/login', loginController.index);

app.use('/users', require('./routes/users'));
app.use('/apiv1/agentes', require('./routes/apiv1/agentes'));

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
