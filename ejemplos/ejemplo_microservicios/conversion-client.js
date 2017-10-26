'use strict';

const cote = require('cote');

const requester = new cote.Requester({ name: 'currency conversion client' });

setInterval(() => {

  requester.send({
    type: 'convert',
    from: 'usd',
    to: 'eur',
    amount: 100
  }, res => {
    console.log(`100 usd --> ${res} eur`);
  });

}, 1000);
