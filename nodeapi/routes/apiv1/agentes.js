"use strict";

const express = require('express');
const router = express.Router();

// Le pedimos a mongoose que nos de el modelo de Agente
// const mongoose = require('mongoose');
// const Agente = mongoose.model('Agente');

const Agente = require('../../models/Agente');


router.get('/', (req, res, next) => {
  // recuperar una lista de agentes
  Agente.find({}, (err, lista) => {
    if (err) {
      console.log('Error', err);
      next(err); // para que retorne la página de error
      return;
    }
    res.json({ success: true, rows: lista });
  });
});

module.exports = router;