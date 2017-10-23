"use strict";

const mongoose = require('mongoose');

// le decimos a mongoose que librería de promesas usar
mongoose.Promise = global.Promise;

const conn = mongoose.connection;

conn.on('error', err => {
  console.log('Error de conexión', err);
  process.exit(1);
});

conn.once('open', () => {
  console.log('Conectado a MongoDB on', mongoose.connection.name);
});

// la cadena de conexión es como una URL pero con protocolo mongodb
mongoose.connect('mongodb://localhost/cursonode', {
  useMongoClient: true // para que no salga el DeprecationWarning
});

// no necesitamos exportar la connexión ya que mongoose
// se encarga de mantenerla internamente

module.exports = conn;