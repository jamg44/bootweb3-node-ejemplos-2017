'use strict';

const connectionPromise = require('./connectAMQP');

const q = 'tareas';

// Publicador
// IIFE Inmediatelly Invoked Function Expression
(async () => {

  // nos aseguramos de que está conectado
  const conn = await connectionPromise;

  // conectarnos a un canal
  const ch = await conn.createChannel();

  // conecto a una cola
  await ch.assertQueue(q);
  
  // le decimos a rabbitMQ
  // cuantos mensaje puede darme 
  // en paralelo
  ch.prefetch(1);

  await ch.consume(q, function(msg) {
    console.log('recibido:', msg.content.toString());
    // procesamos el mensaje
    // ...

    setTimeout(() => { // simulamos un trabajo
      // hemos terminado de procesar
      // confirmamos a rabbit que está procesado
      ch.ack(msg); // ch.nack(msh)
    }, 1000);
    
  })

})().catch(err => console.error(err) );
