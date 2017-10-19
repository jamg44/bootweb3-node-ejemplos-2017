var express = require('express');
const i18n = require('i18n');
var router = express.Router();

const { query, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', function(req, res, next) {

  const segundo = new Date().getSeconds();

  res.render('index', { 
    title: 'Express',
    valor: `<script>alert("${ i18n.__('envia 1 bitcoin a .... para limpiar tu navegador') }")</script>`,
    condicion: {
      segundo: segundo,
      estado: segundo % 2 === 0,
    },
    users: [
      { name: 'Jones', age: 29 },
      { name: 'Smith', age: 48 },
      { name: 'Brown', age: 33 }
    ]
  });
});

router.get('/hola', (req, res, next) => {
  res.render('hola');
});

// recibimos parámetros en la ruta
router.get('/ruta/:algo', (req, res, next) => { // podemos poner '/ruta/:algo? y seria opcional
  console.log('parámetro en ruta', req.params);
  res.send('ok ' + req.params.algo);
});

router.get('/calle/:calle/numero/:numero([0-9]+)/piso/:piso/puerta/:puerta(a|b|c)?', (req, res, next) => {
  console.log('parámetro en ruta', req.params);
  res.send('ok');
});

router.get('/query', (req, res, next) => {
  console.log('parámetro en query string', req.query);
  res.send('ok');
});

router.post('/ruta', (req, res, next) => {
  console.log('recibimos body con', req.body);
  res.send('ok');
});

// validaciones
router.get('/querystring', [
  query('age').isNumeric().withMessage('must be numeric')
], (req, res, next) => {
  validationResult(req).throw();
  console.log('req.query', req.query);
  //User.find({name: req.name});
  res.send('ok');
});

module.exports = router;
