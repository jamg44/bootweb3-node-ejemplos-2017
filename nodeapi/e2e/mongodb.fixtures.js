'use strict';
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

module.exports.initUsuarios = async function() {
  await Usuario.deleteMany();
  await Usuario.insertMany([
    { email: 'admin@example.com', password: Usuario.hashPassword('1234'), name: 'admin' }
  ]);
}
