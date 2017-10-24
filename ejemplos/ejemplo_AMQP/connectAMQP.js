'use strict';

const amqplib = require('amqplib'); // 'amqplib/callback_api' 

const url = process.env.AMQP_URL || 'amqp://msesevfo:c7IFnk5fnLXGmf-RslX8HCq3lq4y4OyE@impala.rmq.cloudamqp.com/msesevfo';

const connectionPromise = amqplib.connect(url)
.catch(err => {
  console.log('[AMQP]', err);
});

module.exports = connectionPromise;
