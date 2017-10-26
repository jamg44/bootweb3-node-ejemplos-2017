'use strict';

const cote = require('cote');

const responder = new cote.Responder({ name: 'currency conversion responder' });

const rates = {
  usd_eur: 0.91,
  eur_usd: 1.10
}

// amount: 100, from: eur, to: usd
responder.on('convert', (req, done) => {
  console.log('petición de', req.from, req.to, req.amount);
  const result = rates[`${req.from}_${req.to}`] * req.amount;
  done(result);
});
