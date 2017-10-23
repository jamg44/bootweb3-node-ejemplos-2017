'use strict';

const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

var Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
